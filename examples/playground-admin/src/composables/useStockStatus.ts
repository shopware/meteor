/** The color of a product's stock, as the Administration shows it. */
export function useStockStatus() {
  function variant(stock: number) {
    if (stock <= 0) return "critical";
    if (stock < 25) return "attention";

    return "positive";
  }

  return { variant };
}
