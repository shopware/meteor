<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtApp,
  MtButton,
  MtContentHeader,
  MtDataTable,
  MtPage,
  MtPanel,
  MtSelect,
  MtSwitch,
  MtTextField,
  useSnackbar,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

interface Customer {
  id: string;
  name: string;
  email: string;
  group: string;
  city: string;
  active: boolean;
}

// Sample data. Replace it with the customers your page loads.
const customers = ref<Customer[]>([
  { id: "1", name: "Anna Schmidt", email: "anna.schmidt@example.com", group: "B2B", city: "Berlin", active: true },
  { id: "2", name: "Jonas Becker", email: "jonas.becker@example.com", group: "Standard", city: "Hamburg", active: true },
  { id: "3", name: "Lea Hoffmann", email: "lea.hoffmann@example.com", group: "Standard", city: "Munich", active: false },
  { id: "4", name: "Paul Wagner", email: "paul.wagner@example.com", group: "VIP", city: "Cologne", active: true },
  { id: "5", name: "Mia Schulz", email: "mia.schulz@example.com", group: "Standard", city: "Frankfurt", active: true },
  { id: "6", name: "Felix Koch", email: "felix.koch@example.com", group: "B2B", city: "Stuttgart", active: true },
  { id: "7", name: "Emma Richter", email: "emma.richter@example.com", group: "VIP", city: "Leipzig", active: true },
  { id: "8", name: "Leon Klein", email: "leon.klein@example.com", group: "Standard", city: "Dresden", active: false },
]);

const columns = [
  { label: "Name", property: "name", renderer: "text" as const, position: 0, sortable: true },
  { label: "Email address", property: "email", renderer: "text" as const, position: 100 },
  { label: "Group", property: "group", renderer: "text" as const, position: 200, sortable: true },
  { label: "City", property: "city", renderer: "text" as const, position: 300, sortable: true },
  {
    label: "Status",
    property: "active",
    renderer: "badge" as const,
    position: 400,
    rendererOptions: {
      renderItemBadge: (data: Customer) =>
        data.active
          ? { label: "Active", variant: "positive" as const }
          : { label: "Inactive", variant: "default" as const },
    },
  },
];

const term = ref("");
const sortBy = ref("name");
const sortDirection = ref<"ASC" | "DESC">("ASC");
const currentPage = ref(1);
const limit = ref(10);

const matches = computed(() =>
  customers.value
    .filter((customer) =>
      `${customer.name} ${customer.email} ${customer.city}`
        .toLowerCase()
        .includes(term.value.trim().toLowerCase()),
    )
    .sort((a, b) => {
      const key = sortBy.value as keyof Customer;
      const order = String(a[key]).localeCompare(String(b[key]));
      return sortDirection.value === "ASC" ? order : -order;
    }),
);

const rows = computed(() =>
  matches.value.slice((currentPage.value - 1) * limit.value, currentPage.value * limit.value),
);

// The customer in the panel, as a copy, so Cancel can drop the changes.
const draft = ref<Customer | null>(null);

function edit(customer: Customer) {
  draft.value = { ...customer };
}

const { addSnackbar } = useSnackbar();

// Replace it with the request that saves the customer.
function save() {
  if (!draft.value) return;

  const index = customers.value.findIndex(({ id }) => id === draft.value!.id);
  customers.value[index] = { ...draft.value };
  addSnackbar({ message: `${draft.value.name} saved` });
  draft.value = null;
}

const groupOptions = [
  { value: "Standard", label: "Standard" },
  { value: "B2B", label: "B2B" },
  { value: "VIP", label: "VIP" },
];

const breadcrumb: BreadcrumbItem[] = [{ label: "Customers", icon: "users" }];
</script>

<template>
  <mt-app>
    <template #navigation>
      <placeholder-slot name="App: navigation" style="width: 280px" />
    </template>

    <!-- The page: copy it into a route of your application, without the shell around it. -->
    <mt-page :breadcrumb="breadcrumb">
      <div class="stack">
        <mt-content-header title="Customers" />

        <missing-feature title="Sheet and row link">
          No sheet that opens over the content, so the editor is the end panel of the page and
          pushes the table aside. Rows can't be links either; the Edit action of each row opens
          the panel.
        </missing-feature>

        <mt-data-table
          layout="full"
          caption="Customers"
          :data-source="rows"
          :columns="columns"
          :current-page="currentPage"
          :pagination-limit="limit"
          :pagination-total-items="matches.length"
          :search-value="term"
          :sort-by="sortBy"
          :sort-direction="sortDirection"
          disable-delete
          disable-settings-table
          @search-value-change="
            (value: string) => {
              term = value;
              currentPage = 1;
            }
          "
          @sort-change="
            (property: string, direction: 'ASC' | 'DESC') => {
              sortBy = property;
              sortDirection = direction;
            }
          "
          @pagination-current-page-change="currentPage = $event"
          @pagination-limit-change="
            (value: number) => {
              limit = value;
              currentPage = 1;
            }
          "
          @open-details="edit"
        />
      </div>

      <template v-if="draft" #end>
        <mt-panel label="Edit customer" icon="regular-pencil-s" resizable :min-width="320">
          <aside class="editor" aria-label="Edit customer">
            <form class="stack" @submit.prevent="save">
              <mt-text-field v-model="draft.name" label="Name" required />
              <mt-text-field v-model="draft.email" label="Email address" required />
              <mt-select
                v-model="draft.group"
                label="Customer group"
                :options="groupOptions"
                :enable-search="false"
                hide-clearable-button
              />
              <mt-text-field v-model="draft.city" label="City" />
              <mt-switch v-model="draft.active" label="Active" />

              <div class="actions">
                <mt-button variant="secondary" size="default" @click="draft = null">
                  Cancel
                </mt-button>
                <mt-button variant="primary" size="default" type="submit">Save</mt-button>
              </div>
            </form>
          </aside>
        </mt-panel>
      </template>
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

.editor {
  padding: var(--scale-size-16);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--scale-size-8);
}
</style>
