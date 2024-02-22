<template>
  <li
    class="sw-select-result"
    :class="resultClasses"
    @mouseenter="onMouseEnter"
    @click.stop="onClickResult"
  >
    <span class="sw-select-result__result-item-preview">
      <slot name="preview" />
    </span>

    <span class="sw-select-result__result-item-text">
      <slot />
    </span>

    <transition name="sw-select-result-appear">
      <sw-icon v-if="selected" name="regular-checkmark-xs" size="16px" />
    </transition>

    <span v-if="hasDescriptionSlot" class="sw-select-result__result-item-description">
      <slot name="description" />
    </span>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SwIcon from "../../../../icons-media/sw-icon/sw-icon.vue";
import { inject } from "vue";
import {
  swSelectResultAddActiveItemListener,
  swSelectResultAddItemSelectByKeyboardListener,
  swSelectResultRemoveActiveItemListener,
  swSelectResultRemoveItemSelectByKeyboardListener,
} from "@/helper/provideInjectKeys";

export default defineComponent({
  components: {
    "sw-icon": SwIcon,
  },

  inject: ["setActiveItemIndex"],

  props: {
    index: {
      type: Number,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
    descriptionPosition: {
      type: String,
      required: false,
      default: "right",
      validator(value: string) {
        return ["bottom", "right"].includes(value);
      },
    },
  },

  data() {
    return {
      active: false,
    };
  },

  computed: {
    resultClasses(): (
      | string
      | {
          [className: string]: boolean;
          "is--active": boolean;
          "is--disabled": boolean;
          "has--description": boolean;
        }
    )[] {
      return [
        {
          "is--active": this.active,
          "is--disabled": this.disabled,
          "has--description": this.hasDescriptionSlot,
          [`is--description-${this.descriptionPosition}`]: this.hasDescriptionSlot,
        },
        `sw-select-option--${this.index}`,
      ];
    },

    hasDescriptionSlot(): boolean {
      return !!this.$slots.description;
    },
  },

  setup() {
    const addActiveItemListener = inject(swSelectResultAddActiveItemListener);
    const removeActiveItemListener = inject(swSelectResultRemoveActiveItemListener);
    const addItemSelectByKeyboardListener = inject(swSelectResultAddItemSelectByKeyboardListener);
    const removeItemSelectByKeyboardListener = inject(
      swSelectResultRemoveItemSelectByKeyboardListener,
    );

    return {
      addActiveItemListener,
      removeActiveItemListener,
      addItemSelectByKeyboardListener,
      removeItemSelectByKeyboardListener,
    };
  },

  created() {
    if (this.addActiveItemListener) {
      this.addActiveItemListener(this.checkIfActive);
    }

    if (this.addItemSelectByKeyboardListener) {
      this.addItemSelectByKeyboardListener(this.checkIfSelected);
    }
  },

  unmounted() {
    if (this.removeActiveItemListener) {
      this.removeActiveItemListener(this.checkIfActive);
    }

    if (this.removeItemSelectByKeyboardListener) {
      this.removeItemSelectByKeyboardListener(this.checkIfSelected);
    }
  },

  methods: {
    checkIfSelected(selectedItemIndex: number) {
      if (selectedItemIndex === this.index) this.onClickResult();
    },

    checkIfActive(activeItemIndex: number) {
      this.active = this.index === activeItemIndex;
    },

    onClickResult() {
      if (this.disabled) {
        return;
      }

      // @ts-expect-error - parent.parent should be defined
      this.$parent.$parent.$emit("item-select", this.item);
    },

    onMouseEnter() {
      // @ts-expect-error - method gets injected
      this.setActiveItemIndex(this.index);
    },
  },
});
</script>

<style lang="scss">
@import "../../../../assets/scss/variables.scss";

$sw-select-result-active-color-background: lighten($color-shopware-brand-500, 40%);
$sw-select-result-active-color-text: $color-shopware-brand-500;
$sw-select-result-color-border: $color-gray-300;
$sw-select-result-color-icon: darken($color-gray-100, 20%);
$sw-select-result-transition-item-icon: all ease-in-out 0.15s;
$sw-select-result-disabled-color-background: $color-gray-100;
$sw-select-result-disabled-color-text: darken($color-gray-300, 15%);

.sw-select-result {
  padding: 12px 4px;
  cursor: pointer;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  border-radius: 4px;

  .sw-select-result__result-item-preview {
    order: 1;
    margin-right: 10px;
    display: block;
  }

  .sw-select-result__result-item-text {
    max-width: 100%;
    word-break: break-word;
    display: flex;
    flex-direction: column;
    color: $color-darkgray-200;
    order: 2;
  }

  &.is--active {
    background: $sw-select-result-active-color-background;
    color: $sw-select-result-active-color-text;

    .sw-select-result__result-item-text {
      color: $sw-select-result-active-color-text;
    }
  }

  .sw-select-result__result-item-description {
    width: 100%;
    color: $color-gray-600;
    order: 3;
    line-height: 14px;
    padding: 0 0 0 8px;
  }

  > .sw-icon {
    color: $sw-select-result-color-icon;
    margin-left: 4px;
    order: 4;
    justify-self: end;
  }

  &.is--description-bottom {
    grid-template-columns: 1fr auto;

    .sw-select-result__result-item-description {
      grid-column-start: 1;
      padding: 8px 0 0;
      order: 3;
    }

    .sw-icon {
      order: 2;
    }
  }

  &.is--disabled {
    color: $sw-select-result-disabled-color-text;

    &.is--active {
      background: $sw-select-result-disabled-color-background;
      color: $sw-select-result-disabled-color-text;
      cursor: default;
    }

    .sw-highlight-text__highlight {
      color: $sw-select-result-disabled-color-text;
    }

    .sw-select-result__result-item-text {
      color: $sw-select-result-disabled-color-text;
    }
  }

  &:last-child {
    border-bottom: 0 none;
  }

  // Vue.js transitions
  .sw-select-result-appear-enter-active,
  .sw-select-result-appear-leave-active {
    transition: $sw-select-result-transition-item-icon;
    transform: translateY(0);
  }

  .sw-select-result-appear-enter,
  .sw-select-result-appear-leave-to {
    opacity: 0;
    transform: translateY(-15px);
  }
}
</style>
