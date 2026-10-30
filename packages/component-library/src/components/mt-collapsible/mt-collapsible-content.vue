<template>
  <CollapsibleContent
    ref="content"
    class="mt-collapsible-content"
    :class="{ 'mt-collapsible-content--animated': isAnimated }"
    :as="as"
    :as-child="asChild"
    :force-mount="forceMount"
    @content-found="() => emits('contentFound')"
    @animationend.self="isAnimated = false"
    @animationcancel.self="isAnimated = false"
  >
    <slot />
  </CollapsibleContent>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch } from "vue";
import { CollapsibleContent, injectCollapsibleRootContext } from "reka-ui";

withDefaults(
  defineProps<{
    as?: string | object;
    asChild?: boolean;
    forceMount?: boolean;
  }>(),
  {
    as: "div",
    asChild: false,
    forceMount: false,
  },
);

const emits = defineEmits<{
  contentFound: [];
}>();

// The content only animates when it opens or closes where it can be seen. A CSS animation would also
// restart when a hidden parent, such as a closed drawer, shows the content again.
const isAnimated = ref(false);
const root = injectCollapsibleRootContext();
const content = useTemplateRef<InstanceType<typeof CollapsibleContent>>("content");

/** Whether the place of the content is shown: a hidden ancestor leaves it without boxes. */
function isShown() {
  const place = (content.value?.$el as Node | undefined)?.parentElement;

  return Boolean(place && place.getClientRects().length > 0);
}

// Sync, so the class is in place when Reka looks for the closing animation before it removes the
// content.
watch(
  () => root.open.value,
  () => {
    isAnimated.value = isShown();
  },
  { flush: "sync" },
);
</script>

<style>
.mt-collapsible-content {
  overflow: hidden;
}

.mt-collapsible-content--animated[data-state="open"] {
  animation: mt-collapsible-slide-down 300ms ease-in-out;
}

.mt-collapsible-content--animated[data-state="closed"] {
  animation: mt-collapsible-slide-up 300ms ease-in-out;
}

@keyframes mt-collapsible-slide-down {
  from {
    height: 0;
  }
  to {
    height: var(--reka-collapsible-content-height);
  }
}

@keyframes mt-collapsible-slide-up {
  from {
    height: var(--reka-collapsible-content-height);
  }
  to {
    height: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mt-collapsible-content--animated[data-state="open"],
  .mt-collapsible-content--animated[data-state="closed"] {
    animation: none;
  }
}
</style>
