<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  MtApp,
  MtBadge,
  MtButton,
  MtCard,
  MtContentHeader,
  MtEmptyState,
  MtIcon,
  MtInset,
  MtLink,
  MtPage,
  MtPagination,
  MtProgressBar,
  MtSearch,
  MtSelect,
  MtText,
  useSnackbar,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

type Status = "active" | "paused" | "done";

interface Project {
  id: string;
  code: string;
  name: string;
  status: Status;
  health: number;
  due: string;
  dueOrder: number;
  issues: string;
  members: number;
  updated: number;
}

// Sample data. Replace it with the projects your page loads.
const projects: Project[] = [
  { id: "1", code: "SR", name: "Storefront relaunch", status: "active", health: 60, due: "Feb 14", dueOrder: 4, issues: "18 / 42", members: 6, updated: 1 },
  { id: "2", code: "CK", name: "Checkout speed-up", status: "active", health: 80, due: "Dec 20", dueOrder: 1, issues: "11 / 14", members: 3, updated: 2 },
  { id: "3", code: "B2B", name: "B2B price lists", status: "paused", health: 30, due: "Mar 31", dueOrder: 5, issues: "4 / 25", members: 4, updated: 6 },
  { id: "4", code: "MKT", name: "Spring campaign", status: "active", health: 45, due: "Jan 30", dueOrder: 3, issues: "9 / 20", members: 5, updated: 3 },
  { id: "5", code: "ERP", name: "ERP connection", status: "done", health: 100, due: "Nov 15", dueOrder: 0, issues: "31 / 31", members: 2, updated: 9 },
  { id: "6", code: "APP", name: "Mobile app pilot", status: "active", health: 20, due: "Jan 12", dueOrder: 2, issues: "3 / 18", members: 4, updated: 4 },
  { id: "7", code: "SEO", name: "SEO clean-up", status: "paused", health: 50, due: "Apr 30", dueOrder: 6, issues: "7 / 12", members: 2, updated: 8 },
];

const statusLabels = { active: "Active", paused: "Paused", done: "Done" } as const;
const statusVariants = { active: "positive", paused: "attention", done: "neutral" } as const;

const term = ref("");
const sort = ref("updated");
const statuses = ref<Status[]>([]);

const sortOptions = [
  { value: "updated", label: "Recently updated" },
  { value: "due", label: "Due date" },
  { value: "name", label: "Name" },
];

const statusOptions = (Object.keys(statusLabels) as Status[]).map((value) => ({
  value,
  label: statusLabels[value],
}));

const matches = computed(() =>
  projects
    .filter((project) => project.name.toLowerCase().includes(term.value.trim().toLowerCase()))
    .filter((project) => statuses.value.length === 0 || statuses.value.includes(project.status))
    .sort((a, b) => {
      if (sort.value === "due") return a.dueOrder - b.dueOrder;
      if (sort.value === "name") return a.name.localeCompare(b.name);
      return a.updated - b.updated;
    }),
);

const page = ref(1);
const limit = 6;
const visible = computed(() => matches.value.slice((page.value - 1) * limit, page.value * limit));

watch([term, sort, statuses], () => {
  page.value = 1;
});

const breadcrumb: BreadcrumbItem[] = [{ label: "Projects", icon: "briefcase" }];

const { addSnackbar } = useSnackbar();

// Replace it with the dialog or the route that creates a project.
function createProject() {
  addSnackbar({ message: "Here the new project would open" });
}

function resetFilters() {
  term.value = "";
  statuses.value = [];
}
</script>

