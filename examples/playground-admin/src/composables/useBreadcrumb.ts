import { computed, type ComputedRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import type { BreadcrumbItem } from "@shopware-ag/meteor-component-library";

/**
 * The breadcrumb of the current page for `mt-page`: the sections from the `breadcrumb` meta of the
 * matched routes, then `parents`, the levels only the page knows, such as the parents of a
 * category, then the page itself labelled with `title`. The first item shows the section's `icon`
 * meta.
 */
export function useBreadcrumb(
  title: () => string,
  parents: () => BreadcrumbItem[] = () => [],
): ComputedRef<BreadcrumbItem[]> {
  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();

  return computed(() => {
    // `route.matched` keeps each record's own meta, unlike `route.meta`, which merges them.
    const sections = route.matched.flatMap((record) => {
      const label = record.meta.breadcrumb;

      // A section's own index page, such as the product list, is the page itself.
      if (!label || router.resolve(record.path).path === route.path) return [];

      return [{ label: t(label), to: record.path }];
    });

    const [first, ...rest] = [...sections, ...parents(), { label: title() }];

    return [{ ...first, icon: route.meta.icon }, ...rest];
  });
}
