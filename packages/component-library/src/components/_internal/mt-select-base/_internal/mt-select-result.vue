<template>
  <li
    class="mt-select-result"
    :class="resultClasses"
    @mouseenter="onMouseEnter"
    @click.stop="onClickResult"
    :aria-disabled="disabled"
  >
    <span class="mt-select-result__result-item-preview">
      <slot name="preview" />
    </span>

    <span class="mt-select-result__result-item-text">
      <slot />
    </span>

    <transition name="mt-select-result-appear">
      <mt-icon v-if="selected" name="regular-checkmark-xs" size="16px" />
    </transition>

    <span v-if="hasDescriptionSlot" class="mt-select-result__result-item-description">
      <slot name="description" />
    </span>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtIcon from "../../../mt-icon/mt-icon.vue";
import { inject } from "vue";
import {
  MtSelectResultAddActiveItemListener,
  MtSelectResultAddItemSelectByKeyboardListener,
  MtSelectResultRemoveActiveItemListener,
  MtSelectResultRemoveItemSelectByKeyboardListener,
} from "./mt-select-result-context";

export default defineComponent({
  components: {
    "mt-icon": MtIcon,
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
        `mt-select-option--${this.index}`,
      ];
    },

    hasDescriptionSlot(): boolean {
      return !!this.$slots.description;
    },
  },

  setup() {
    const addActiveItemListener = inject(MtSelectResultAddActiveItemListener);
    const removeActiveItemListener = inject(MtSelectResultRemoveActiveItemListener);
    const addItemSelectByKeyboardListener = inject(MtSelectResultAddItemSelectByKeyboardListener);
    const removeItemSelectByKeyboardListener = inject(
      MtSelectResultRemoveItemSelectByKeyboardListener,
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

<style>
.mt-select-result {
  padding: var(--scale-size-12) var(--scale-size-4);
  cursor: pointer;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  border-radius: 4px;

  .mt-select-result__result-item-preview {
    order: 1;
    margin-inline-end: var(--scale-size-10);
    display: block;
  }

  .mt-select-result__result-item-text {
    max-width: 100%;
    word-break: break-word;
    display: flex;
    flex-direction: column;
    color: var(--color-text-primary-default);
    order: 2;
  }

  &.is--active {
    background: var(--color-background-brand-default);
    color: var(--color-text-brand-default);

    .mt-select-result__result-item-text {
      color: var(--color-text-brand-default);
    }
  }

  .mt-select-result__result-item-description {
    width: 100%;
    color: var(--color-text-secondary-default);
    order: 3;
    line-height: 14px;
    padding-inline-start: var(--scale-size-8);
  }

  > .mt-icon {
    color: var(--color-icon-primary-default);
    margin-inline-start: var(--scale-size-4);
    order: 4;
    justify-self: end;
  }

  &.is--description-bottom {
    grid-template-columns: 1fr auto;

    .mt-select-result__result-item-description {
      grid-column-start: 1;
      padding-block-start: var(--scale-size-8);
      padding-inline-start: 0;
      order: 3;
    }

    .mt-icon {
      order: 2;
    }
  }

  &.is--disabled {
    color: var(--color-text-primary-disabled);

    &.is--active {
      background: var(--color-background-secondary-default);
      color: var(--color-text-primary-disabled);
      cursor: default;
    }

    .mt-highlight-text__highlight {
      color: var(--color-text-primary-disabled);
    }

    .mt-select-result__result-item-text {
      color: var(--color-text-primary-disabled);
    }
  }

  &:last-child {
    border-block-end: 0 none;
  }

  /* Vue.js transitions */
  .mt-select-result-appear-enter-active,
  .mt-select-result-appear-leave-active {
    transition: all ease-in-out 0.15s;
    transform: translateY(0);
  }

  .mt-select-result-appear-enter,
  .mt-select-result-appear-leave-to {
    opacity: 0;
    transform: translateY(-15px);
  }
}
</style>
