<script setup lang="ts">
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtUserMenu,
} from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div style="width: 300px">
    <mt-user-menu
      first-name="Max"
      last-name="Mustermann"
      subtitle="Administrator"
    >
      <mt-action-menu-group>
        <mt-action-menu-item icon="regular-user">
          Your profile
        </mt-action-menu-item>
        <mt-action-menu-item icon="regular-cog">
          Settings
        </mt-action-menu-item>
      </mt-action-menu-group>

      <mt-action-menu-group>
        <mt-action-menu-item icon="regular-sign-out" variant="critical">
          Log out
        </mt-action-menu-item>
      </mt-action-menu-group>
    </mt-user-menu>
  </div>
</template>
