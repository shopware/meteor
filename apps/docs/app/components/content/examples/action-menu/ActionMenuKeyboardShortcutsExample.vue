<script setup lang="ts">
import {
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtDropdownMenuPortal,
} from "@shopware-ag/meteor-component-library";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtActionMenu from "@shopware-ag/meteor-component-library/MtActionMenu";
import MtActionMenuItem from "@shopware-ag/meteor-component-library/MtActionMenuItem";
</script>

<template>
  <mt-dropdown-menu-root>
    <mt-dropdown-menu-trigger as-child>
      <mt-button>Open menu</mt-button>
    </mt-dropdown-menu-trigger>

    <mt-dropdown-menu-portal>
      <mt-action-menu>
        <mt-action-menu-item
          icon="solid-duplicate"
          :shortcut="{ modifiers: ['mod'], key: 'd' }"
        >
          Duplicate
        </mt-action-menu-item>
        <mt-action-menu-item
          icon="copy"
          :shortcut="{ modifiers: ['mod'], key: 'c' }"
        >
          Copy
        </mt-action-menu-item>
        <mt-action-menu-item
          icon="download"
          :shortcut="{ modifiers: ['shift'], key: 'd' }"
        >
          Download
        </mt-action-menu-item>
      </mt-action-menu>
    </mt-dropdown-menu-portal>
  </mt-dropdown-menu-root>
</template>
