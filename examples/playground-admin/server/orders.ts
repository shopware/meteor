import type {
  Address,
  Customer,
  DeliveryState,
  LineItem,
  Order,
  OrderDocument,
  OrderState,
  PaymentState,
} from "../shared/types";
import { products, salesChannels, taxes } from "./catalog";
import { createRandom, round } from "./random";

const random = createRandom(2);

const firstNames = [
  "Lena",
  "Jonas",
  "Mia",
  "Felix",
  "Emma",
  "Paul",
  "Sofia",
  "Noah",
  "Hannah",
  "Elias",
  "Clara",
  "Leon",
  "Ava",
  "Theo",
  "Ida",
  "Oskar",
];

const lastNames = [
  "Becker",
  "Schneider",
  "Fischer",
  "Wagner",
  "Hoffmann",
  "Richter",
  "Klein",
  "Wolf",
  "Neumann",
  "Schwarz",
  "Zimmermann",
  "Braun",
  "Krüger",
  "Hartmann",
];

const companies = [
  "Kranich Design GmbH",
  "Feldweg Café",
  "Studio Nord",
  "Blauwerk AG",
  "Lindgren & Partner",
];

const cities = [
  { zipcode: "10115", city: "Berlin" },
  { zipcode: "20095", city: "Hamburg" },
  { zipcode: "80331", city: "Munich" },
  { zipcode: "50667", city: "Cologne" },
  { zipcode: "48565", city: "Steinfurt" },
  { zipcode: "04109", city: "Leipzig" },
];

const streets = [
  "Hauptstraße",
  "Lindenallee",
  "Bahnhofstraße",
  "Am Markt",
  "Gartenweg",
  "Ebbinghoff",
];

const paymentMethods = ["Invoice", "PayPal", "Credit card", "Cash on delivery"];
const shippingMethods = ["Standard", "Express"];

const comments = [
  "Please leave the parcel with the neighbours if I'm not home.",
  "It's a gift, please don't include the invoice in the parcel.",
  "Could you ship this before the weekend?",
];

function createAddress(
  firstName: string,
  lastName: string,
  company: string | null,
): Address {
  const place = random.pick(cities);

  return {
    firstName,
    lastName,
    company,
    street: `${random.pick(streets)} ${random.int(1, 120)}`,
    zipcode: place.zipcode,
    city: place.city,
    country: "Germany",
  };
}

const customers = Array.from({ length: 40 }, (_, index) => {
  const firstName = random.pick(firstNames);
  const lastName = random.pick(lastNames);
  const company = random.chance(0.25) ? random.pick(companies) : null;

  const customer: Customer = {
    id: random.id(),
    customerNumber: String(20000 + index),
    firstName,
    lastName,
    email: `${firstName}.${lastName}@example.com`.toLowerCase(),
    phone: `+49 ${random.int(150, 179)} ${random.int(1000000, 9999999)}`,
    company,
  };

  return { customer, address: createAddress(firstName, lastName, company) };
});

/** Derives the customer name, the line and order totals and the taxes. */
export function calculateOrder(order: Order): Order {
  const lineItems = order.lineItems.map((item) => ({
    ...item,
    totalPrice: round(item.unitPrice * item.quantity),
  }));

  const positionPrice = round(
    lineItems.reduce((sum, item) => sum + item.totalPrice, 0),
  );
  const amountTotal = round(positionPrice + order.shippingCosts);

  // Shipping costs are taxed at the standard rate.
  const grossByRate = new Map<number, number>([
    [taxes[0].rate, order.shippingCosts],
  ]);

  for (const item of lineItems) {
    grossByRate.set(
      item.taxRate,
      (grossByRate.get(item.taxRate) ?? 0) + item.totalPrice,
    );
  }

  const orderTaxes = [...grossByRate]
    .filter(([rate, gross]) => rate > 0 && gross > 0)
    .map(([rate, gross]) => ({
      rate,
      amount: round(gross - gross / (1 + rate / 100)),
    }))
    .sort((a, b) => b.rate - a.rate);

  return {
    ...order,
    customerName: `${order.customer.lastName}, ${order.customer.firstName}`,
    lineItems,
    positionPrice,
    amountTotal,
    amountNet: round(
      amountTotal - orderTaxes.reduce((sum, tax) => sum + tax.amount, 0),
    ),
    taxes: orderTaxes,
  };
}

