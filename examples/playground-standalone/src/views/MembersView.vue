<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  MtActionMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
  MtBadge,
  MtButton,
  MtContentHeader,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtEmptyState,
  MtIcon,
  MtModal,
  MtModalAction,
  MtModalClose,
  MtModalRoot,
  MtPage,
  MtSearch,
  MtSelect,
  MtText,
  MtTextField,
  MtUser,
  useSnackbar,
} from "@shopware-ag/meteor-component-library";
import { useRelativeTime } from "../composables/useRelativeTime";
import {
  invites as allInvites,
  members as allMembers,
  roleIcons,
  roles,
  type Invite,
  type Member,
  type Role,
} from "../data/members";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const relativeTime = useRelativeTime();
const { addSnackbar } = useSnackbar();

// Placeholder: changes only last until the page reloads.
const members = ref<Member[]>(structuredClone(allMembers));
const invites = ref<Invite[]>(structuredClone(allInvites));

const query = ref("");
const roleFilter = ref<Role | "all">("all");

watch(
  () => route.query.q,
  (q) => {
    if (typeof q === "string") query.value = q;
  },
  { immediate: true },
);

const roleOptions = computed(() => [
  { label: t("members.allRoles"), value: "all" },
  ...roles.map((role) => ({ label: t(`members.roles.${role}`), value: role })),
]);

function matches(texts: string[], role: Role) {
  const term = query.value.trim().toLowerCase();
  return (
    (roleFilter.value === "all" || role === roleFilter.value) &&
    (!term || texts.some((text) => text.toLowerCase().includes(term)))
  );
}

const visibleMembers = computed(() =>
  members.value.filter((member) =>
    matches([member.name, member.email], member.role),
  ),
);
const visibleInvites = computed(() =>
  invites.value.filter((invite) => matches([invite.email], invite.role)),
);

function clearFilters() {
  query.value = "";
  roleFilter.value = "all";
}

function resendInvite(invite: Invite) {
  addSnackbar({
    message: t("members.resent", { email: invite.email }),
    variant: "success",
  });
}

function revokeInvite(invite: Invite) {
  invites.value = invites.value.filter((item) => item.id !== invite.id);
  addSnackbar({
    message: t("members.revoked", { email: invite.email }),
    variant: "success",
  });
}

function changeRole(member: Member, role: Role) {
  member.role = role;
  addSnackbar({
    message: t("members.roleChanged", {
      name: member.name,
      role: t(`members.roles.${role}`),
    }),
    variant: "success",
  });
}

function removeMember(member: Member) {
  members.value = members.value.filter((item) => item.id !== member.id);
  addSnackbar({
    message: t("members.removed", { name: member.name }),
    variant: "success",
  });
}

const isInviteOpen = ref(false);
const inviteEmail = ref("");
const inviteRole = ref<Role>("builder");

function openInvite() {
  inviteEmail.value = "";
  inviteRole.value = "builder";
  isInviteOpen.value = true;
}

// The team switcher's "Invite members" and the command palette open the modal through the URL.
watch(
  () => route.query.invite,
  (invite) => {
    if (invite) openInvite();
  },
  { immediate: true },
);

function onInviteChange(open: boolean) {
  isInviteOpen.value = open;
  if (!open && route.query.invite) {
    router.replace({ query: { ...route.query, invite: undefined } });
  }
}

function sendInvite() {
  const email = inviteEmail.value.trim();
  invites.value = [
    ...invites.value,
    {
      id: `invite-${Date.now()}`,
      email,
      role: inviteRole.value,
      invitedBy: "Jane Doe",
      expiresInMinutes: 7 * 24 * 60,
    },
  ];
  onInviteChange(false);
  addSnackbar({
    message: t("members.modal.sent", { email }),
    variant: "success",
  });
}

const breadcrumb = computed(() => [
  { label: t("members.title"), icon: "users" },
]);
</script>

