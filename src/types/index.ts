export type ProductCategory =
  | "Synthesizers"
  | "Controllers"
  | "Audio Interfaces"
  | "Eurorack Modular"
  | "Accessories"

export type ProductArtKind =
  | "synthesizer"
  | "controller"
  | "interface"
  | "modular"
  | "accessory"

export interface ProductSpecification {
  category: string
  name: string
  value: string
}

export interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  salePrice?: number
  inStock: boolean
  stockCount?: number
  attributes: Record<string, string>
}

export interface ProductFinish {
  id: string
  name: string
  body: string
  panel: string
  accent: string
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: ProductCategory
  subcategory: string
  price: number
  salePrice?: number
  badge?: string
  description: string
  shortDescription: string
  specs: ProductSpecification[]
  features: string[]
  inTheBox: string[]
  artKind: ProductArtKind
  finishes: ProductFinish[]
  featured: boolean
  rating: number
  reviewCount: number
  variants: ProductVariant[]
}

export interface ProductFilters {
  categories?: ProductCategory[]
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  onSaleOnly?: boolean
  search?: string
}

export interface ProductSortOption {
  id: "featured" | "price-asc" | "price-desc" | "name" | "rating"
  label: string
}

export interface PaginatedProducts {
  items: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CartItem {
  id: string
  productId: string
  variantId: string
  quantity: number
  configuration?: ProductConfiguration
  addedAt: string
}

export interface ProductConfiguration {
  finishId?: string
  notes?: string
}

export interface CartState {
  items: CartItem[]
  itemCount: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  promoCode?: string
  shippingMethod?: ShippingMethod
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  freeThreshold?: number
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  createdAt: string
}

export interface Address {
  id: string
  type: "shipping" | "billing"
  isDefault: boolean
  firstName: string
  lastName: string
  company?: string
  street1: string
  street2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "bank"
  isDefault: boolean
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
}

export interface SavedConfiguration {
  id: string
  productId: string
  name: string
  configuration: ProductConfiguration
  savedAt: string
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export interface OrderItem {
  productId: string
  variantId: string
  name: string
  sku: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  shippingAddress: Address
  billingAddress?: Address
  paymentStatus: PaymentStatus
  createdAt: string
  estimatedDelivery?: string
  trackingNumber?: string
}

export interface CheckoutState {
  step: CheckoutStep
  order?: Order
}

export type CheckoutStep =
  | "information"
  | "shipping"
  | "payment"
  | "review"
  | "confirmation"

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, string | number | boolean>
  timestamp?: string
}

export interface SiteConfig {
  name: string
  tagline: string
  description: string
  url: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  social: {
    twitter?: string
    instagram?: string
    youtube?: string
    github?: string
  }
}

export type NavChild = {
  label: string
  href: string
  description?: string
}

export type NavItem = {
  label: string
  href: string
  children?: NavChild[]
}
