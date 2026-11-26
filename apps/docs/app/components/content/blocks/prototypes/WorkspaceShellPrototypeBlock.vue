<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtApp,
  MtAppPanelTrigger,
  MtBrand,
  MtButton,
  MtIcon,
  MtNav,
  MtPage,
  MtPanel,
  MtSearch,
  MtTabs,
  MtTooltip,
  type BreadcrumbItem,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

// The tools of the rail. Each opens its own view in the panel next to it.
const tools = [
  { name: "explorer", label: "Explorer", icon: "regular-files" },
  { name: "search", label: "Search", icon: "regular-search" },
  { name: "changes", label: "Changes", icon: "regular-history" },
  { name: "extensions", label: "Extensions", icon: "regular-plug" },
];
const tool = ref("explorer");

// Sample data. Replace it with the files of the workspace.
const files: NavSection[] = [
  {
    header: "Storefront theme",
    items: [
      {
        label: "src",
        icon: "regular-folder",
        children: [
          {
            label: "components",
            children: [
              { id: "header", label: "Header.vue", to: "/files/src/components/Header.vue" },
              { id: "footer", label: "Footer.vue", to: "/files/src/components/Footer.vue" },
              { id: "card", label: "ProductCard.vue", to: "/files/src/components/ProductCard.vue" },
            ],
          },
          {
            label: "styles",
            children: [{ id: "base", label: "base.css", to: "/files/src/styles/base.css" }],
          },
        ],
      },
      { id: "readme", label: "README.md", icon: "regular-file-text", to: "/files/README.md" },
      { id: "package", label: "package.json", icon: "regular-file", to: "/files/package.json" },
    ],
  },
];

const openFiles = ref([
  { name: "header", label: "Header.vue" },
  { name: "card", label: "ProductCard.vue" },
]);
const activeFile = ref("header");

function labelOf(id: string) {
  const find = (items: NavItem[]): string | undefined =>
    items
      .map((item) =>
        item.id === id ? item.label : "children" in item ? find(item.children ?? []) : undefined,
      )
      .find(Boolean);

  return find(files[0].items) ?? id;
}

// With Vue Router, each file is a route: compare the item with the current route instead.
function isActive(item: NavItem) {
  return item.id === activeFile.value;
}

function open(item: NavItem) {
  if (!item.id) return;
  if (!openFiles.value.some(({ name }) => name === item.id)) {
    openFiles.value.push({ name: item.id, label: item.label });
  }
  activeFile.value = item.id;
}

const breadcrumb = computed<BreadcrumbItem[]>(() => [
  { label: "Storefront theme", icon: "folder" },
  { label: labelOf(activeFile.value) },
]);

const term = ref("");
</script>

<template>
  <mt-app :breakpoint="960">
    <template #header>
      <div class="header">
        <mt-app-panel-trigger panel="navigation" />
        <mt-brand title="Shopware" subtitle="Meteor" compact />

        <div class="header__search">
          <mt-search v-model="term" size="small" placeholder="Go to file or run a command" />
          <missing-feature title="Command palette" inline>
            No dialog that searches files and commands and runs them with the keyboard.
          </missing-feature>
        </div>

        <mt-app-panel-trigger panel="sidebar" />
      </div>
    </template>

    <template #navigation>
      <mt-panel label="Explorer" icon="regular-files" resizable :min-width="240" :max-width="400">
        <div class="workspace">
          <missing-feature title="Icon rail">
            App has one navigation region, so the rail and the view it switches share one panel. A
            rail that stays when the panel closes is missing.
          </missing-feature>

          <div class="workspace__columns">
            <div class="rail" role="toolbar" aria-label="Tools" aria-orientation="vertical">
              <mt-tooltip
                v-for="item in tools"
                :key="item.name"
                :content="item.label"
                placement="right"
              >
                <template #default="params">
                  <mt-button
                    v-bind="params"
                    :variant="tool === item.name ? 'secondary' : 'tertiary'"
                    size="default"
                    square
                    :aria-label="item.label"
                    :aria-pressed="tool === item.name"
                    @click="tool = item.name"
                  >
                    <template #iconFront>
                      <mt-icon :name="item.icon" size="var(--scale-size-16)" decorative />
                    </template>
                  </mt-button>
                </template>
              </mt-tooltip>
            </div>

            <aside class="explorer" aria-label="Explorer">
              <template v-if="tool === 'explorer'">
                <mt-nav :sections="files" label="Files" :is-active="isActive" @navigate="open" />
                <missing-feature title="Tree view" inline>
                  Nav nests three levels, opens one group at a time and shows icons only on the
                  first level. A file tree needs any depth.
                </missing-feature>
              </template>

              <placeholder-slot v-else :name="tools.find(({ name }) => name === tool)?.label" />
            </aside>
          </div>
        </div>
      </mt-panel>
    </template>

    <mt-page :breadcrumb="breadcrumb" inset>
      <div class="editor">
        <div class="editor__tabs">
          <mt-tabs :items="openFiles" :default-item="activeFile" @new-item-active="activeFile = $event" />
          <missing-feature title="Closable tabs" kind="prop" inline>
            Tabs can't be closed or reordered, as open files can.
          </missing-feature>
        </div>

        <placeholder-slot name="Code editor" class="editor__code" />

        <missing-feature title="Bottom panel and status bar" kind="slot">
          App has no region below the content for a resizable panel, such as a terminal, or for a
          status bar with the branch and the cursor position.
        </missing-feature>
      </div>
    </mt-page>

    <template #sidebar>
      <mt-panel label="Outline" icon="regular-list" closable resizable>
        <placeholder-slot name="Outline" inset />
      </mt-panel>
    </template>
  </mt-app>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  padding-block: var(--scale-size-8);
}

.header__search {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: var(--scale-size-8);
  min-width: 0;
}

.header__search > :first-child {
  width: min(100%, 28rem);
}

.workspace {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: var(--scale-size-8);
  height: 100%;
  padding: var(--scale-size-8);
}

.workspace__columns {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--scale-size-8);
  min-height: 0;
}

.rail {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-4);
  padding-inline-end: var(--scale-size-8);
  border-inline-end: 1px solid var(--color-border-secondary-default);
}

.explorer {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-8);
  align-content: start;
  overflow: auto;
}

.editor {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: var(--scale-size-8);
  height: 100%;
  padding: var(--scale-size-8);
}

.editor__tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-8);
}

.editor__code {
  min-height: 16rem;
}
</style>
