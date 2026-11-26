<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  MtActionMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
  MtApp,
  MtAvatar,
  MtButton,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtIcon,
  MtPage,
  MtText,
  MtTextEditor,
  useSnackbar,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

// The shell as a full-screen route shows it. In your application, keep the shell with its
// navigation in the root component and hide its regions in the meta of the route.
const breadcrumb: BreadcrumbItem[] = [
  { label: "Documents", to: "/documents", icon: "file-text" },
  { label: "Spring campaign brief" },
];

// Sample content. Replace it with the document your page loads.
const content = ref(
  [
    "<h2>Spring campaign brief</h2>",
    "<p>The spring campaign brings our outdoor range to new customers in March and April. It runs in the storefront, the newsletter and on social media.</p>",
    "<h2>Goals</h2>",
    "<ul><li><p>Grow the revenue of the outdoor category by 20 percent.</p></li><li><p>Win 5,000 new newsletter subscribers.</p></li><li><p>Sell out the winter collection before April.</p></li></ul>",
    "<h2>Timeline</h2>",
    "<p>The landing page goes live on <strong>March 2</strong>, the first newsletter follows on <strong>March 5</strong>.</p>",
  ].join(""),
);

const collaborators = ["Anna Schmidt", "Jonas Becker", "Lea Hoffmann"];

const savedAt = ref("Saved");
let saveTimeout: ReturnType<typeof setTimeout> | undefined;

// Replace the timeout with the request that saves the document.
watch(content, () => {
  savedAt.value = "Saving...";
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    savedAt.value = "Saved";
  }, 800);
});

const { addSnackbar } = useSnackbar();

function run(action: string) {
  addSnackbar({ message: action });
}

const menus = computed(() => [
  {
    label: "File",
    groups: [
      [
        { label: "New document", icon: "plus" },
        { label: "Make a copy", icon: "duplicate" },
      ],
      [
        { label: "Download as PDF", icon: "download" },
        { label: "Print", icon: "printer" },
      ],
    ],
  },
  {
    label: "Edit",
    groups: [
      [
        { label: "Undo", icon: "undo" },
        { label: "Redo", icon: "redo" },
      ],
      [{ label: "Find and replace", icon: "search" }],
    ],
  },
  {
    label: "View",
    groups: [
      [
        { label: "Show outline", icon: "list" },
        { label: "Version history", icon: "history" },
      ],
    ],
  },
]);
</script>

<template>
  <mt-app>
    <mt-page :breadcrumb="breadcrumb" closable>
      <template #actions>
        <mt-text size="xs" color="color-text-secondary-default" as="span" aria-live="polite">
          {{ savedAt }}
        </mt-text>

        <mt-button variant="primary" size="default" @click="run('Sharing settings would open')">
          <template #iconFront>
            <mt-icon name="regular-share" size="var(--scale-size-16)" decorative />
          </template>
          Share
        </mt-button>
      </template>

      <div class="document">
        <div class="menus">
          <mt-dropdown-menu-root v-for="menu in menus" :key="menu.label">
            <mt-dropdown-menu-trigger as-child>
              <mt-button variant="tertiary" size="small">{{ menu.label }}</mt-button>
            </mt-dropdown-menu-trigger>

            <mt-dropdown-menu-portal>
              <mt-action-menu>
                <mt-action-menu-group v-for="(group, index) in menu.groups" :key="index">
                  <mt-action-menu-item
                    v-for="item in group"
                    :key="item.label"
                    :icon="item.icon"
                    @select="run(item.label)"
                  >
                    {{ item.label }}
                  </mt-action-menu-item>
                </mt-action-menu-group>
              </mt-action-menu>
            </mt-dropdown-menu-portal>
          </mt-dropdown-menu-root>

          <missing-feature title="Menu bar" inline>
            The menus are separate dropdowns. A menu bar that moves between them with the arrow
            keys is missing.
          </missing-feature>

            <missing-feature title="Avatar group" inline class="menus__people">
              Avatar shows one person. A stack of the people editing the document is missing.

              <template #stand-in>
                <span class="collaborators" aria-label="Editing now">
                  <mt-avatar
                    v-for="name in collaborators"
                    :key="name"
                    :first-name="name.split(' ')[0]"
                    :last-name="name.split(' ')[1]"
                    size="xs"
                  />
                </span>
              </template>
            </missing-feature>
        </div>

        <missing-feature title="Document toolbar" kind="prop">
          Text Editor keeps its toolbar inside its frame and has a fixed height. With inline edit, as
          here, it grows with the text but shows its toolbar only on a selection. A toolbar fixed
          below the page header is missing.
        </missing-feature>

        <mt-text-editor v-model="content" is-inline-edit class="document__editor" />
      </div>
    </mt-page>
  </mt-app>
</template>

<style scoped>
.collaborators {
  display: flex;
}

.collaborators > :not(:first-child) {
  margin-inline-start: calc(var(--scale-size-4) * -1);
}

.document {
  display: grid;
  gap: var(--scale-size-16);
  width: min(100%, 48rem);
  margin-inline: auto;
}

.menus {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--scale-size-4);
}

.menus__people {
  margin-inline-start: auto;
}

.document__editor {
  min-height: 24rem;
}
</style>