<template>
  <mt-page width="l" :breadcrumb="breadcrumb">
    <div class="members-view">
      <mt-content-header :title="t('members.title')">
        <template #actions>
          <mt-button variant="primary" size="default" @click="openInvite">
            {{ t("members.invite") }}
          </mt-button>
        </template>

        <mt-text color="color-text-secondary-default">
          {{ t("members.description") }}
        </mt-text>
      </mt-content-header>

      <div class="members-view__toolbar">
        <mt-search
          v-model="query"
          class="members-view__search"
          :placeholder="t('members.search')"
        />
        <mt-select
          v-model="roleFilter"
          class="members-view__role"
          :options="roleOptions"
          :aria-label="t('members.columns.role')"
          hide-clearable-button
        />
      </div>

      <section
        v-if="visibleInvites.length"
        class="members-view__section"
        aria-labelledby="members-pending"
      >
        <mt-text id="members-pending" as="h2" size="s" weight="semibold">
          {{ t("members.pending") }}
          <span class="members-view__count">({{ visibleInvites.length }})</span>
        </mt-text>

        <div class="members-view__table">
          <table>
            <caption class="visually-hidden">
              {{
                t("members.pending")
              }}
            </caption>
            <thead>
              <tr>
                <th scope="col">{{ t("members.columns.email") }}</th>
                <th scope="col">{{ t("members.columns.role") }}</th>
                <th scope="col">{{ t("members.columns.status") }}</th>
                <th scope="col">{{ t("members.columns.expires") }}</th>
                <th scope="col">
                  <span class="visually-hidden">{{
                    t("members.rowActions")
                  }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="invite in visibleInvites" :key="invite.id">
                <td>
                  <span class="members-view__invite">
                    <mt-text size="xs">{{ invite.email }}</mt-text>
                    <mt-text size="2xs" color="color-text-secondary-default">
                      {{ t("members.invitedBy", { name: invite.invitedBy }) }}
                    </mt-text>
                  </span>
                </td>
                <td>
                  <span class="members-view__meta">
                    <mt-icon
                      :name="roleIcons[invite.role]"
                      size="var(--scale-size-12)"
                      decorative
                    />
                    {{ t(`members.roles.${invite.role}`) }}
                  </span>
                </td>
                <td>
                  <mt-badge variant="info" status-indicator>
                    {{ t("members.invited") }}
                  </mt-badge>
                </td>
                <td>
                  <mt-text size="xs" color="color-text-secondary-default">
                    {{ relativeTime(invite.expiresInMinutes) }}
                  </mt-text>
                </td>
                <td class="members-view__row-actions">
                  <mt-dropdown-menu-root>
                    <mt-dropdown-menu-trigger as-child>
                      <mt-button
                        variant="tertiary"
                        size="small"
                        square
                        :aria-label="
                          t('members.actions', { name: invite.email })
                        "
                      >
                        <mt-icon
                          name="regular-ellipsis-h"
                          size="var(--scale-size-16)"
                          decorative
                        />
                      </mt-button>
                    </mt-dropdown-menu-trigger>

                    <mt-dropdown-menu-portal>
                      <mt-action-menu
                        side="bottom"
                        align="end"
                        :side-offset="4"
                      >
                        <mt-action-menu-group>
                          <mt-action-menu-item
                            icon="regular-paper-plane"
                            @select="resendInvite(invite)"
                          >
                            {{ t("members.resend") }}
                          </mt-action-menu-item>
                        </mt-action-menu-group>
                        <mt-action-menu-group>
                          <mt-action-menu-item
                            icon="regular-times-circle"
                            variant="critical"
                            @select="revokeInvite(invite)"
                          >
                            {{ t("members.revoke") }}
                          </mt-action-menu-item>
                        </mt-action-menu-group>
                      </mt-action-menu>
                    </mt-dropdown-menu-portal>
                  </mt-dropdown-menu-root>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section
        v-if="visibleMembers.length"
        class="members-view__section"
        aria-labelledby="members-list"
      >
        <mt-text id="members-list" as="h2" size="s" weight="semibold">
          {{ t("members.list") }}
          <span class="members-view__count">({{ visibleMembers.length }})</span>
        </mt-text>

        <ul class="members-view__grid">
          <li
            v-for="member in visibleMembers"
            :key="member.id"
            class="members-view__card"
          >
            <div class="members-view__card-header">
              <mt-user :name="member.name" :subtitle="member.email" />

              <!-- The current user can't change or remove themselves, so they get a label instead. -->
              <mt-badge v-if="member.isCurrentUser" variant="neutral">
                {{ t("members.you") }}
              </mt-badge>

              <mt-dropdown-menu-root v-else>
                <mt-dropdown-menu-trigger as-child>
                  <mt-button
                    variant="tertiary"
                    size="small"
                    square
                    :aria-label="t('members.actions', { name: member.name })"
                  >
                    <mt-icon
                      name="regular-ellipsis-h"
                      size="var(--scale-size-16)"
                      decorative
                    />
                  </mt-button>
                </mt-dropdown-menu-trigger>

                <mt-dropdown-menu-portal>
                  <mt-action-menu side="bottom" align="end" :side-offset="4">
                    <mt-action-menu-group>
                      <mt-action-menu-item
                        v-for="role in roles.filter(
                          (role) => role !== member.role,
                        )"
                        :key="role"
                        :icon="roleIcons[role]"
                        @select="changeRole(member, role)"
                      >
                        {{
                          t("members.changeRole", {
                            role: t(`members.roles.${role}`),
                          })
                        }}
                      </mt-action-menu-item>
                    </mt-action-menu-group>
                    <mt-action-menu-group>
                      <mt-action-menu-item
                        icon="regular-trash"
                        variant="critical"
                        @select="removeMember(member)"
                      >
                        {{ t("members.remove") }}
                      </mt-action-menu-item>
                    </mt-action-menu-group>
                  </mt-action-menu>
                </mt-dropdown-menu-portal>
              </mt-dropdown-menu-root>
            </div>

            <div class="members-view__card-meta">
              <span class="members-view__meta">
                <mt-icon
                  :name="roleIcons[member.role]"
                  size="var(--scale-size-12)"
                  decorative
                />
                {{ t(`members.roles.${member.role}`) }}
              </span>
              <span class="members-view__meta">
                <mt-icon
                  name="regular-clock"
                  size="var(--scale-size-12)"
                  decorative
                />
                {{
                  t("members.joined", {
                    time: relativeTime(-member.joinedMinutesAgo),
                  })
                }}
              </span>
            </div>
          </li>
        </ul>
      </section>

      <mt-empty-state
        v-if="!visibleMembers.length && !visibleInvites.length"
        icon="regular-users"
        :headline="t('members.empty.headline')"
        :description="t('members.empty.description')"
      >
        <template #button>
          <mt-button variant="secondary" size="default" @click="clearFilters">
            {{ t("members.empty.clear") }}
          </mt-button>
        </template>
      </mt-empty-state>
    </div>

    <mt-modal-root :is-open="isInviteOpen" @change="onInviteChange">
      <mt-modal :title="t('members.modal.title')" width="s">
        <div class="members-view__form">
          <mt-text-field
            v-model="inviteEmail"
            type="email"
            :label="t('members.modal.email')"
            placeholder="name@example.com"
          />
          <mt-select
            v-model="inviteRole"
            :label="t('members.modal.role')"
            :options="
              roles.map((role) => ({
                label: t(`members.roles.${role}`),
                value: role,
              }))
            "
            hide-clearable-button
          />
        </div>

        <template #footer>
          <div class="members-view__actions">
            <mt-modal-close :as="MtButton" variant="secondary" size="default">
              {{ t("members.modal.cancel") }}
            </mt-modal-close>
            <mt-modal-action
              :as="MtButton"
              variant="primary"
              size="default"
              :disabled="!inviteEmail.includes('@')"
              @click="sendInvite"
            >
              {{ t("members.modal.send") }}
            </mt-modal-action>
          </div>
        </template>
      </mt-modal>
    </mt-modal-root>
  </mt-page>
