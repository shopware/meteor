<template>
  <!-- eslint-disable vue/no-v-html -->
  <span
    class="mt-icon"
    :class="[
      `icon--${props.name}`,
      {
        'mt-icon--custom-size':
          !!props.size ||
          !!($attrs.style as CSSProperties | undefined)?.width ||
          !!($attrs.style as CSSProperties | undefined)?.height,
      },
    ]"
    :style="styles"
    :aria-hidden="decorative"
    :data-testid="`mt-icon__${iconInformation.mode}-${iconInformation.name}`"
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
    mode?: "solid" | "regular";
  }>(),
  {
    color: undefined,
    decorative: false,
    size: undefined,
    mode: "regular",
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

const iconInformation = computed(() => {
  const isModeInNameIncluded = props.name.startsWith("solid-") || props.name.startsWith("regular-");

  if (isModeInNameIncluded) {
    return {
      mode: props.name.split("-")[0] as "solid" | "regular",
      name: props.name.split("-").slice(1).join("-"),
    };
  }

  return {
    mode: props.mode,
    name: props.name,
  };
});

function handleFailedImport(detail: string = "") {
  console.error(
    `The SVG file for the icon "${iconInformation.value.mode}-${iconInformation.value.name}" could not be found and loaded.`,
  );

  if (detail) {
    console.error(detail);
  }

  iconSvgData.value = "";
}

const icons = import.meta.glob("/node_modules/@shopware-ag/meteor-icon-kit/icons/**/*.svg", {
  import: "default",
  eager: false,
});

watch(
  iconInformation,
  () => {
    const iconPath = `/node_modules/@shopware-ag/meteor-icon-kit/icons/${iconInformation.value.mode}/${iconInformation.value.name}.svg`;
    const loader = icons[iconPath];

    if (loader) {
      loader()
        .then((data) => {
          if (data) {
            iconSvgData.value = data as string;
            return;
          }

          handleFailedImport();
        })
        .catch(handleFailedImport);
    } else {
      handleFailedImport();
    }
  },
  { immediate: true },
);
</script>

<style lang="scss">
@import "@shopware-ag/meteor-icon-kit/icons/meteor-icon-kit.scss";

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