<template>
  <mt-app>
    <template #navigation>
      <placeholder-slot name="App: navigation" style="width: 280px" />
    </template>

    <!-- The page: copy it into a route of your application, without the shell around it. -->
    <mt-page width="l" :breadcrumb="breadcrumb">
      <template #actions>
        <mt-button variant="primary" size="default" @click="createProject">
          <template #iconFront>
            <mt-icon name="regular-plus-xs" size="var(--scale-size-12)" decorative />
          </template>
          New project
        </mt-button>
      </template>

      <div class="stack">
        <mt-content-header title="Projects">
          <mt-text size="xs" color="color-text-secondary-default" as="span">
            {{ matches.length }} of {{ projects.length }} projects
          </mt-text>
        </mt-content-header>

        <div class="toolbar">
          <mt-search v-model="term" size="small" placeholder="Search projects" class="toolbar__search" />
          <mt-select
            v-model="statuses"
            :options="statusOptions"
            enable-multi-selection
            small
            placeholder="All statuses"
            aria-label="Status"
          />
          <mt-select
            v-model="sort"
            :options="sortOptions"
            :enable-search="false"
            hide-clearable-button
            small
            aria-label="Sort by"
          />
          <missing-feature title="View switch" inline>
            No segmented control to switch between a grid and a list of the same records.
          </missing-feature>
        </div>

        <missing-feature title="Card link and avatar group" kind="prop">
          A card can't be one link to its record, and has no place for a stack of member avatars.
          The cards link with a Link in their content and show the members as a count.
        </missing-feature>

        <ul v-if="visible.length" class="grid">
          <li v-for="project in visible" :key="project.id">
            <mt-card>
              <mt-inset class="cover" :class="`cover--${project.status}`">
                <mt-text size="2xl" weight="semibold" as="span">{{ project.code }}</mt-text>
              </mt-inset>

              <div class="body">
                <div class="title">
                  <mt-text size="s" weight="semibold" as="h2">{{ project.name }}</mt-text>
                  <mt-badge :variant="statusVariants[project.status]" size="s">
                    {{ statusLabels[project.status] }}
                  </mt-badge>
                </div>

                <mt-progress-bar
                  :model-value="project.health"
                  :max-value="100"
                  label="Timeline health"
                />

                <dl class="facts">
                  <div>
                    <mt-text as="dt" size="2xs" color="color-text-secondary-default">Due</mt-text>
                    <mt-text as="dd" size="xs">{{ project.due }}</mt-text>
                  </div>
                  <div>
                    <mt-text as="dt" size="2xs" color="color-text-secondary-default">
                      Issues closed
                    </mt-text>
                    <mt-text as="dd" size="xs">{{ project.issues }}</mt-text>
                  </div>
                  <div>
                    <mt-text as="dt" size="2xs" color="color-text-secondary-default">Team</mt-text>
                    <mt-text as="dd" size="xs">{{ project.members }} members</mt-text>
                  </div>
                </dl>

                <mt-link :to="`/projects/${project.id}`">Open project</mt-link>
              </div>
            </mt-card>
          </li>
        </ul>

        <mt-empty-state
          v-else
          icon="briefcase"
          headline="No projects found"
          description="Change the search or the status filter to see more projects."
          button-text="Reset filters"
          @button-click="resetFilters"
        />

        <mt-pagination
          v-if="matches.length > limit"
          :current-page="page"
          :limit="limit"
          :total-items="matches.length"
          @change-current-page="page = $event"
        />
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

.toolbar {
  display: grid;
  grid-template-columns: minmax(12rem, 1fr) minmax(10rem, 14rem) minmax(10rem, 13rem) auto;
  align-items: center;
  gap: var(--scale-size-8);
}

@media (width < 960px) {
  .toolbar {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .toolbar__search {
    grid-column: 1 / -1;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  gap: var(--scale-size-16);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* The cover only reaches the card edges at its top; the content follows below it. */
.cover {
  --mt-inset-block-end: 0;

  display: grid;
  place-items: center;
  height: 6rem;
  color: var(--color-text-primary-default);
}

.cover--active {
  background-color: var(--color-background-brand-default);
}

.cover--paused {
  background-color: var(--color-background-attention-default);
}

.cover--done {
  background-color: var(--color-background-secondary-default);
}

.body {
  display: grid;
  gap: var(--scale-size-12);
  padding-block-start: var(--scale-size-16);
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-8);
}

.title > h2 {
  margin: 0;
}

.facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--scale-size-8);
  margin: 0;
}

.facts dd {
  margin: 0;
}
</style>
