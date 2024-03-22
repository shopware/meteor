<template>
  <!-- eslint-disable vue/no-v-html -->
  <span
    class="mt-icon"
    :class="classes"
    :style="styles"
    :aria-hidden="decorative"
    :data-testid="'mt-icon__' + name"
    v-bind="$attrs"
    v-html="iconSvgData"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MtIcon",

  props: {
    /**
     * The type of the icon. You can use every icon from the meteor-icon-kit:
     * https://shopware.github.io/meteor-icon-kit/
     */
    name: {
      type: String,
      required: true,
    },
    /**
     * The color of the icon.
     */
    color: {
      type: String,
      required: false,
      default: null,
    },
    /**
     * If this is set to true then the icon is not detectable by screen reader. This should only
     * be done if this icon is only decorative and has no further purpose.
     */
    decorative: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      iconSvgData: "",
    };
  },

  computed: {
    iconName(): string {
      return `icons-${this.name}`;
    },

    classes(): string[] {
      return [`icon--${this.name}`];
    },

    styles(): Record<string, string> {
      return {
        color: this.color,
      };
    },
  },

  watch: {
    name: {
      handler(newName) {
        const [variant] = newName.split("-");
        const iconName = newName.split("-").slice(1).join("-");

        import(
          `./../../../../node_modules/@shopware-ag/meteor-icon-kit/icons/${variant}/${iconName}.svg`
        ).then((iconSvgData) => {
          if (iconSvgData.default) {
            this.iconSvgData = iconSvgData.default;
          } else {
            console.error(
              `The SVG file for the icon name ${newName} could not be found and loaded.`,
            );
            this.iconSvgData = "";
          }
        });
      },
      immediate: true,
    },
  },

  beforeMount() {
    this.iconSvgData = `<svg id="meteor-icon-kit__${this.name}"></svg>`;
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";
@import "../../assets/scss/mixins.scss";
@import "node_modules/@shopware-ag/meteor-icon-kit/icons/meteor-icon-kit.scss";

.mt-icon {
  display: inline-block;
  vertical-align: middle;
  line-height: 0;

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
