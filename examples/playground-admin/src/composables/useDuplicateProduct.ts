import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useSnackbar } from "@shopware-ag/meteor-component-library";
import type { Product } from "../../shared/types";
import { useRepository } from "./useRepository";

/** Saves a copy of a product and opens it. */
export function useDuplicateProduct() {
  const { t } = useI18n();
  const router = useRouter();
  const { addSnackbar } = useSnackbar();
  const productRepository = useRepository("product");

  async function duplicateProduct(product: Product) {
    const copy = await productRepository.save({
      ...product,
      id: "",
      name: t("products.copy", { name: product.name }),
      productNumber: `${product.productNumber}-1`,
      sales: 0,
    });

    addSnackbar({ message: t("products.duplicated"), variant: "success" });
    router.push({ name: "product-detail", params: { id: copy.id } });
  }

  return { duplicateProduct };
}
