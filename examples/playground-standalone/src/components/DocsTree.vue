<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  MtNav,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";
import { pageTree, type PageNode } from "../data/pages";

const { t } = useI18n();
const route = useRoute();

function toNavItem(node: PageNode): NavItem {
  if (node.children) {
    return {
      id: node.id,
      label: node.label,
      icon: "regular-folder",
      children: node.children.map(toNavItem),
    };
  }

  return {
    id: node.id,
    label: node.label,
    icon: "regular-file-text",
    to: `/pages/${node.id}`,
  };
}

const sections: NavSection[] = [{ items: pageTree.map(toNavItem) }];

function isActive(item: NavItem) {
  return item.to === route.path;
}
</script>

<template>
  <mt-nav
    class="docs-tree"
    :sections="sections"
    :is-active="isActive"
    :label="t('nav.docs')"
  />
</template>

<style scoped>
.docs-tree {
  flex: 1;
  min-height: 0;
}
</style>
