// The entities of the mock Admin API, shaped after the Shopware Administration.

export interface Manufacturer {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  /** The category above this one, `null` for a main category. */
  parentId: string | null;
}

export interface SalesChannel {
  id: string;
  name: string;
}

export interface DeliveryTime {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Tax {
  id: string;
  name: string;
  rate: number;
}

/** A length or a weight in the unit the user picked, such as "mm" or "kg". */
export interface Measurement {
  value?: number;
  unit: string;
}

export type ScaleUnit = "piece" | "liter" | "kilogram" | "meter";

export interface Product {
  id: string;
  name: string;
  productNumber: string;
  /** HTML from the text editor. */
  description: string;
  manufacturerId: string | null;
  /** Set by the server from `manufacturerId`, for the list. */
  manufacturerName: string | null;
  active: boolean;
  markAsTopseller: boolean;
  taxId: string;
  /** The gross and net price in EUR. */
  price: { gross: number; net: number };
  purchasePrice: number | null;
  listPrice: number | null;
  stock: number;
  /** Set by the server: the stock minus the open order quantities. */
  availableStock: number;
  isCloseout: boolean;
  deliveryTimeId: string | null;
  restockTime: number | null;
  shippingFree: boolean;
  minPurchase: number;
  maxPurchase: number | null;
  purchaseSteps: number;
  salesChannelIds: string[];
  categoryIds: string[];
  /** Tag names. */
  tags: string[];
  /** An ISO date. */
  releaseDate: string | null;
  ean: string;
  manufacturerNumber: string;
  width: Measurement;
  height: Measurement;
  length: Measurement;
  weight: Measurement;
  scaleUnit: ScaleUnit;
  purchaseUnit: number | null;
  referenceUnit: number | null;
  packUnit: string;
  sales: number;
  createdAt: string;
  updatedAt: string | null;
}

export type OrderState = "open" | "in_progress" | "completed" | "cancelled";

export type PaymentState =
  | "open"
  | "authorized"
  | "paid"
  | "paid_partially"
  | "refunded"
  | "reminded"
  | "cancelled"
  | "failed";

export type DeliveryState =
  | "open"
  | "shipped"
  | "shipped_partially"
  | "returned"
  | "cancelled";

export interface Address {
  firstName: string;
  lastName: string;
  company: string | null;
  street: string;
  zipcode: string;
  city: string;
  country: string;
}

export interface Customer {
  id: string;
  customerNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string | null;
}

export interface LineItem {
  id: string;
  productId: string | null;
  label: string;
  productNumber: string;
  quantity: number;
  /** The gross price of one unit. */
  unitPrice: number;
  taxRate: number;
  totalPrice: number;
}

export type OrderDocumentType = "invoice" | "delivery_note" | "credit_note";

export interface OrderDocument {
  id: string;
  type: OrderDocumentType;
  number: string;
  createdAt: string;
  sent: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDateTime: string;
  /** A snapshot of the customer at the time of the order. */
  customer: Customer;
  /** Set by the server, "Last, First", for the list. */
  customerName: string;
  billingAddress: Address;
  shippingAddress: Address;
  salesChannel: string;
  paymentMethod: string;
  shippingMethod: string;
  state: OrderState;
  paymentState: PaymentState;
  deliveryState: DeliveryState;
  lineItems: LineItem[];
  shippingCosts: number;
  /** The sum of the line items. The server sets it and the totals and taxes below. */
  positionPrice: number;
  amountNet: number;
  amountTotal: number;
  taxes: { rate: number; amount: number }[];
  trackingCodes: string[];
  customerComment: string | null;
  internalComment: string;
  tags: string[];
  documents: OrderDocument[];
}

export interface Entities {
  product: Product;
  order: Order;
  manufacturer: Manufacturer;
  category: Category;
  salesChannel: SalesChannel;
  deliveryTime: DeliveryTime;
  tax: Tax;
  tag: Tag;
}

export type EntityName = keyof Entities;

/** What a list asks the server for, like the Criteria of the Admin API. */
export interface Criteria {
  page: number;
  limit: number;
  term?: string;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
  /** Property path → accepted values. */
  filters?: Record<string, string[]>;
}

export interface SearchResult<Entity> {
  data: Entity[];
  total: number;
}

export interface DailyStatistic {
  /** An ISO date (YYYY-MM-DD). */
  date: string;
  orders: number;
  /** The turnover of the paid orders. */
  turnover: number;
}

export interface OrderStatistics {
  /** The number and the total value of today's orders. */
  today: { orders: number; total: number };
  days: DailyStatistic[];
}
