<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  ref,
  type VNode,
} from "vue";

type TabsOrientation = "horizontal" | "vertical";
type TabsVariant = "link" | "pill";
type ClassValue =
  | string
  | null
  | undefined
  | false
  | ClassValue[];
type TabsUi = Partial<
  Record<
    | "root"
    | "list"
    | "indicator"
    | "trigger"
    | "leadingIcon"
    | "leadingAvatar"
    | "leadingAvatarSize"
    | "label"
    | "trailingBadge"
    | "trailingBadgeSize"
    | "content",
    ClassValue
  >
>;

const props = withDefaults(
  defineProps<{
    defaultValue?: string;
    sync?: string;
    hash?: string;
    variant?: TabsVariant;
    orientation?: TabsOrientation;
    class?: unknown;
    ui?: TabsUi;
  }>(),
  {
    defaultValue: "0",
    variant: "link",
  },
);

const slots = defineSlots<{
  default?: () => VNode[];
}>();

const model = defineModel<string | number>();
const rerenderCount = ref(1);
const isCompact = ref(false);

let compactQuery: MediaQueryList | undefined;

function syncCompactState(event?: MediaQueryListEvent) {
  isCompact.value = event?.matches ?? Boolean(compactQuery?.matches);
}

onMounted(() => {
  compactQuery = window.matchMedia("(max-width: 767.98px)");
  syncCompactState();
  compactQuery.addEventListener("change", syncCompactState);

  if (props.sync) {
    const syncKey = `tabs-${props.sync}`;
    const syncValue = useState<string | null>(syncKey, () =>
      localStorage.getItem(syncKey),
    );

    watch(
      syncValue,
      () => {
        if (!syncValue.value) return;
        model.value = syncValue.value;
      },
      { immediate: true },
    );

    watch(model, () => {
      if (!model.value) return;
      syncValue.value = String(model.value);
      localStorage.setItem(syncKey, String(model.value));
    });
  }
});

onBeforeUnmount(() => {
  compactQuery?.removeEventListener("change", syncCompactState);
});

onBeforeUpdate(() => rerenderCount.value++);

const orientation = computed<TabsOrientation>(
  () => props.orientation ?? (isCompact.value ? "vertical" : "horizontal"),
);

function flatten(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) =>
    typeof node.type === "symbol" && Array.isArray(node.children)
      ? flatten(node.children as VNode[])
      : [node],
  );
}

const items = computed(() => {
  // Slot vnodes are not reactive, so depend on rerenderCount (bumped in
  // onBeforeUpdate) to re-read them whenever the component re-renders.
  rerenderCount.value;
  return flatten(slots.default?.() ?? [])
    .filter((slot) => typeof slot.type !== "symbol")
    .map((slot, index) => ({
      label: (slot.props?.label as string | undefined) ?? `${index}`,
      description: slot.props?.description as string | undefined,
      icon: slot.props?.icon as string | undefined,
      component: slot,
    }));
});

const ui = computed(() => ({
  ...props.ui,
  root: [
    "my-5 gap-8",
    orientation.value === "vertical" ? "flex-col items-stretch" : undefined,
    props.ui?.root,
  ],
  list: [
    "w-full",
    orientation.value === "vertical" ? "items-stretch" : undefined,
    props.ui?.list,
  ],
  trigger: [
    orientation.value === "vertical" ? "justify-start" : undefined,
    props.ui?.trigger,
  ],
}));

function onUpdateModelValue() {
  if (!props.hash) return;

  const hash = props.hash.startsWith("#") ? props.hash : `#${props.hash}`;
  setTimeout(() => {
    document.querySelector(hash)?.scrollIntoView();
  }, 200);
}
</script>

<template>
  <UTabs
    v-model="model"
    color="primary"
    :variant="variant"
    :orientation="orientation"
    :items="items"
    :default-value="defaultValue"
    :class="props.class"
    :unmount-on-hide="false"
    :ui="ui"
    @update:model-value="onUpdateModelValue"
  >
    <template #content="{ item }">
      <component :is="item.component" />
    </template>
  </UTabs>
</template>
