<script setup lang="ts">
import {
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtDropdownMenuPortal,
  MtDropdownMenuSub,
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
        <mt-action-menu-item icon="file-text">Documentation</mt-action-menu-item>

        <mt-dropdown-menu-sub>
          <mt-action-menu-item is-sub-trigger icon="arrows">
            Move
          </mt-action-menu-item>

          <mt-dropdown-menu-portal>
            <mt-action-menu is-sub-menu>
              <mt-action-menu-item icon="up-circle">Up</mt-action-menu-item>
              <mt-action-menu-item icon="down-circle">Down</mt-action-menu-item>
              <mt-action-menu-item icon="left-circle">Left</mt-action-menu-item>
              <mt-action-menu-item icon="right-circle">Right</mt-action-menu-item>
            </mt-action-menu>
          </mt-dropdown-menu-portal>
        </mt-dropdown-menu-sub>

        <mt-action-menu-item icon="cog">Settings</mt-action-menu-item>
      </mt-action-menu>
    </mt-dropdown-menu-portal>
  </mt-dropdown-menu-root>
</template>
