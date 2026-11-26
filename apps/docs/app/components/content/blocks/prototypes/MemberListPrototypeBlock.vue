<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtApp,
  MtButton,
  MtContentHeader,
  MtDataTable,
  MtIcon,
  MtModal,
  MtModalAction,
  MtModalClose,
  MtModalRoot,
  MtModalTrigger,
  MtPage,
  MtSelect,
  MtTabs,
  MtTextField,
  MtUser,
  useSnackbar,
  type BreadcrumbItem,
  type Filter,
} from "@shopware-ag/meteor-component-library";

type Role = "Admin" | "Member" | "Viewer";

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  twoFactor: boolean;
  status: "active" | "pending";
  joined: string;
}

// Sample data. Replace it with the members your page loads.
const members = ref<Member[]>([
  { id: "1", name: "Max Mustermann", email: "max.mustermann@example.com", role: "Admin", twoFactor: true, status: "active", joined: "2023-03-14" },
  { id: "2", name: "Anna Schmidt", email: "anna.schmidt@example.com", role: "Admin", twoFactor: true, status: "active", joined: "2023-06-02" },
  { id: "3", name: "Jonas Becker", email: "jonas.becker@example.com", role: "Member", twoFactor: false, status: "active", joined: "2024-01-22" },
  { id: "4", name: "Lea Hoffmann", email: "lea.hoffmann@example.com", role: "Member", twoFactor: true, status: "active", joined: "2024-04-09" },
  { id: "5", name: "Paul Wagner", email: "paul.wagner@example.com", role: "Viewer", twoFactor: false, status: "active", joined: "2024-07-30" },
  { id: "6", name: "Mia Schulz", email: "mia.schulz@example.com", role: "Member", twoFactor: true, status: "active", joined: "2024-09-12" },
  { id: "7", name: "Felix Koch", email: "felix.koch@example.com", role: "Viewer", twoFactor: true, status: "active", joined: "2025-01-05" },
  { id: "8", name: "Emma Richter", email: "emma.richter@example.com", role: "Member", twoFactor: false, status: "active", joined: "2025-02-17" },
  { id: "9", name: "Leon Klein", email: "leon.klein@example.com", role: "Member", twoFactor: true, status: "active", joined: "2025-03-28" },
  { id: "10", name: "Hannah Wolf", email: "hannah.wolf@example.com", role: "Viewer", twoFactor: false, status: "active", joined: "2025-05-11" },
  { id: "11", name: "Noah Neumann", email: "noah.neumann@example.com", role: "Member", twoFactor: true, status: "active", joined: "2025-06-20" },
  { id: "12", name: "Sophie Braun", email: "sophie.braun@example.com", role: "Admin", twoFactor: true, status: "active", joined: "2025-08-03" },
  { id: "13", name: "Luis Zimmermann", email: "luis.zimmermann@example.com", role: "Member", twoFactor: false, status: "active", joined: "2025-09-15" },
  { id: "14", name: "Lina Krüger", email: "lina.krueger@example.com", role: "Viewer", twoFactor: true, status: "pending", joined: "2026-11-18" },
  { id: "15", name: "Ben Hartmann", email: "ben.hartmann@example.com", role: "Member", twoFactor: false, status: "pending", joined: "2026-11-21" },
]);

const breadcrumb: BreadcrumbItem[] = [
  { label: "Settings", to: "/settings", icon: "cog" },
  { label: "Members" },
];

const tab = ref<"active" | "pending">("active");

// Without a slot for counters, the counts are part of the labels.
const tabs = computed(() => [
  { name: "active", label: `Members (${countOf("active")})` },
  { name: "pending", label: `Pending invitations (${countOf("pending")})` },
]);

function countOf(status: Member["status"]) {
  return members.value.filter((member) => member.status === status).length;
}

