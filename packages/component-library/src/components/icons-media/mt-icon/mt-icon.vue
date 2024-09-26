<template>
  <!-- eslint-disable vue/no-v-html -->
  <span
    class="mt-icon"
    :class="[
      `icon--${props.name}`,
      {
        'mt-icon--custom-size': !!props.size,
      },
    ]"
    :style="styles"
    :aria-hidden="decorative"
    :data-testid="'mt-icon__' + name"
    v-bind="$attrs"
    v-html="iconSvgData"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from "vue";

const props = withDefaults(
  defineProps<{
    name: string;
    color?: string;
    decorative?: boolean;
    size?: string;
  }>(),
  {
    decorative: false,
    size: undefined,
  },
);

const iconSvgData = ref(`<svg id="meteor-icon-kit__${props.name}"></svg>`);

const styles = computed(() => {
  const styles: CSSProperties = {
    color: props.color,
  };

  if (props.size) {
    let size = props.size;

    // @ts-expect-error - This is a valid check
    if (!Number.isNaN(parseFloat(size)) && !Number.isNaN(size - 0)) {
      size = `${size}px`;
    }

    styles.width = size;
    styles.height = size;
  }

  return styles;
});

watch(
  () => props.name,
  (newName) => {
    const [variant] = newName.split("-");
    const iconName = newName.split("-").slice(1).join("-");

    import(
      `./../../../../node_modules/@shopware-ag/meteor-icon-kit/icons/${variant}/${iconName}.svg`
    ).then((data) => {
      if (data.default) {
        iconSvgData.value = data.default;
        return;
      }

      console.error(`The SVG file for the icon name ${newName} could not be found and loaded.`);
      iconSvgData.value = "";
    });
  },
  { immediate: true },
);
</script>

<style lang="scss">
@import "node_modules/@shopware-ag/meteor-icon-kit/icons/meteor-icon-kit.scss";

.mt-icon {
  display: inline-block;
  vertical-align: middle;
  line-height: 0;

  &--custom-size > svg {
    width: 100% !important;
    height: 100% !important;
  }

  > svg {
    fill: currentColor;
    vertical-align: middle;
    width: 100%;
    height: 100%;

    path,
    use {
      fill: currentColor;
    }
  }
}
</style>
