<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtInset from "@shopware-ag/meteor-component-library/MtInset";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import MtTextField from "@shopware-ag/meteor-component-library/MtTextField";
import MtSelect from "@shopware-ag/meteor-component-library/MtSelect";
import MtNumberField from "@shopware-ag/meteor-component-library/MtNumberField";
import MtDatepicker from "@shopware-ag/meteor-component-library/MtDatepicker";

const title = ref("Summer Sale");
const customer = ref("All customers");
const customerOptions = [
  { id: 1, label: "All customers", value: "All customers" },
  { id: 2, label: "Returning customers", value: "Returning customers" },
];
const percentage = ref(20);
const validRange = ref<string[]>([
  "2026-07-01T00:00:00.000Z",
  "2026-07-31T00:00:00.000Z",
]);
const validLabel = computed(() => {
  const [start, end] = validRange.value;
  if (!start || !end) return "Select validity dates";
  const fmt = (s: string) =>
    new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `Valid ${fmt(start)} - ${fmt(end)}`;
});
const muted = "color-text-secondary-default";
</script>

<template>
  <mt-card>
    <div class="voucher">
      <!-- Full-bleed sunken banner (top + sides) that the ticket floats on. -->
      <mt-inset class="voucher-bg">
        <div class="ticket">
          <div class="ticket__top">
            <div class="ticket__logo">
              <mt-icon
                name="solid-tag"
                size="20"
                color="var(--color-static-white)"
              />
            </div>
            <div class="min-w-0 flex-1">
              <mt-text
                size="s"
                weight="semibold"
                :color="title ? 'color-text-primary-default' : muted"
                class="truncate"
                >{{ title || "Campaign title" }}</mt-text
              >
              <mt-text size="2xs" :color="muted" class="truncate">{{
                customer
              }}</mt-text>
            </div>
            <mt-text size="2xl" weight="bold" class="shrink-0"
              >{{ percentage }}%</mt-text
            >
          </div>
          <div class="ticket__perf"></div>
          <div class="ticket__bottom">
            <mt-icon
              name="regular-calendar"
              size="16"
              color="var(--color-icon-primary-default)"
            />
            <mt-text size="2xs" weight="medium">{{ validLabel }}</mt-text>
          </div>
        </div>
      </mt-inset>

      <!-- Fields driving the ticket above. -->
      <div class="fields">
        <mt-text-field v-model="title" label="Title" size="small" />
        <mt-select
          v-model="customer"
          :options="customerOptions"
          label="Audience"
          small
        />
        <mt-number-field
          v-model="percentage"
          label="Discount"
          size="small"
          number-type="int"
          :min="0"
          :max="100"
          :show-controls="false"
        >
          <template #suffix>%</template>
        </mt-number-field>
        <mt-datepicker
          v-model="validRange"
          label="Validity"
          date-type="date"
          :range="true"
          locale="en-GB"
          size="small"
        />
      </div>
    </div>
  </mt-card>
</template>

<style scoped>
.voucher {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
}
/* Full-bleed sunken top banner (no bottom bleed) with a divider; the ticket
   sits inside its 16px padding. */
.voucher-bg {
  --mt-inset-block-end: 0;
  padding: var(--scale-size-16);
  background: var(--color-elevation-surface-sunken);
  border-bottom: 1px solid var(--color-border-secondary-default);
}
/* The ticket: a raised surface floating on the sunken backdrop. The border is an
   inset shadow (not a real `border`) so overflow:hidden clips at the true edge —
   letting the notch fill cover it — and the notch circles carry their own border
   so the outline follows the cut-out curve. */
.ticket {
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius-l);
  background: var(--color-elevation-surface-raised);
  box-shadow: inset 0 0 0 1px var(--color-border-secondary-default);
}
.ticket__top {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  padding: var(--scale-size-16);
}
.ticket__logo {
  display: grid;
  place-items: center;
  width: var(--scale-size-40);
  height: var(--scale-size-40);
  border-radius: var(--border-radius-round);
  background: var(--color-icon-brand-default);
  flex-shrink: 0;
}
/* Perforated divider spanning the full width. Its two ends are "punched out" by
   circles filled with the sunken backdrop colour — centred on the ticket's left
   and right edges, so they read as notches cut out of the ticket. */
.ticket__perf {
  position: relative;
  height: 0;
  border-top: 1px dashed var(--color-border-secondary-default);
}
.ticket__perf::before,
.ticket__perf::after {
  content: "";
  position: absolute;
  top: 0;
  box-sizing: border-box;
  width: var(--scale-size-16);
  height: var(--scale-size-16);
  border-radius: var(--border-radius-round);
  background: var(--color-elevation-surface-sunken);
  border: 1px solid var(--color-border-secondary-default);
}
.ticket__perf::before {
  left: 0;
  transform: translate(-50%, -50%);
}
.ticket__perf::after {
  right: 0;
  transform: translate(50%, -50%);
}
.ticket__bottom {
  display: flex;
  gap: var(--scale-size-8);
  padding: var(--scale-size-16);
}
.fields {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-12);
}
</style>