const columns = [
  { label: "Name", property: "name", renderer: "text" as const, position: 0, sortable: true },
  {
    label: "Role",
    property: "role",
    renderer: "badge" as const,
    position: 100,
    sortable: true,
    rendererOptions: {
      renderItemBadge: (data: Member) => ({
        label: data.role,
        variant: data.role === "Admin" ? ("info" as const) : ("default" as const),
      }),
    },
  },
  {
    label: "Security",
    property: "twoFactor",
    renderer: "badge" as const,
    position: 200,
    rendererOptions: {
      renderItemBadge: (data: Member) =>
        data.twoFactor
          ? { label: "2FA on", variant: "positive" as const }
          : { label: "2FA off", variant: "critical" as const },
    },
  },
  { label: "Joined", property: "joined", renderer: "text" as const, position: 300, sortable: true },
];

const filters: Filter[] = [
  {
    id: "role",
    label: "Role",
    type: {
      id: "options",
      options: [
        { id: "Admin", label: "Admin" },
        { id: "Member", label: "Member" },
        { id: "Viewer", label: "Viewer" },
      ],
    },
  },
  {
    id: "twoFactor",
    label: "Two-factor authentication",
    type: {
      id: "options",
      options: [
        { id: "true", label: "On" },
        { id: "false", label: "Off" },
      ],
    },
  },
];

const term = ref("");
const appliedFilters = ref<Filter[]>([]);
const sortBy = ref("name");
const sortDirection = ref<"ASC" | "DESC">("ASC");
const currentPage = ref(1);
const limit = ref(10);
const selectedRows = ref<string[]>([]);

// The table only shows what it gets, so the page searches, filters, sorts and pages itself.
const matches = computed(() =>
  members.value
    .filter((member) => member.status === tab.value)
    .filter((member) =>
      `${member.name} ${member.email}`.toLowerCase().includes(term.value.trim().toLowerCase()),
    )
    .filter((member) =>
      appliedFilters.value.every((filter) =>
        filter.type.options.some(
          (option) => option.id === String(member[filter.id as keyof Member]),
        ),
      ),
    )
    .sort((a, b) => {
      const key = sortBy.value as keyof Member;
      const order = String(a[key]).localeCompare(String(b[key]));
      return sortDirection.value === "ASC" ? order : -order;
    }),
);

const rows = computed(() =>
  matches.value.slice((currentPage.value - 1) * limit.value, currentPage.value * limit.value),
);

function resetPaging() {
  currentPage.value = 1;
  selectedRows.value = [];
}

function onTabChange(name: string) {
  tab.value = name as "active" | "pending";
  resetPaging();
}

function onSearch(value: string) {
  term.value = value;
  resetPaging();
}

function onFilter(value: Filter[]) {
  appliedFilters.value = value;
  resetPaging();
}

function onSort(property: string, direction: "ASC" | "DESC") {
  sortBy.value = property;
  sortDirection.value = direction;
}

function onLimit(value: number) {
  limit.value = value;
  resetPaging();
}

function onSelect({ id, value }: { id: string; value: boolean }) {
  selectedRows.value = value
    ? [...selectedRows.value, id]
    : selectedRows.value.filter((selected) => selected !== id);
}

function onSelectMany({ selections, value }: { selections: string[]; value: boolean }) {
  selectedRows.value = value
    ? [...new Set([...selectedRows.value, ...selections])]
    : selectedRows.value.filter((selected) => !selections.includes(selected));
}

const { addSnackbar } = useSnackbar();

function remove(ids: string[]) {
  members.value = members.value.filter((member) => !ids.includes(member.id));
  selectedRows.value = selectedRows.value.filter((id) => !ids.includes(id));
  addSnackbar({ message: ids.length === 1 ? "Member removed" : `${ids.length} members removed` });
}

function onContext({ key, data }: { key: string; data: Member }) {
  if (key === "two-factor") addSnackbar({ message: `Reminder sent to ${data.name}` });
}

// Replace it with the request that sends the invitation.
const inviteEmail = ref("");
const inviteRole = ref<Role>("Member");
const roleOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Member", label: "Member" },
  { value: "Viewer", label: "Viewer" },
];

