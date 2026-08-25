import * as THREE from "three"

// ============================================================================
// Core type definitions for the music electronics shop

// ============================================================================
// Product Types
// ============================================================================

export type ProductCategory =
  | "synthesizers"
  | "controllers"
  | "interfaces"
  | "modular"
  | "accessories"

export type ProductSubcategory =
  | "analog"
  | "digital"
  | "hybrid"
  | "modular"
  | "semi-modular"
  | "groovebox"
  | "keyboard"
  | "pad"
  | "daw"
  | "midi"
  | "cv"
  | "usb"
  | "thunderbolt"
  | "firewire"
  | "pci"
  | "eurorack"
  | "case"
  | "power"
  | "cable"
  | "stand"
  | "cover"

export interface ProductSpecification {
  name: string
  value: string | number | boolean
  unit?: string
  category?: string
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
  images?: string[]
  model3dConfig?: Model3DConfig
}

export interface Model3DConfig {
  type: "procedural" | "gltf"
  path?: string
  proceduralConfig?: ProceduralModelConfig
  materials?: MaterialConfig[]
  animations?: AnimationConfig[]
  hotspots?: HotspotConfig[]
}

export interface ProceduralModelConfig {
  modelType: "synthesizer" | "controller" | "interface" | "eurorack" | "module"
  dimensions: { width: number; height: number; depth: number }
  colorScheme: "dark" | "vintage" | "modern" | "custom"
  customColors?: Record<string, string>
  features: {
    keyboard?: { octaves: number; keys: number }
    knobs?: number
    faders?: number
    pads?: number
    display?: boolean
    patchbay?: boolean
    eurorack?: { hp: number; rows: number }
  }
}

export interface MaterialConfig {
  name: string
  type: "metal" | "plastic" | "glass" | "wood" | "led" | "display"
  properties: Record<string, unknown>
}

export interface AnimationConfig {
  name: string
  type: "rotation" | "position" | "scale" | "material" | "morph"
  target: string
  duration: number
  easing?: string
  loop?: boolean
  trigger?: "hover" | "click" | "auto" | "scroll"
}

export interface HotspotConfig {
  id: string
  position: [number, number, number]
  normal: [number, number, number]
  title: string
  description: string
  variant?: "info" | "feature" | "spec" | "cta"
  action?: { type: "link" | "modal" | "config"; payload: unknown }
}

export interface ProductImage {
  url: string
  alt: string
  width: number
  height: number
  type: "hero" | "gallery" | "detail" | "lifestyle" | "spec"
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: ProductCategory
  subcategory: ProductSubcategory
  shortDescription: string
  description: string
  price: number
  salePrice?: number
  currency: string
  sku: string
  barcode?: string
  images: ProductImage[]
  model3d: Model3DConfig
  specifications: ProductSpecification[]
  features: string[]
  tags: string[]
  inStock: boolean
  stockCount?: number
  featured: boolean
  newArrival: boolean
  onSale: boolean
  variants: ProductVariant[]
  relatedProducts: string[]
  crossSells: string[]
  upSells: string[]
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  categories?: ProductCategory[]
  subcategories?: ProductSubcategory[]
  brands?: string[]
  priceRange?: [number, number]
  inStockOnly?: boolean
  featuredOnly?: boolean
  onSaleOnly?: boolean
  tags?: string[]
  search?: string
}

export interface ProductSortOption {
  field: "price" | "name" | "createdAt" | "popularity" | "rating"
  direction: "asc" | "desc"
}

export interface PaginatedProducts {
  products: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasMore: boolean
}

// ============================================================================
// Cart Types
// ============================================================================

export interface CartItem {
  id: string
  productId: string
  variantId: string
  quantity: number
  configuration?: ProductConfiguration
  addedAt: string
}

export interface ProductConfiguration {
  modules?: EurorackModuleConfig[]
  caseConfig?: EurorackCaseConfig
  colorScheme?: string
  customOptions?: Record<string, unknown>
}

export interface EurorackModuleConfig {
  id: string
  productId: string
  position: { row: number; hp: number }
  rotation?: number
}

export interface EurorackCaseConfig {
  productId: string
  hp: number
  rows: number
  powerSupply: string
  color: string
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

// ============================================================================
// User & Auth Types
// ============================================================================

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: "customer" | "admin" | "staff"
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  wishlist: string[]
  savedConfigurations: SavedConfiguration[]
  orders: Order[]
}

