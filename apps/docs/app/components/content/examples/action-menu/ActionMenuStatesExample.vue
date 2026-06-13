<script setup lang="ts">
import {
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtDropdownMenuPortal,
} from "@shopware-ag/meteor-component-library";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtActionMenu from "@shopware-ag/meteor-component-library/MtActionMenu";
import MtActionMenuItem from "@shopware-ag/meteor-component-library/MtActionMenuItem";
import MtActionMenuGroup from "@shopware-ag/meteor-component-library/MtActionMenuGroup";
</script>

<template>
  <mt-dropdown-menu-root>
    <mt-dropdown-menu-trigger as-child>
      <mt-button>Open menu</mt-button>
    </mt-dropdown-menu-trigger>

    <mt-dropdown-menu-portal>
      <mt-action-menu>
        <mt-action-menu-group>
          <mt-action-menu-item icon="file-text">Documentation</mt-action-menu-item>
          <mt-action-menu-item disabled icon="copy">Copy</mt-action-menu-item>
          <mt-action-menu-item disabled>Rename</mt-action-menu-item>
        </mt-action-menu-group>

        <mt-action-menu-group>
          <mt-action-menu-item icon="trash" variant="critical">
            Delete
          </mt-action-menu-item>
          <mt-action-menu-item disabled variant="critical">
            Remove
          </mt-action-menu-item>
        </mt-action-menu-group>
      </mt-action-menu>
    </mt-dropdown-menu-portal>
  </mt-dropdown-menu-root>
</template>
