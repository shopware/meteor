<script setup lang="ts">
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import iconMeta from "@icon-kit/icons/meta.json";

interface IconMetaEntry {
  name: string;
  mode: "regular" | "solid";
  tags?: string[];
}

// meta.json has one entry per icon SVG (mode + name + tags).
const allIcons = (iconMeta as IconMetaEntry[])
  .map((icon) => ({
    fullName: `${icon.mode}-${icon.name}`,
    mode: icon.mode,
    name: icon.name,
    tags: icon.tags ?? [],
  }))
  .sort((a, b) => a.fullName.localeCompare(b.fullName));

const { copy } = useCopyToClipboard();
const itemsPerPage = 48;
const searchTerm = ref("");
const activeMode = ref("all");
const currentPage = ref(1);

const searchMatched = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  return allIcons.filter(
    (icon) =>
      !term ||
      icon.name.toLowerCase().includes(term) ||
      icon.fullName.toLowerCase().includes(term) ||
      icon.tags.some((tag) => tag.toLowerCase().includes(term)),
  );
});

const modeCounts = computed(() => {
  let regular = 0;
  let solid = 0;
  for (const icon of searchMatched.value) {
    if (icon.mode === "regular") regular++;
    else if (icon.mode === "solid") solid++;
  }
  return { regular, solid };
});

const modeTabs = computed(() => [
  { label: "All", value: "all" },
  { label: `Regular (${modeCounts.value.regular})`, value: "regular" },
  { label: `Solid (${modeCounts.value.solid})`, value: "solid" },
]);

const filteredIcons = computed(() =>
  searchMatched.value.filter(
    (icon) => activeMode.value === "all" || icon.mode === activeMode.value,
  ),
);

watch([searchTerm, activeMode], () => {
  currentPage.value = 1;
});

const visibleIcons = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredIcons.value.slice(start, start + itemsPerPage);
});

</script>

<template>
  <div class="flex flex-col gap-4">
    <UInput
      v-model="searchTerm"
      icon="i-lucide-search"
      size="lg"
      variant="outline"
      placeholder="Search icons by name..."
    />

    <UTabs
      v-model="activeMode"
      :items="modeTabs"
      :content="false"
      variant="link"
    />

    <div
      v-if="filteredIcons.length"
      class="grid grid-cols-[repeat(auto-fill,minmax(224px,1fr))] gap-3"
    >
      <button
        v-for="icon in visibleIcons"
        :key="icon.fullName"
        type="button"
        class="flex flex-col items-center gap-3 rounded-lg border border-muted bg-default p-4 text-center transition-colors hover:bg-[var(--color-interaction-secondary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
        :title="`Copy ${icon.fullName}`"
        @click="copy(icon.fullName)"
      >
        <MtIcon
          :name="icon.name"
          :mode="icon.mode"
          size="var(--scale-size-20)"
          color="var(--color-icon-primary-default)"
          decorative
        />
        <span class="text-xs break-words text-muted">{{ icon.fullName }}</span>
      </button>
    </div>

    <div v-else class="flex flex-col items-center gap-2 py-10 text-center">
      <UIcon name="i-lucide-search" class="size-6 text-muted" />
      <p class="font-medium text-default">No icons found</p>
      <p class="text-sm text-muted">
        Try a different search term or switch the icon mode.
      </p>
    </div>

    <div v-if="filteredIcons.length > itemsPerPage" class="flex justify-end">
      <UPagination
        v-model:page="currentPage"
        :items-per-page="itemsPerPage"
        :total="filteredIcons.length"
      />
    </div>
  </div>
</template>
