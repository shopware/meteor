<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtUrlField from "@shopware-ag/meteor-component-library/MtUrlField";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import MtLink from "@shopware-ag/meteor-component-library/MtLink";

const customDomain = ref("company.io");

// With no domain entered, the DNS/SSL checks read as failing.
const domainValid = computed(() => customDomain.value.trim() !== "");
const statusIcon = computed(() =>
  domainValid.value ? "solid-check-circle" : "solid-times-circle",
);
const statusColor = computed(() =>
  domainValid.value
    ? "var(--color-icon-positive-default)"
    : "var(--color-icon-critical-default)",
);
</script>

<template>
  <!-- Wrapper carries the scope id so the :deep rule can reach .mt-card__header. -->
  <div>
    <mt-card
      title="Add custom domain"
      subtitle="Point a domain you own to this Storefront."
    >
      <div class="section">
        <mt-url-field v-model="customDomain" />
        <div class="stack-sm">
          <div class="inline-start">
            <mt-icon :name="statusIcon" size="16" :color="statusColor" />
            <mt-text size="xs">DNS settings valid</mt-text>
          </div>
          <div class="inline-start">
            <mt-icon :name="statusIcon" size="16" :color="statusColor" />
            <mt-text size="xs">SSL certificate valid</mt-text>
          </div>
        </div>
        <!-- Decorative demo link: a plain anchor (not router-link, whose own
             click handler could navigate before a prevent) with the jump to
             "#" suppressed. -->
        <mt-link as="a" href="#" type="external" @click.prevent>
          Learn about custom domains
        </mt-link>
      </div>
    </mt-card>
  </div>
</template>

<style scoped>
/* A titled section: a 16px-gap column holding the field, checks, and link. */
.section {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
}
.stack-sm {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-8);
}
/* A check icon + its label. */
.inline-start {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  min-width: 0;
}
/* MtCard's header is flex-wrap: wrap; with a multi-line subtitle the empty
   #headerRight slot div wraps onto its own line, adding a stray row-gap below
   the titles. This card has no headerRight, so keep the header on one line.
   `.mt-card` lifts specificity above MtCard's own header rule. */
:deep(.mt-card .mt-card__header) {
  flex-wrap: nowrap;
}
/* MtLink inherits its font size (and its external icon scales with it), so pin
   the link to 14px and keep it to its text width (it's a flex item in the
   .section column, which would otherwise stretch it full width). */
:deep(.mt-link) {
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  align-self: flex-start;
}
</style>
