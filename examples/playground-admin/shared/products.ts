/** The mocked catalog of the products page. */

export type Category =
  | "lighting"
  | "textiles"
  | "kitchen"
  | "apparel"
  | "footwear"
  | "accessories";

export interface Product {
  sku: string;
  name: string;
  category: Category;
  stock: number;
  price: number;
}

const baseProducts: { name: string; category: Category; price: number }[] = [
  { name: "Aurora desk lamp", category: "lighting", price: 89.9 },
  { name: "Halo pendant light", category: "lighting", price: 149 },
  { name: "Linen throw pillow", category: "textiles", price: 34.5 },
  { name: "Wool blend blanket", category: "textiles", price: 79 },
  { name: "Ceramic pour-over set", category: "kitchen", price: 49 },
  { name: "Walnut cutting board", category: "kitchen", price: 59 },
  { name: "Merino wool beanie", category: "apparel", price: 29.9 },
  { name: "Organic cotton hoodie", category: "apparel", price: 69 },
  { name: "Trail running shoes", category: "footwear", price: 139.95 },
  { name: "Leather chelsea boots", category: "footwear", price: 189 },
  { name: "Canvas weekender bag", category: "accessories", price: 119 },
  { name: "Recycled glass carafe", category: "accessories", price: 32 },
];

const variants = ["Black", "Sand", "Forest", "Slate"];

export const products: Product[] = baseProducts.flatMap(
  (product, productIndex) =>
    variants.map((variant, variantIndex) => ({
      sku: `SW-${String(1000 + productIndex * 10 + variantIndex)}`,
      name: `${product.name}, ${variant}`,
      category: product.category,
      stock: (productIndex * 37 + variantIndex * 13) % 120,
      price: product.price,
    })),
);
