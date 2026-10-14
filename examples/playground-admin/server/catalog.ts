import type {
  Category,
  DeliveryTime,
  Manufacturer,
  Product,
  SalesChannel,
  ScaleUnit,
  Tag,
  Tax,
} from "../shared/types";
import { createRandom, round } from "./random";

const random = createRandom(1);

export const manufacturers: Manufacturer[] = [
  "Nordlicht Studio",
  "Hearth & Co.",
  "Alpine Outfitters",
  "Kettle Works",
  "Linden Textiles",
  "Copperleaf",
  "Wayfarer Goods",
  "Brightside Lighting",
  "Oak & Iron",
  "Saltwater Supply",
  "Fieldnote",
  "Morning Ritual",
].map((name) => ({ id: random.id(), name }));

const mainCategories: Category[] = [
  "Lighting",
  "Textiles",
  "Kitchen",
  "Apparel",
  "Footwear",
  "Accessories",
  "Outdoor",
  "Coffee & tea",
  "Office",
  "Garden",
].map((name) => ({ id: random.id(), name, parentId: null }));

type CategoryTree = { [name: string]: CategoryTree };

/** The subcategories of each main category. Apparel goes four levels deep. */
const subcategories: Record<string, CategoryTree> = {
  Lighting: {
    "Indoor lighting": { "Desk lamps": {}, "Pendant lights": {} },
    "Outdoor lighting": {},
  },
  Textiles: { "Bedroom textiles": {}, "Bathroom textiles": {} },
  Kitchen: { Cookware: {}, "Knives & boards": {} },
  Apparel: {
    Men: {
      Jackets: { "Rain jackets": {}, "Winter jackets": {} },
      Shirts: {},
    },
    Women: { Dresses: {}, Knitwear: {} },
  },
  Footwear: { "Running shoes": {}, Boots: {} },
  Accessories: { Bags: {}, Wallets: {} },
  Outdoor: { Camping: {}, Hiking: {} },
  "Coffee & tea": { Coffee: {}, Tea: {} },
  Office: { Stationery: {}, "Desk accessories": {} },
  Garden: { Planters: {}, "Garden tools": {} },
};

// A separate seed, so the tree doesn't change the rest of the generated data.
const treeRandom = createRandom(4);

function createSubcategories(parent: Category, tree: CategoryTree): Category[] {
  return Object.entries(tree).flatMap(([name, children]) => {
    const category = { id: treeRandom.id(), name, parentId: parent.id };

    return [category, ...createSubcategories(category, children)];
  });
}

export const categories: Category[] = [
  ...mainCategories,
  ...mainCategories.flatMap((category) =>
    createSubcategories(category, subcategories[category.name]),
  ),
];

/** The categories without subcategories below a category, which products are assigned to. */
function leafCategories(parent: Category): Category[] {
  const children = categories.filter(
    (category) => category.parentId === parent.id,
  );

  return children.length === 0 ? [parent] : children.flatMap(leafCategories);
}

export const salesChannels: SalesChannel[] = [
  "Storefront",
  "Headless",
  "B2B shop",
].map((name) => ({ id: random.id(), name }));

export const deliveryTimes: DeliveryTime[] = [
  "1-3 days",
  "2-5 days",
  "1-2 weeks",
  "3-4 weeks",
].map((name) => ({ id: random.id(), name }));

export const taxes: Tax[] = [
  { id: random.id(), name: "Standard rate", rate: 19 },
  { id: random.id(), name: "Reduced rate", rate: 7 },
  { id: random.id(), name: "Tax free", rate: 0 },
];