/** A few orders are cancelled; older ones are further along, mostly completed and paid. */
function createStates(
  ageInDays: number,
): Pick<Order, "state" | "paymentState" | "deliveryState"> {
  if (random.chance(0.06)) {
    return {
      state: "cancelled",
      paymentState: random.pick<PaymentState>([
        "cancelled",
        "failed",
        "refunded",
      ]),
      deliveryState: "cancelled",
    };
  }

  if (ageInDays > 7) {
    return {
      state: "completed",
      paymentState: random.chance(0.92) ? "paid" : "refunded",
      deliveryState: random.chance(0.95) ? "shipped" : "returned",
    };
  }

  if (ageInDays > 1) {
    return {
      state: random.pick<OrderState>([
        "in_progress",
        "in_progress",
        "completed",
      ]),
      paymentState: random.pick<PaymentState>([
        "paid",
        "paid",
        "authorized",
        "reminded",
      ]),
      deliveryState: random.pick<DeliveryState>([
        "shipped",
        "shipped_partially",
        "open",
      ]),
    };
  }

  return {
    state: random.pick<OrderState>(["open", "open", "in_progress"]),
    paymentState: random.pick<PaymentState>([
      "open",
      "paid",
      "authorized",
      "failed",
    ]),
    deliveryState: "open",
  };
}

function createLineItems(): LineItem[] {
  return random.some(products, random.int(1, 4)).map((product) => {
    const quantity = random.chance(0.7) ? 1 : random.int(2, 3);
    const taxRate = taxes.find((tax) => tax.id === product.taxId)?.rate ?? 0;

    return {
      id: random.id(),
      productId: product.id,
      label: product.name,
      productNumber: product.productNumber,
      quantity,
      unitPrice: product.price.gross,
      taxRate,
      totalPrice: round(product.price.gross * quantity),
    };
  });
}

function createDocuments(order: Order, number: number): OrderDocument[] {
  const documents: OrderDocument[] = [];

  if (order.paymentState !== "open" && order.state !== "cancelled") {
    documents.push({
      id: random.id(),
      type: "invoice",
      number: String(1000 + number),
      createdAt: order.orderDateTime,
      sent: random.chance(0.8),
    });
  }

  if (order.deliveryState === "shipped" || order.deliveryState === "returned") {
    documents.push({
      id: random.id(),
      type: "delivery_note",
      number: String(1000 + number),
      createdAt: order.orderDateTime,
      sent: random.chance(0.5),
    });
  }

  if (order.paymentState === "refunded") {
    documents.push({
      id: random.id(),
      type: "credit_note",
      number: String(1000 + number),
      createdAt: order.orderDateTime,
      sent: false,
    });
  }

  return documents;
}

function createOrders(): Order[] {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const orderTimes: number[] = [];

  for (let day = 59; day >= 0; day--) {
    const dayStart = startOfToday - day * 86_400_000;
    // Today only has the orders until now.
    const dayEnd = day === 0 ? now.getTime() : dayStart + 86_400_000;

    for (let count = random.int(2, 7); count > 0; count--) {
      orderTimes.push(
        dayStart + Math.floor(random.next() * (dayEnd - dayStart)),
      );
    }
  }

  orderTimes.sort((a, b) => a - b);

  return orderTimes.map((time, index) => {
    const { customer, address } = random.pick(customers);
    const ageInDays = (now.getTime() - time) / 86_400_000;
    const states = createStates(ageInDays);
    const lineItems = createLineItems();
    const itemsTotal = lineItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
    const shippingMethod = random.pick(shippingMethods);

    const order = calculateOrder({
      id: random.id(),
      orderNumber: String(10000 + index),
      orderDateTime: new Date(time).toISOString(),
      customer,
      customerName: "",
      billingAddress: address,
      shippingAddress: random.chance(0.85)
        ? address
        : createAddress(customer.firstName, customer.lastName, null),
      salesChannel: random.pick(salesChannels).name,
      paymentMethod: random.pick(paymentMethods),
      shippingMethod,
      ...states,
      lineItems,
      shippingCosts:
        shippingMethod === "Express" ? 9.9 : itemsTotal >= 50 ? 0 : 4.9,
      positionPrice: 0,
      amountNet: 0,
      amountTotal: 0,
      taxes: [],
      trackingCodes:
        states.deliveryState === "shipped" ||
        states.deliveryState === "shipped_partially"
          ? [`00340434${random.int(10000000, 99999999)}`]
          : [],
      customerComment: random.chance(0.12) ? random.pick(comments) : null,
      internalComment: "",
      tags: random.chance(0.15) ? ["VIP"] : [],
      documents: [],
    });

    return { ...order, documents: createDocuments(order, index) };
  });
}

export const orders: Order[] = createOrders();