export interface Address {
  id: string
  type: "shipping" | "billing"
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
}

export interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "apple_pay" | "google_pay"
  brand?: string
  last4?: string
  expMonth?: number
  expYear?: number
  isDefault: boolean
  stripePaymentMethodId?: string
}

export interface SavedConfiguration {
  id: string
  name: string
  type: "eurorack" | "synth" | "controller"
  configuration: ProductConfiguration
  totalPrice: number
  thumbnail?: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  shareToken?: string
}

// ============================================================================
// Order Types
// ============================================================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "returned"

export type PaymentStatus =
  | "pending"
  | "authorized"
  | "captured"
  | "failed"
  | "refunded"
  | "partially_refunded"

export interface OrderItem {
  id: string
  productId: string
  variantId: string
  productName: string
  variantName: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
  configuration?: ProductConfiguration
  productSnapshot: Product
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  promoCode?: string
  shippingAddress: Address
  billingAddress: Address
  shippingMethod: ShippingMethod
  trackingNumber?: string
  trackingUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
  shippedAt?: string
  deliveredAt?: string
  cancelledAt?: string
}

// ============================================================================
// Checkout Types
// ============================================================================

export interface CheckoutState {
  step: CheckoutStep
  email: string
  shippingAddress: Address
  billingAddress: Address
  sameAsShipping: boolean
  shippingMethod: ShippingMethod
  paymentMethod: PaymentMethodInput
  promoCode?: string
  notes?: string
  errors: Record<string, string>
  isSubmitting: boolean
}

export type CheckoutStep =
  | "contact"
  | "shipping"
  | "payment"
  | "review"
  | "success"

export interface PaymentMethodInput {
  type: "card" | "paypal" | "apple_pay" | "google_pay"
  stripePaymentMethodId?: string
  paypalOrderId?: string
}

// ============================================================================
// 3D/Three.js Types
// ============================================================================

export interface ThreeCanvasProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  camera?: CameraConfig
  lighting?: LightingConfig
  postProcessing?: PostProcessingConfig
  onLoad?: (scene: THREE.Scene) => void
  onError?: (error: Error) => void
}

export interface CameraConfig {
  fov?: number
  near?: number
  far?: number
  position?: [number, number, number]
  target?: [number, number, number]
}

export interface LightingConfig {
  ambient?: { intensity: number; color: number }
  key?: { intensity: number; color: number; position: [number, number, number] }
  fill?: { intensity: number; color: number; position: [number, number, number] }
  rim?: { intensity: number; color: number; position: [number, number, number] }
  hdri?: { path: string; intensity: number; rotation: number }
}

export interface PostProcessingConfig {
  bloom?: { enabled: boolean; intensity: number; threshold: number; radius: number }
  toneMapping?: { enabled: boolean; type: string; exposure: number }
  fxaa?: { enabled: boolean }
  vignette?: { enabled: boolean; intensity: number }
  chromaticAberration?: { enabled: boolean; offset: number }
}

export interface ModelViewerProps {
  model: Model3DConfig
  className?: string
  style?: React.CSSProperties
  cameraControls?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
  enableZoom?: boolean
  enablePan?: boolean
  minDistance?: number
  maxDistance?: number
  onLoad?: (model: THREE.Group) => void
  onError?: (error: Error) => void
  onHotspotClick?: (hotspot: HotspotConfig) => void
  exploded?: boolean
  explodeFactor?: number
  wireframe?: boolean
  showGrid?: boolean
  showAxes?: boolean
}

export interface SceneConfig {
  background: number | string | THREE.Texture
  fog?: { color: number; near: number; far: number }
  environment?: THREE.Texture
  environmentIntensity?: number
}

// ============================================================================
// UI/Component Types
// ============================================================================

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "accent"

export type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  fullWidth?: boolean
}

export type InputVariant = "default" | "error" | "success"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  variant?: InputVariant
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export type CardVariant = "default" | "elevated" | "outlined" | "interactive"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: "none" | "sm" | "md" | "lg"
}

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "outline"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: "sm" | "md" | "lg"
  dot?: boolean
}

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export interface DrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  position?: "left" | "right" | "top" | "bottom"
  size?: "sm" | "md" | "lg" | "full"
  title?: string
}

