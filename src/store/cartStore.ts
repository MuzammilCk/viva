/**
 * Cart Store - Zustand
 * Manages shopping cart state with persistence
 */

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"
import type { CartItem, CartState, ProductConfiguration, ShippingMethod } from "@/types"
import { getProductById } from "@/data/products"

interface CartStore extends CartState {
  // Actions
  addItem: (item: Omit<CartItem, "id" | "addedAt">) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateConfiguration: (itemId: string, configuration: ProductConfiguration) => void
  clearCart: () => void
  setPromoCode: (code: string | undefined) => void
  setShippingMethod: (method: ShippingMethod | undefined) => void
  recalculate: () => void
  getItem: (itemId: string) => CartItem | undefined
  getItemByProductVariant: (productId: string, variantId: string) => CartItem | undefined
}

const TAX_RATE = 0.08
const FREE_SHIPPING_THRESHOLD = 150
const DEFAULT_SHIPPING = 15

const shippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "5-7 business days",
    price: DEFAULT_SHIPPING,
    estimatedDays: "5-7",
    freeThreshold: FREE_SHIPPING_THRESHOLD,
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "2-3 business days",
    price: 25,
    estimatedDays: "2-3",
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    description: "Next business day",
    price: 45,
    estimatedDays: "1",
  },
]

const generateId = () => `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

const calculateTotals = (items: CartItem[], shippingMethod?: ShippingMethod, promoCode?: string) => {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * getItemPrice(item), 0)
  const tax = subtotal * TAX_RATE
  // Standard shipping is free once the subtotal reaches FREE_SHIPPING_THRESHOLD
  // (the store's single source of truth — exported). Express and overnight keep
  // their fixed premium regardless of subtotal, since the customer is paying for
  // speed, not for waived standard ground. The threshold must apply even when a
  // shippingMethod is already selected (it defaults to standard), otherwise the
  // "free shipping over $150" promise silently never triggers. A FREESHIP promo
  // code overrides everything and waives shipping on any method, any subtotal.
  const freeShipByPromo = isFreeShipPromo(promoCode)
  const isStandard = !shippingMethod || shippingMethod.id === "standard"
  const shipping =
    freeShipByPromo || (isStandard && subtotal >= FREE_SHIPPING_THRESHOLD)
      ? 0
      : shippingMethod
      ? shippingMethod.price
      : DEFAULT_SHIPPING
  const discount = promoCode ? calculateDiscount(subtotal, promoCode) : 0
  const total = subtotal + tax + shipping - discount

  return { subtotal, tax, shipping, discount, total, itemCount: items.reduce((sum, item) => sum + item.quantity, 0) }
}

const getItemPrice = (item: CartItem): number => {
  const product = getProductById(item.productId)
  if (!product) return 0

  const variant = product.variants?.find((v) => v.id === item.variantId)
  if (variant) {
    return variant.salePrice ?? variant.price
  }

  // Fallback to product base price
  return product.salePrice ?? product.price
}

const calculateDiscount = (subtotal: number, promoCode: string): number => {
  const discounts: Record<string, number> = {
    "WELCOME10": 0.10,
    "SYNTH20": 0.20,
    "MODULAR15": 0.15,
    "FREESHIP": 0, // Free shipping — waived in calculateTotals, no $ discount here
  }
  const discount = discounts[promoCode.toUpperCase()]
  return discount ? subtotal * discount : 0
}

/** Whether a promo code is recognized (case-insensitive). Used for Apply-button feedback. */
export const isValidPromoCode = (code: string): boolean =>
  typeof code === "string" && ["WELCOME10", "SYNTH20", "MODULAR15", "FREESHIP"].includes(code.toUpperCase())

/** Whether a promo code grants free shipping (overrides the threshold entirely). */
const isFreeShipPromo = (code?: string) => code?.toUpperCase() === "FREESHIP"

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      itemCount: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      currency: "USD",
      promoCode: undefined,
      shippingMethod: shippingMethods[0],

      // Actions
      addItem: (item) => {
        const { items } = get()
        const existingIndex = items.findIndex(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        )

        if (existingIndex >= 0) {
          const updatedItems = [...items]
          updatedItems[existingIndex].quantity += item.quantity
          if (item.configuration) {
            updatedItems[existingIndex].configuration = item.configuration
          }
          set({ items: updatedItems })
        } else {
          const newItem: CartItem = {
            ...item,
            id: generateId(),
            addedAt: new Date().toISOString(),
          }
          set({ items: [...items, newItem] })
        }
        get().recalculate()
      },

      removeItem: (itemId) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== itemId) }))
        get().recalculate()
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }))
        get().recalculate()
      },

      updateConfiguration: (itemId, configuration) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, configuration } : item
          ),
        }))
        get().recalculate()
      },

      clearCart: () => {
        set({
          items: [],
          promoCode: undefined,
          shippingMethod: shippingMethods[0],
        })
        get().recalculate()
      },

      setPromoCode: (code) => {
        set({ promoCode: code })
        get().recalculate()
      },

      setShippingMethod: (method) => {
        set({ shippingMethod: method })
        get().recalculate()
      },

      recalculate: () => {
        const { items, shippingMethod, promoCode } = get()
        const totals = calculateTotals(items, shippingMethod, promoCode)
        set(totals)
      },

      getItem: (itemId) => {
        return get().items.find((item) => item.id === itemId)
      },

      getItemByProductVariant: (productId, variantId) => {
        return get().items.find(
          (item) => item.productId === productId && item.variantId === variantId
        )
      },
    }),
    {
      name: "music-electronics-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
        shippingMethod: state.shippingMethod,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.recalculate()
        }
      },
    }
  )
)

// Selectors for performance
export const useCartItems = () => useCartStore((state) => state.items)
export const useCartCount = () => useCartStore((state) => state.itemCount)
export const useCartSubtotal = () => useCartStore((state) => state.subtotal)
export const useCartTotal = () => useCartStore((state) => state.total)
export const useCartShipping = () => useCartStore((state) => state.shipping)
export const useCartTax = () => useCartStore((state) => state.tax)
export const useCartDiscount = () => useCartStore((state) => state.discount)
export const useCartPromoCode = () => useCartStore((state) => state.promoCode)
export const useCartShippingMethod = () => useCartStore((state) => state.shippingMethod)
export const useCartActions = () =>
  useCartStore(
    useShallow((state) => ({
      addItem: state.addItem,
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
      updateConfiguration: state.updateConfiguration,
      clearCart: state.clearCart,
      setPromoCode: state.setPromoCode,
      setShippingMethod: state.setShippingMethod,
      recalculate: state.recalculate,
    }))
  )

export { shippingMethods, FREE_SHIPPING_THRESHOLD, DEFAULT_SHIPPING }