<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import MtTextField from "@shopware-ag/meteor-component-library/MtTextField";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import MtAvatar from "@shopware-ag/meteor-component-library/MtAvatar";
import MtActionMenu from "@shopware-ag/meteor-component-library/MtActionMenu";
import MtActionMenuItem from "@shopware-ag/meteor-component-library/MtActionMenuItem";
import MtActionMenuGroup from "@shopware-ag/meteor-component-library/MtActionMenuGroup";
import {
  MtDropdownMenuRoot,
  MtDropdownMenuPortal,
  MtDropdownMenuTrigger,
  useSnackbar,
} from "@shopware-ag/meteor-component-library";

const { addSnackbar } = useSnackbar();

const inviteEmail = ref("");
const shareUsers = [
  { firstName: "Mia", lastName: "Chen", email: "mia.chen@company.io" },
  { firstName: "Jonas", lastName: "Weber", email: "jonas.weber@company.io" },
  { firstName: "Adrian", lastName: "Silva", email: "adrian.silva@company.io" },
];
const muted = "color-text-secondary-default";
</script>

<template>
  <mt-card>
    <div class="stack">
      <!-- invite row -->
      <div class="flex items-center gap-2">
        <div class="flex-1">
          <mt-text-field
            v-model="inviteEmail"
            placeholder="Add via email or username..."
            size="small"
          />
        </div>
        <mt-button variant="primary" size="small">Invite</mt-button>
      </div>

      <!-- People with access -->
      <div class="stack-xs">
        <mt-text
          size="xs"
          weight="medium"
          color="var(--color-text-primary-default)"
          >People with edit access</mt-text
        >
        <div class="people-list">
          <div
            v-for="u in shareUsers"
            :key="u.lastName"
            class="flex items-center gap-3"
          >
            <mt-avatar
              :first-name="u.firstName"
              :last-name="u.lastName"
              variant="circle"
            />
            <div class="min-w-0 flex-1">
              <mt-text size="xs" weight="medium"
                >{{ u.firstName }} {{ u.lastName }}</mt-text
              >
              <mt-text size="xs" :color="muted">{{ u.email }}</mt-text>
            </div>
            <mt-dropdown-menu-root>
              <mt-dropdown-menu-trigger as-child>
                <mt-button
                  variant="tertiary"
                  square
                  size="small"
                  aria-label="Member options"
                >
                  <template #iconFront>
                    <mt-icon name="solid-ellipsis-h" size="14" />
                  </template>
                </mt-button>
              </mt-dropdown-menu-trigger>

              <mt-dropdown-menu-portal>
                <mt-action-menu>
                  <mt-action-menu-group>
                    <mt-action-menu-item
                      icon="copy"
                      @select="
                        addSnackbar({
                          message: 'Email copied',
                          variant: 'success',
                        })
                      "
                      >Copy email</mt-action-menu-item
                    >
                    <mt-action-menu-item
                      icon="paper-plane"
                      @select="
                        addSnackbar({
                          message: `Invitation sent to ${u.firstName}`,
                          variant: 'success',
                        })
                      "
                      >Resend invite</mt-action-menu-item
                    >
                  </mt-action-menu-group>

                  <mt-action-menu-group>
                    <mt-action-menu-item
                      icon="user-minus"
                      variant="critical"
                      @select="
                        addSnackbar({
                          message: `${u.firstName} ${u.lastName} removed`,
                          variant: 'error',
                        })
                      "
                    >
                      Remove access
                    </mt-action-menu-item>
                  </mt-action-menu-group>
                </mt-action-menu>
              </mt-dropdown-menu-portal>
            </mt-dropdown-menu-root>
          </div>
        </div>
      </div>

      <!-- General access -->
      <div class="stack-xs">
        <mt-text
          size="xs"
          weight="medium"
          color="var(--color-text-primary-default)"
          >General access</mt-text
        >
        <div class="flex items-center gap-3">
          <div class="footer-tile">
            <mt-icon
              name="solid-users"
              size="16"
              color="var(--color-icon-primary-default)"
            />
          </div>
          <div class="min-w-0 flex-1">
            <mt-text size="xs" weight="medium">Everyone at the company</mt-text>
            <mt-text size="xs" :color="muted">with a company email</mt-text>
          </div>
          <mt-dropdown-menu-root>
            <mt-dropdown-menu-trigger as-child>
              <mt-button
                variant="tertiary"
                square
                size="small"
                aria-label="Access options"
              >
                <template #iconFront>
                  <mt-icon name="solid-ellipsis-h" size="14" />
                </template>
              </mt-button>
            </mt-dropdown-menu-trigger>

            <mt-dropdown-menu-portal>
              <mt-action-menu>
                <mt-action-menu-group>
                  <mt-action-menu-item
                    icon="link"
                    @select="
                      addSnackbar({
                        message: 'Link copied',
                        variant: 'success',
                      })
                    "
                    >Copy link</mt-action-menu-item
                  >
                </mt-action-menu-group>

                <mt-action-menu-group>
                  <mt-action-menu-item
                    icon="shield"
                    @select="
                      addSnackbar({
                        message: 'Access set to private',
                        variant: 'success',
                      })
                    "
                    >Set as private</mt-action-menu-item
                  >
                </mt-action-menu-group>
              </mt-action-menu>
            </mt-dropdown-menu-portal>
          </mt-dropdown-menu-root>
        </div>
      </div>
    </div>
  </mt-card>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-24);
}
/* A section headline paired with its content: 12px between headline and body. */
.stack-xs {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-12);
}
/* Team member rows. */
.people-list {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-12);
}
/* Round 40×40 neutral surface circle for the general-access group. */
.footer-tile {
  display: grid;
  place-items: center;
  width: var(--scale-size-40);
  height: var(--scale-size-40);
  border-radius: var(--border-radius-round);
  background: var(--color-elevation-surface-hover);
  flex-shrink: 0;
}
</style>