</template>

<style scoped>
.members-view {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-24);
}

.members-view__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--scale-size-12);
}

.members-view__search {
  flex: 1 1 var(--scale-size-256);
  max-width: 22rem;
}

.members-view__role {
  flex: 0 1 var(--scale-size-192);
}

.members-view__section {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-12);
}

.members-view__count {
  color: var(--color-text-secondary-default);
  font-weight: var(--font-weight-regular);
}

.members-view__invite {
  display: flex;
  flex-direction: column;
}

/* A short list, so a plain table in the look of mt-data-table rather than the full data table
   with its search, settings and pagination. */
.members-view__table {
  /* Contains the visually hidden labels, which would otherwise widen the page. */
  position: relative;
  overflow-x: auto;
  border: var(--scale-size-1) solid var(--color-border-primary-default);
  border-radius: var(--border-radius-card);
}

.members-view__table table {
  width: 100%;
  border-collapse: collapse;
}

.members-view__table th {
  padding: var(--scale-size-8) var(--scale-size-16);
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-medium);
  text-align: start;
  white-space: nowrap;
  background: var(--color-background-secondary-default);
  border-bottom: var(--scale-size-1) solid var(--color-border-primary-default);
}

.members-view__table td {
  padding: var(--scale-size-10) var(--scale-size-16);
  vertical-align: middle;
  background: var(--color-elevation-surface-raised);
}

.members-view__table tr + tr td {
  border-top: var(--scale-size-1) solid var(--color-border-secondary-default);
}

.members-view__table th:first-child,
.members-view__table td:first-child {
  width: 100%;
}

.members-view__table td:not(:first-child) {
  white-space: nowrap;
}

.members-view__row-actions {
  text-align: end;
}

.members-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: var(--scale-size-16);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* The card surface of mt-card, smaller: a list of many, not a section of a page. */
.members-view__card {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-12);
  padding: var(--scale-size-16);
  background: var(--color-elevation-surface-raised);
  border: var(--scale-size-1) solid var(--color-border-primary-default);
  border-radius: var(--border-radius-card);
}

.members-view__card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--scale-size-8);
  min-width: 0;
}

.members-view__card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--scale-size-16);
}

.members-view__meta {
  display: inline-flex;
  align-items: center;
  gap: var(--scale-size-6);
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-2xs);
}

.members-view__form {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
}

.members-view__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--scale-size-8);
}
</style>
