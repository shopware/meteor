<template>
  <DrawerRoot
    :open="isOpen"
    :modal="false"
    :swipe-direction="swipeDirections[side]"
    @update:open="onOpenChange"
  >
    <slot :open="isOpen" :close="() => setOpen(false)" />
  </DrawerRoot>
</template>

<script setup lang="ts">
import { computed, provide, ref } from "vue";
import { DrawerRoot } from "reka-ui";
import {
  drawerContextKey,
  type MtDrawerDismissReason,
  type MtDrawerSide,
} from "./composables/useDrawerContext";

/**
 * @experimental Builds on an alpha primitive; the API may still change.
 *
 * Holds the open state of a drawer and decides how it may be dismissed. Place
 * `mt-drawer-trigger` and `mt-drawer-content` inside it.
 */
const props = withDefaults(
  defineProps<{
    /** Whether the drawer is open. Bind it with `v-model:open` or leave it out to let the drawer manage it. */
    open?: boolean;
    /** Whether the drawer starts open when `open` is not bound. */
    defaultOpen?: boolean;
    /**
     * Whether a click on the backdrop, Escape or a swipe closes the drawer. When `false`,
     * these emit `dismiss-prevented` instead, for example to confirm discarding unsaved changes.
     * Close buttons always close the drawer.
     */
    dismissible?: boolean;
  }>(),
  {
    open: undefined,
    defaultOpen: false,
    dismissible: true,
  },
);

const emit = defineEmits<{
  (e: "update:open", open: boolean): void;
  (e: "dismiss-prevented", details: { reason: MtDrawerDismissReason }): void;
}>();

defineSlots<{
  default?(props: { open: boolean; close: () => void }): unknown;
}>();

const swipeDirections = {
  start: "left",
  end: "right",
  top: "up",
  bottom: "down",
} as const;

const uncontrolledOpen = ref(props.defaultOpen);
const isOpen = computed(() => props.open ?? uncontrolledOpen.value);
const side = ref<MtDrawerSide>("end");
let resetSwipe: (() => void) | undefined;

function setOpen(open: boolean) {
  if (open === isOpen.value) return;

  uncontrolledOpen.value = open;
  emit("update:open", open);
}

function dismiss(reason: MtDrawerDismissReason) {
  if (props.dismissible) {
    setOpen(false);
    return;
  }

  if (reason === "swipe") resetSwipe?.();
  emit("dismiss-prevented", { reason });
}

function onOpenChange(open: boolean, details?: { reason?: string }) {
  if (!open && details?.reason === "swipe") dismiss("swipe");
  else setOpen(open);
}

provide(drawerContextKey, {
  isOpen,
  side,
  setOpen,
  dismiss,
  onSwipeRefused: (reset) => {
    resetSwipe = reset;
  },
});
</script>