export interface ToastProps {
  id: string
  type: "success" | "error" | "warning" | "info" | "default"
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  duration?: number
  onClose: (id: string) => void
}

// ============================================================================
// API/Backend Types
// ============================================================================

export interface ApiResponse<T> {
  data: T
  meta?: {
    page?: number
    pageSize?: number
    total?: number
    totalPages?: number
  }
  errors?: ApiError[]
}

export interface ApiError {
  code: string
  message: string
  field?: string
  details?: Record<string, unknown>
}

export interface PaginationParams {
  page: number
  pageSize: number
  sort?: string
  order?: "asc" | "desc"
}

export interface SearchParams extends PaginationParams {
  q?: string
  filters?: Record<string, string | number | boolean | string[]>
}

// ============================================================================
// Analytics/Tracking Types
// ============================================================================

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
  timestamp?: number
  userId?: string
  sessionId?: string
}

export interface ProductViewEvent extends AnalyticsEvent {
  name: "product_view"
  properties: {
    product_id: string
    product_name: string
    category: string
    price: number
    currency: string
  }
}

export interface AddToCartEvent extends AnalyticsEvent {
  name: "add_to_cart"
  properties: {
    product_id: string
    variant_id: string
    quantity: number
    price: number
    currency: string
  }
}

export interface CheckoutStartEvent extends AnalyticsEvent {
  name: "checkout_start"
  properties: {
    cart_value: number
    currency: string
    item_count: number
  }
}

export interface PurchaseEvent extends AnalyticsEvent {
  name: "purchase"
  properties: {
    order_id: string
    value: number
    currency: string
    items: Array<{
      product_id: string
      variant_id: string
      quantity: number
      price: number
    }>
  }
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
    instagram: string
    youtube: string
    discord: string
  }
  contact: {
    email: string
    phone: string
    address: string
  }
  features: {
    reviews: boolean
    wishlist: boolean
    compare: boolean
    configurator: boolean
    ar: boolean
    pwa: boolean
  }
  payments: {
    stripe: boolean
    paypal: boolean
    applePay: boolean
    googlePay: boolean
  }
  shipping: {
    freeThreshold: number
    countries: string[]
  }
  analytics: {
    ga4Id?: string
    plausibleDomain?: string
  }
}

// ============================================================================
// Utility Types
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> }
export type NonEmptyArray<T> = [T, ...T[]]
export type ValueOf<T> = T[keyof T]
export type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T]

export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

export interface AsyncState<T> extends LoadingState {
  data?: T | null
}

export type SelectOption<T = string> = {
  value: T
  label: string
  disabled?: boolean
  icon?: React.ReactNode
  description?: string
}

export type ColumnDef<T> = {
  key: keyof T | string
  header: string
  width?: string
  align?: "left" | "center" | "right"
  render?: (value: unknown, row: T) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
}

// Re-export THREE types for convenience
export type {
  Scene,
  Camera,
  PerspectiveCamera,
  OrthographicCamera,
  WebGLRenderer,
  Mesh,
  Group,
  Object3D,
  Material,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  Texture,
  BufferGeometry,
  Vector3,
  Euler,
  Quaternion,
  Color,
  Light,
  DirectionalLight,
  PointLight,
  SpotLight,
  AmbientLight,
  HemisphereLight,
  Raycaster,
  Intersection,
  Clock,
  AnimationMixer,
  AnimationClip,
  AnimationAction,
} from "three"

// ============================================================================
// Event Handler Types
// ============================================================================

export type MouseEventHandler<T = HTMLElement> = React.MouseEventHandler<T>
export type KeyboardEventHandler<T = HTMLElement> = React.KeyboardEventHandler<T>
export type FocusEventHandler<T = HTMLElement> = React.FocusEventHandler<T>
export type ChangeEventHandler<T = HTMLInputElement> = React.ChangeEventHandler<T>
export type FormEventHandler<T = HTMLFormElement> = React.FormEventHandler<T>
export type DragEventHandler<T = HTMLElement> = React.DragEventHandler<T>
export type WheelEventHandler<T = HTMLElement> = React.WheelEventHandler<T>
export type TouchEventHandler<T = HTMLElement> = React.TouchEventHandler<T>
export type PointerEventHandler<T = HTMLElement> = React.PointerEventHandler<T>

// ============================================================================
// Module Augmentation
// ============================================================================

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    css?: string | object
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "canvas-3d": React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>
    }
  }
}