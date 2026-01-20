<template>
  <div
    class="example-radio-option"
    :class="{
      'example-radio-option--checked': checked,
      'example-radio-option--disabled': disabled,
    }"
  >
    <div class="example-radio-option__header">
      <div class="example-radio-option__header-content">
        <h3 class="example-radio-option__title">{{ title }}</h3>
        <div class="example-radio-option__price-section">
          <span class="example-radio-option__price">{{ price }}</span>
          <div class="example-radio-option__billing">
            <div>per editor / month</div>
            <div>billed annually</div>
          </div>
        </div>
      </div>
      <div class="example-radio-option__indicator">
        <slot name="indicator" />
      </div>
    </div>
    <div class="example-radio-option__divider"></div>
    <div class="example-radio-option__content">
      <div class="example-radio-option__feature">
        <div class="example-radio-option__feature-icon">
          <MtIcon name="regular-image" size="var(--scale-size-16)" aria-hidden="true" />
        </div>
        <span>{{ feature1 }}</span>
      </div>
      <div class="example-radio-option__feature">
        <div class="example-radio-option__feature-icon">
          <MtIcon name="regular-flow" size="var(--scale-size-16)" aria-hidden="true" />
        </div>
        <span>{{ feature2 }}</span>
      </div>
      <div class="example-radio-option__feature">
        <div class="example-radio-option__feature-icon">
          <MtIcon name="regular-chart-line" size="var(--scale-size-16)" aria-hidden="true" />
        </div>
        <span>{{ feature3 }}</span>
      </div>
      <div class="example-radio-option__feature">
        <div class="example-radio-option__feature-icon">
          <MtIcon name="regular-headset" size="var(--scale-size-16)" aria-hidden="true" />
        </div>
        <span>48h support reaction time</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";

withDefaults(
  defineProps<{
    title?: string;
    checked?: boolean;
    disabled?: boolean;
    feature1?: string;
    feature2?: string;
    feature3?: string;
    price?: string;
  }>(),
  {
    title: "Pro",
    checked: false,
    disabled: false,
    feature1: "100 image generations",
    feature2: "Unlimited workflows",
    feature3: "Advanced analytics",
    price: "$10",
  },
);
</script>

<style scoped>
.example-radio-option {
  margin: var(--scale-size-8);
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-24, 24px);
  padding: var(--scale-size-24, 24px) var(--scale-size-28, 28px);
  border-radius: var(--border-radius-3xl, 24px);
  border: 1px solid var(--color-border-secondary-default, #e2e3e9);
  background: var(--color-background-primary-default, #ffffff);
  box-shadow: 0px 6px 34px 0px var(--color-elevation-shadow-default, rgba(16, 16, 19, 0.1));
  cursor: pointer;
  overflow: clip;
}

.example-radio-option:hover:not(.example-radio-option--disabled) {
  box-shadow: 0px 6px 34px 0px var(--color-elevation-shadow-hover, rgba(16, 16, 19, 0.15));
}

.example-radio-option--checked {
  outline: 2px solid var(--color-border-brand-default, #0870ff);
  outline-offset: 2px;
}

.example-radio-option--disabled {
  cursor: not-allowed;
  background: var(--color-background-primary-disabled);
  opacity: 0.6;
}

.example-radio-option__header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.example-radio-option__header-content {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16, 16px);
  flex: 1;
}

.example-radio-option__title {
  font-family: var(--font-family-body, "Inter");
  font-size: var(--font-size-l, 20px);
  font-weight: var(--font-weight-semibold, 600);
  line-height: var(--font-line-height-l, 30px);
  color: var(--color-text-primary-default, #1e1e24);
  margin: 0;
}

.example-radio-option__price-section {
  display: flex;
  flex-direction: row;
  gap: var(--scale-size-12, 12px);
  align-items: center;
}

.example-radio-option__price {
  font-family: var(--font-family-headings, "Inter");
  font-size: var(--font-size-3xl, 32px);
  font-weight: var(--font-weight-bold, 700);
  line-height: var(--font-line-height-3xl, 40px);
  color: var(--color-text-primary-default, #1e1e24);
}

.example-radio-option__billing {
  display: flex;
  flex-direction: column;
  font-family: var(--font-family-body, "Inter");
  font-size: var(--font-size-xs, 14px);
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--font-line-height-xs, 22px);
  color: var(--color-text-secondary-default, #696a6e);
}

.example-radio-option__indicator {
  flex-shrink: 0;
}

.example-radio-option__divider {
  height: 1px;
  width: 100%;
  background: var(--color-border-secondary-default, #e2e3e9);
}

.example-radio-option__content {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-10, 10px);
  width: 100%;
}

.example-radio-option__feature {
  display: flex;
  flex-direction: row;
  gap: var(--scale-size-12, 12px);
  align-items: center;
  min-height: 16px;
}

.example-radio-option__feature-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-icon-primary-default, #1e1e24);
}

.example-radio-option__feature span {
  font-family: var(--font-family-body, "Inter");
  font-size: var(--font-size-xs, 14px);
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--font-line-height-xs, 22px);
  color: var(--color-text-primary-default, #1e1e24);
  display: flex;
}
</style>