/** The base products per category: a noun and a price range in EUR. */
const assortment: Record<string, { nouns: string[]; price: [number, number] }> =
  {
    Lighting: {
      nouns: ["desk lamp", "pendant light", "floor lamp", "wall sconce"],
      price: [39, 249],
    },
    Textiles: {
      nouns: ["throw pillow", "blanket", "table runner", "bath towel"],
      price: [19, 129],
    },
    Kitchen: {
      nouns: ["cutting board", "pour-over set", "chef's knife", "dutch oven"],
      price: [24, 219],
    },
    Apparel: {
      nouns: ["hoodie", "beanie", "rain jacket", "linen shirt"],
      price: [29, 199],
    },
    Footwear: {
      nouns: ["running shoes", "chelsea boots", "sneakers", "sandals"],
      price: [59, 229],
    },
    Accessories: {
      nouns: ["weekender bag", "wallet", "sunglasses", "watch strap"],
      price: [19, 159],
    },
    Outdoor: {
      nouns: ["camping mug", "hiking backpack", "headlamp", "sleeping bag"],
      price: [14, 279],
    },
    "Coffee & tea": {
      nouns: ["espresso beans", "tea sampler", "milk frother", "grinder"],
      price: [9, 149],
    },
    Office: {
      nouns: ["notebook", "desk organizer", "fountain pen", "monitor stand"],
      price: [12, 119],
    },
    Garden: {
      nouns: ["planter", "watering can", "pruning shears", "herb kit"],
      price: [14, 89],
    },
  };

const adjectives = [
  "Aurora",
  "Halo",
  "Linen",
  "Walnut",
  "Merino",
  "Trail",
  "Canvas",
  "Copper",
  "Stoneware",
  "Harbor",
  "Juniper",
  "Slate",
  "Meadow",
  "Ember",
];

export const tags: Tag[] = [
  "New",
  "Bestseller",
  "Sale",
  "Eco",
  "Limited",
  "Gift idea",
  "VIP",
  "Wholesale",
].map((name) => ({ id: random.id(), name }));

const productTags = tags.slice(0, 6).map((tag) => tag.name);

const scaleUnits: ScaleUnit[] = ["piece", "liter", "kilogram", "meter"];

function createProduct(index: number): Product {
  const category = random.pick(mainCategories);
  const range = assortment[category.name];
  const manufacturer = random.pick(manufacturers);
  const tax = category.name === "Coffee & tea" ? taxes[1] : taxes[0];
  const gross = random.price(range.price[0], range.price[1]);
  const stock = random.chance(0.12) ? 0 : random.int(1, 180);
  const createdAt = new Date(
    Date.now() - random.int(1, 365) * 86_400_000,
  ).toISOString();
  const name = `${random.pick(adjectives)} ${random.pick(range.nouns)}`;

  return {
    id: random.id(),
    name,
    productNumber: `SW${10000 + index}`,
    description: `<p>The ${name.toLowerCase()} from ${manufacturer.name}, made to last and easy to care for.</p>`,
    manufacturerId: manufacturer.id,
    manufacturerName: manufacturer.name,
    active: random.chance(0.85),
    markAsTopseller: random.chance(0.1),
    taxId: tax.id,
    price: { gross, net: round(gross / (1 + tax.rate / 100)) },
    purchasePrice: round(gross * 0.45),
    listPrice: random.chance(0.25) ? round(gross * 1.2) : null,
    stock,
    availableStock: stock,
    isCloseout: random.chance(0.15),
    deliveryTimeId: random.pick(deliveryTimes).id,
    restockTime: random.chance(0.5) ? random.int(3, 30) : null,
    shippingFree: random.chance(0.2),
    minPurchase: 1,
    maxPurchase: null,
    purchaseSteps: 1,
    salesChannelIds: random
      .some(salesChannels, random.int(1, 3))
      .map((channel) => channel.id),
    categoryIds: [treeRandom.pick(leafCategories(category)).id],
    tags: random.some(productTags, random.int(0, 2)),
    releaseDate: createdAt.slice(0, 10),
    ean: String(4000000000000 + random.int(0, 999999999)),
    manufacturerNumber: `${manufacturer.name.slice(0, 3).toUpperCase()}-${random.int(100, 999)}`,
    width: { value: random.int(50, 600), unit: "mm" },
    height: { value: random.int(20, 400), unit: "mm" },
    length: { value: random.int(50, 600), unit: "mm" },
    weight: { value: round(random.int(1, 80) / 10), unit: "kg" },
    scaleUnit: random.pick(scaleUnits),
    purchaseUnit: 1,
    referenceUnit: 1,
    packUnit: "",
    sales: random.int(0, 400),
    createdAt,
    updatedAt: null,
  };
}

export const products: Product[] = Array.from({ length: 120 }, (_, index) =>
  createProduct(index),
);
