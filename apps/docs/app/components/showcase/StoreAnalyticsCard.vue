<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import MtHelpText from "@shopware-ag/meteor-component-library/MtHelpText";
import MtInset from "@shopware-ag/meteor-component-library/MtInset";
import MtChart from "@shopware-ag/meteor-component-library/MtChart";
import type { ChartOptions } from "@shopware-ag/meteor-component-library/MtChart";
import MtActionMenu from "@shopware-ag/meteor-component-library/MtActionMenu";
import MtActionMenuItem from "@shopware-ag/meteor-component-library/MtActionMenuItem";
import MtActionMenuGroup from "@shopware-ag/meteor-component-library/MtActionMenuGroup";
import {
  MtDropdownMenuRoot,
  MtDropdownMenuPortal,
  MtDropdownMenuTrigger,
  useSnackbar,
} from "@shopware-ag/meteor-component-library";
import ConfirmDialog from "./ConfirmDialog.vue";

const { addSnackbar } = useSnackbar();
const showRemove = ref(false);

function removeChart() {
  addSnackbar({ message: "Chart removed", variant: "error" });
}

// Fake a data reload: a progress snackbar that fills up, then flips to success.
function reloadData() {
  const snackbar = addSnackbar({
    variant: "progress",
    message: "Reloading data",
    progressPercentage: 0,
    successMessage: "Data reloaded",
  });

  [20, 45, 70, 90, 100].forEach((pct, i) => {
    window.setTimeout(
      () => {
        snackbar.progressPercentage = pct;
        if (pct === 100) snackbar.uploadState = "success";
      },
      (i + 1) * 400,
    );
  });
}

const revenueSeries = [
  { name: "Revenue", data: [28.2, 31.5, 30.1, 38.4, 42.8, 40.2, 46.1, 48.2] },
];
const revenueChartOptions: ChartOptions = {
  xaxis: {
    categories: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
  stroke: { curve: "smooth" },
  tooltip: {
    y: { formatter: (val: number) => `€${val.toFixed(1)}k` },
  },
  yaxis: {
    labels: { formatter: (val: number) => `€${Math.round(val)}k` },
  },
};
</script>

<template>
  <!-- Wrapper carries the scope id so the :deep rule can reach .mt-card__content. -->
  <div>
    <mt-card>
      <div class="flex flex-col gap-0">
        <div class="flex items-start justify-between gap-3">
          <div class="flex flex-col gap-1">
            <div class="inline-start">
              <mt-text size="s" weight="semibold">Total revenue</mt-text>
              <mt-help-text
                text="Net revenue across all sales channels, updated hourly."
              />
            </div>
            <mt-text size="xl" weight="bold">€48.2k</mt-text>
          </div>
          <mt-dropdown-menu-root>
            <mt-dropdown-menu-trigger as-child>
              <mt-button
                variant="secondary"
                square
                size="small"
                aria-label="Analytics options"
              >
                <template #iconFront>
                  <mt-icon name="solid-ellipsis-h" size="14" />
                </template>
              </mt-button>
            </mt-dropdown-menu-trigger>

            <mt-dropdown-menu-portal>
              <mt-action-menu>
                <mt-action-menu-group>
                  <mt-action-menu-item icon="sync" @select="reloadData"
                    >Reload data</mt-action-menu-item
                  >
                </mt-action-menu-group>

                <mt-action-menu-group>
                  <mt-action-menu-item
                    icon="table"
                    @select="
                      addSnackbar({
                        message: 'Exported as CSV',
                        variant: 'success',
                      })
                    "
                    >Export as CSV</mt-action-menu-item
                  >
                  <mt-action-menu-item
                    icon="image"
                    @select="
                      addSnackbar({
                        message: 'Exported as SVG',
                        variant: 'success',
                      })
                    "
                    >Export as SVG</mt-action-menu-item
                  >
                  <mt-action-menu-item
                    icon="duplicate"
                    @select="
                      addSnackbar({
                        message: 'Chart duplicated',
                        variant: 'success',
                      })
                    "
                    >Duplicate</mt-action-menu-item
                  >
                </mt-action-menu-group>

                <mt-action-menu-group>
                  <mt-action-menu-item
                    icon="trash"
                    variant="critical"
                    @select="showRemove = true"
                    >Remove</mt-action-menu-item
                  >
                </mt-action-menu-group>
              </mt-action-menu>
            </mt-dropdown-menu-portal>
          </mt-dropdown-menu-root>
        </div>
        <mt-inset class="chart-inset">
          <mt-chart
            type="area"
            :series="revenueSeries"
            :options="revenueChartOptions"
            height="180px"
          />
        </mt-inset>
      </div>
    </mt-card>

    <confirm-dialog
      v-model:open="showRemove"
      title="Remove chart?"
      message="This chart will be removed from your dashboard. This action cannot be undone."
      confirm-label="Remove"
      @confirm="removeChart"
    />
  </div>
</template>

<style scoped>
/* The chart bleeds to the bottom edge, so drop this card's bottom padding.
   `.mt-card` lifts specificity above MtCard's own padding rule. */
:deep(.mt-card .mt-card__content) {
  padding-bottom: 0;
}
/* Bleed the chart toward the card's side edges (no top/bottom bleed); small
   asymmetric inline padding keeps the axis labels off the very edge. */
.chart-inset {
  --mt-inset-block-start: 0;
  --mt-inset-block-end: 0;
  padding-inline-end: var(--scale-size-16);
  padding-inline-start: var(--scale-size-6);
}
.inline-start {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  min-width: 0;
}
</style>
