<script setup lang="ts">
import { computed } from "vue";
import {
  MtActionMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
  MtAvatar,
  MtBadge,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtIcon,
  MtText,
} from "@shopware-ag/meteor-component-library";

/**
 * PROTOTYPE of a context switcher for the context slot of the app header, such as the store or
 * the sales channel the app works in. In the bar it reads like a breadcrumb after the brand, each
 * level after a slash; in the drawer it fills a row.
 */
const props = withDefaults(
  defineProps<{
    /** What is switched, such as "Store". Read before the current option by assistive technology. */
    label: string;
    /** The heading above the options in the menu, such as "Stores". */
    heading: string;
    options: { id: string; name: string; badge?: string }[];
    /** Adds an action below the options to create a new one. */
    createLabel?: string;
    orientation?: "horizontal" | "vertical";
  }>(),
  {
    createLabel: undefined,
    orientation: "horizontal",
  },
);

const model = defineModel<string>({ required: true });

const emit = defineEmits<{
  create: [];
}>();

const current = computed(() =>
  props.options.find((option) => option.id === model.value),
);
</script>

<template>
  <div
    class="context-switcher-prototype"
    :class="`context-switcher-prototype--${orientation}`"
  >
    <span
      v-if="orientation === 'horizontal'"
      class="context-switcher-prototype__separator"
      aria-hidden="true"
    />

    <mt-dropdown-menu-root>
      <mt-dropdown-menu-trigger as-child>
        <button type="button" class="context-switcher-prototype__trigger">
          <span class="visually-hidden">{{ label }}:</span>
          <mt-avatar
            v-if="current"
            size="2xs"
            variant="square"
            :first-name="current.name"
          />
          <span class="context-switcher-prototype__name">
            {{ current?.name }}
          </span>
          <mt-badge v-if="current?.badge" size="s">{{
            current.badge
          }}</mt-badge>
          <span class="context-switcher-prototype__chevrons">
            <mt-icon name="regular-chevron-up-xxs" size="6" decorative />
            <mt-icon name="regular-chevron-down-xxs" size="6" decorative />
          </span>
        </button>
      </mt-dropdown-menu-trigger>

      <!-- Inside the drawer, a modal dialog, the menu has to stay in the dialog to be usable. -->
      <mt-dropdown-menu-portal :disabled="orientation === 'vertical'">
        <mt-action-menu
          class="context-switcher-prototype__menu"
          side="bottom"
          align="start"
          :side-offset="4"
        >
          <mt-action-menu-group>
            <mt-text
              as="div"
              size="2xs"
              color="color-text-secondary-default"
              class="context-switcher-prototype__heading"
            >
              {{ heading }}
            </mt-text>

            <mt-action-menu-item
              v-for="option in options"
              :key="option.id"
              :aria-current="option.id === model || undefined"
              @select="model = option.id"
            >
              <mt-avatar
                size="2xs"
                variant="square"
                :first-name="option.name"
              />
              <span class="context-switcher-prototype__name">
                {{ option.name }}
              </span>
              <mt-badge v-if="option.badge" size="s">{{
                option.badge
              }}</mt-badge>
              <mt-icon
                v-if="option.id === model"
                name="regular-checkmark-xs"
                size="10"
                class="context-switcher-prototype__check"
                decorative
              />
            </mt-action-menu-item>
          </mt-action-menu-group>

          <mt-action-menu-group v-if="createLabel">
            <mt-action-menu-item icon="regular-plus" @select="emit('create')">
              {{ createLabel }}
            </mt-action-menu-item>
          </mt-action-menu-group>
        </mt-action-menu>
      </mt-dropdown-menu-portal>
    </mt-dropdown-menu-root>
  </div>
</template>

<style scoped>
.context-switcher-prototype {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  min-width: 0;
}

/* A thin slanted line, like a slash between the levels of a breadcrumb. */
.context-switcher-prototype__separator {
  flex-shrink: 0;
  width: var(--scale-size-1);
  height: var(--scale-size-20);
  margin-inline: var(--scale-size-4);
  background: var(--color-border-primary-default);
  transform: rotate(20deg);
}

.context-switcher-prototype__trigger {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  min-width: 0;
  height: var(--scale-size-32);
  padding-inline: var(--scale-size-8);
  color: var(--color-text-primary-default);
  font-family: inherit;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  background: transparent;
  border: none;
  border-radius: var(--border-radius-s);
  cursor: pointer;
}

.context-switcher-prototype__trigger:hover,
.context-switcher-prototype__trigger[data-state="open"] {
  background: var(--color-interaction-secondary-hover);
}

.context-switcher-prototype__trigger:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(-1 * var(--scale-size-2));
}

.context-switcher-prototype__name {
  overflow: hidden;
  max-width: var(--scale-size-160);
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* An up and a down chevron: the button opens a list to choose from. */
.context-switcher-prototype__chevrons {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-1);
  color: var(--color-icon-secondary-default);
}

/* In the drawer the button fills the row, with the chevrons at its end. */
.context-switcher-prototype--vertical .context-switcher-prototype__trigger {
  flex: 1;
  height: var(--scale-size-40);
}

.context-switcher-prototype--vertical .context-switcher-prototype__chevrons {
  margin-inline-start: auto;
}

/* The menu renders in a portal outside this component, where scoped styles don't reach. */
:global(.context-switcher-prototype__menu) {
  min-width: var(--scale-size-256);
}

/* Lines up with the menu items below it. */
.context-switcher-prototype__heading {
  padding: var(--scale-size-4) var(--scale-size-10);
}

.context-switcher-prototype__check {
  margin-inline-start: auto;
  color: var(--color-icon-primary-default);
}
</style>
