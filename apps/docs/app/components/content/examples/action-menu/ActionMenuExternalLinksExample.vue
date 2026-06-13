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
        <mt-action-menu-item icon="file-text" link="https://docs.example.com">
          Documentation
        </mt-action-menu-item>
        <mt-action-menu-item icon="question-circle" link="https://support.example.com">
          Help Center
        </mt-action-menu-item>
        <mt-action-menu-item link="https://example.com">
          External link without icon
        </mt-action-menu-item>
      </mt-action-menu>
    </mt-dropdown-menu-portal>
  </mt-dropdown-menu-root>
</template>
