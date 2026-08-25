/**
 * Wishlist Store - Zustand
 * Manages the user's saved products with localStorage persistence.
 *
 * Mirrors the cartStore conventions: an explicit typed interface, `persist`
 * + `createJSONStorage`, a `partialize` that persists only what must survive
 * a reload (the productIds set), and memoized selector hooks exported at the
 * bottom. Wishlist entries are product IDs only — display data is resolved
 * from the product catalogue at render time (see getProductById), so the
 * store stays in sync if a product's name/price ever changes.
 */

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"
import { getProductById } from "@/data/products"

interface WishlistState {
  productIds: string[]
  add: (productId: string) => void
  remove: (productId: string) => void
  toggle: (productId: string) => void
  clear: () => void
  // Non-reactive lookups read via getState() in event handlers where a
  // subscription would be wasteful (e.g. one-off deciding a toast label).
}

interface WishlistStore extends WishlistState {
  has: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],

      add: (productId) => {
        // Guard against duplicate entries so the order in which a user
        // toggles can't double-push the same id (toggle handles removal).
        if (get().productIds.includes(productId)) return
        set((state) => ({ productIds: [...state.productIds, productId] }))
      },

      remove: (productId) => {
        set((state) => ({ productIds: state.productIds.filter((id) => id !== productId) }))
      },

      toggle: (productId) => {
        set((state) =>
          state.productIds.includes(productId)
            ? { productIds: state.productIds.filter((id) => id !== productId) }
            : { productIds: [...state.productIds, productId] }
        )
      },

      clear: () => set({ productIds: [] }),

      has: (productId) => get().productIds.includes(productId),
    }),
    {
      name: "music-electronics-wishlist",
      storage: createJSONStorage(() => localStorage),
      // Only the ids need to survive a reload; actions are reattached by the
      // store creator and can't be serialized meaningfully.
      partialize: (state) => ({ productIds: state.productIds }),
    }
  )
)

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

/** All saved product IDs, in add-order. */
export const useWishlistIds = () => useWishlistStore((state) => state.productIds)

/** Number of saved items — cheap to subscribe to from a badge/header. */
export const useWishlistCount = () => useWishlistStore((state) => state.productIds.length)

/** Reactive membership check for a single product (e.g. the heart button state). */
export const useWishlisted = (productId: string) =>
  useWishlistStore((state) => state.productIds.includes(productId))

/**
 * Resolved wishlist entries with display data. Filters out any stale id whose
 * product no longer exists in the catalogue so a deleted product doesn't
 * render a ghost row — the store keeps the id, but the UI just hides it.
 *
 * Wrapped in useShallow: the selector returns a fresh array on every snapshot,
 * so without a shallow comparison Zustand v5's useSyncExternalStore would see
 * a new reference each render (Object.is) and loop forever — "Maximum update
 * depth exceeded". useShallow compares element-by-element instead.
 */
export const useWishlistItems = () =>
  useWishlistStore(
    useShallow((state) =>
      state.productIds
        .map((id) => getProductById(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
    )
  )

/**
 * Batched action selector — single re-subscribe boundary for the action
 * functions. useShallow keeps the returned object referentially stable across
 * renders (the individual action functions never change identity, so a shallow
 * compare is always equal) which prevents the infinite-update loop that
 * Object.is would trigger on the fresh wrapper object.
 */
export const useWishlistActions = () =>
  useWishlistStore(
    useShallow((state) => ({
      add: state.add,
      remove: state.remove,
      toggle: state.toggle,
      clear: state.clear,
      has: state.has,
    }))
  )
