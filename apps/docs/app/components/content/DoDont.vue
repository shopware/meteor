<script setup lang="ts">
import { Fragment, h, resolveComponent, type VNode } from "vue";

defineProps<{
  /** Stack the cards instead of laying them side by side. Use when a card has
   * a lot of content. Cards are side by side by default. */
  vertical?: boolean;
}>();

const slots = defineSlots<{
  do?: () => VNode[];
  dont?: () => VNode[];
}>();

const cards = [
  { key: "do", label: "Do", icon: "i-lucide-check", pill: "bg-success" },
  { key: "dont", label: "Don't", icon: "i-lucide-x", pill: "bg-error" },
] as const;

const provided = computed(() => cards.filter((card) => slots[card.key]));

const ProseUl = resolveComponent("ProseUl");

function flatten(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) =>
    node.type === Fragment && Array.isArray(node.children)
      ? flatten(node.children as VNode[])
      : [node],
  );
}

/**
 * Renders a slot's content, wrapping loose <li> in a <ul>. MDC wraps the first
 * named slot's list in <ul> but emits the second slot's list as bare <li>
 * (a remark-mdc quirk), which is invalid markup; this restores the list. The
 * original tag survives on the (async) prose component as `type.tag`.
 */
const SlotContent = (props: { name: "do" | "dont" }) => {
  const nodes = slots[props.name]?.() ?? [];
  const elements = flatten(nodes).filter((node) => typeof node.type !== "symbol");
  const isLooseList =
    elements.length > 0 &&
    elements.every(
      (node) => (node.type as { tag?: string } | null)?.tag === "li",
    );

  return isLooseList ? h(ProseUl, () => nodes) : nodes;
};
</script>

<template>
  <div
    class="my-5 grid gap-4"
    :class="!vertical && provided.length > 1 ? 'sm:grid-cols-2' : undefined"
  >
    <div
      v-for="card in provided"
      :key="card.key"
      class="rounded-lg border border-muted bg-default p-4"
    >
      <span
        class="inline-flex items-center gap-0.5 rounded-full py-1 pr-2.5 pl-2 text-xs font-bold text-white"
        :class="card.pill"
      >
        <UIcon :name="card.icon" class="size-4" />
        {{ card.label }}
      </span>
      <div class="do-dont-content mt-3 text-sm text-default">
        <component :is="SlotContent" :name="card.key" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.do-dont-content :deep(> :first-child) {
  margin-top: 0;
}

.do-dont-content :deep(> :last-child) {
  margin-bottom: 0;
}

.do-dont-content :deep(ul) {
  margin: 0;
  padding-left: 1.25rem;
  list-style: disc;
}

.do-dont-content :deep(li) {
  margin: 0.25rem 0;
}
</style>