function invite() {
  members.value.push({
    id: String(Date.now()),
    name: inviteEmail.value.split("@")[0] ?? inviteEmail.value,
    email: inviteEmail.value,
    role: inviteRole.value,
    twoFactor: false,
    status: "pending",
    joined: new Date().toISOString().slice(0, 10),
  });
  addSnackbar({ message: `Invitation sent to ${inviteEmail.value}` });
  inviteEmail.value = "";
}
</script>

<template>
  <mt-app>
    <template #navigation>
      <placeholder-slot name="App: navigation" style="width: 280px" />
    </template>

    <!-- The page: copy it into a route of your application, without the shell around it. -->
    <mt-page width="l" :breadcrumb="breadcrumb">
      <div class="stack">
        <mt-content-header title="Members">
          <template #actions>
            <mt-modal-root>
              <mt-modal-trigger :as="MtButton" variant="primary" size="default">
                <template #iconFront>
                  <mt-icon name="regular-user-plus" size="var(--scale-size-16)" decorative />
                </template>
                Invite
              </mt-modal-trigger>

              <mt-modal title="Invite a member" width="s">
                  <div class="stack">
                    <mt-text-field
                      v-model="inviteEmail"
                      label="Email address"
                      placeholder="name@example.com"
                    />
                    <mt-select
                      v-model="inviteRole"
                      label="Role"
                      :options="roleOptions"
                      :enable-search="false"
                      hide-clearable-button
                    />
                  </div>

                  <template #footer>
                    <div class="actions">
                      <mt-modal-close :as="MtButton" variant="secondary" size="default">
                        Cancel
                      </mt-modal-close>
                      <mt-modal-action
                        :as="MtButton"
                        variant="primary"
                        size="default"
                        :disabled="!inviteEmail.includes('@')"
                        @click="(close: () => void) => { invite(); close(); }"
                      >
                        Send invitation
                      </mt-modal-action>
                    </div>
                  </template>
              </mt-modal>
            </mt-modal-root>
          </template>
        </mt-content-header>

        <div class="tab-row">
          <!-- Tabs move all items into "More" when their labels change, so they render anew. -->
          <mt-tabs
            :key="tabs.map(({ label }) => label).join()"
            :items="tabs"
            :default-item="tab"
            @new-item-active="onTabChange"
          />
          <missing-feature title="Tab counter" kind="slot" inline>
            Tabs have no slot or prop for a counter, so the counts are part of the labels.
          </missing-feature>
        </div>

        <missing-feature title="Tabs in the table" kind="slot">
          Data Table brings its own card. It has no slot above the toolbar for tabs, and its search,
          filter and pagination footer always show.
        </missing-feature>

        <mt-data-table
          layout="full"
          caption="Members"
          :data-source="rows"
          :columns="columns"
          :current-page="currentPage"
          :pagination-limit="limit"
          :pagination-total-items="matches.length"
          :search-value="term"
          :sort-by="sortBy"
          :sort-direction="sortDirection"
          :filters="filters"
          :applied-filters="appliedFilters"
          :number-of-results="matches.length"
          allow-row-selection
          allow-bulk-delete
          :selected-rows="selectedRows"
          :additional-context-buttons="[{ key: 'two-factor', label: 'Remind to turn on 2FA' }]"
          disable-edit
          disable-settings-table
          @pagination-current-page-change="currentPage = $event"
          @pagination-limit-change="onLimit"
          @search-value-change="onSearch"
          @sort-change="onSort"
          @update:applied-filters="onFilter"
          @selection-change="onSelect"
          @multiple-selection-change="onSelectMany"
          @bulk-delete="remove(selectedRows)"
          @item-delete="(member: Member) => remove([member.id])"
          @context-select="onContext"
        >
          <template #column-name="{ data }">
            <mt-user :name="data.name" :subtitle="data.email" />
          </template>
        </mt-data-table>
      </div>
    </mt-page>
  </mt-app>
</template>

<style scoped>
.stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
  align-content: start;
}

.tab-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-8);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--scale-size-8);
}
</style>
