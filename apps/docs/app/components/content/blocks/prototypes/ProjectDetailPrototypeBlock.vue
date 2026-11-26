<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtApp,
  MtAvatar,
  MtBadge,
  MtButton,
  MtCard,
  MtContentHeader,
  MtDataTable,
  MtIcon,
  MtLayout,
  MtPage,
  MtProgressBar,
  MtTabs,
  MtText,
  MtUser,
  useSnackbar,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

const breadcrumb: BreadcrumbItem[] = [
  { label: "Projects", to: "/projects", icon: "briefcase" },
  { label: "Storefront relaunch" },
];

// Sample data. Replace it with the project your page loads.
const stats = [
  { label: "Timeline health", value: "On track", detail: "34 days left", progress: 60 },
  { label: "Due date", value: "Feb 14, 2027", detail: "in 12 weeks" },
  { label: "Issues closed", value: "18 / 42", detail: "24 open", progress: 43 },
  { label: "Files", value: "6", detail: "2 updated this week" },
];

const files = [
  { name: "Scope.pdf", size: "4.2 MB", icon: "regular-file-text" },
  { name: "Homepage designs.fig", size: "18.7 MB", icon: "regular-image" },
  { name: "Content plan.xlsx", size: "640 KB", icon: "regular-table" },
  { name: "Brand assets.zip", size: "92.1 MB", icon: "regular-archive" },
];

const contributors = [
  "Anna Schmidt",
  "Jonas Becker",
  "Lea Hoffmann",
  "Paul Wagner",
  "Mia Schulz",
  "Felix Koch",
];

const tab = ref("overview");
const tabs = [
  { name: "overview", label: "Overview" },
  { name: "issues", label: "Issues" },
  { name: "timeline", label: "Timeline" },
  { name: "board", label: "Board" },
  { name: "activity", label: "Activity" },
];

type IssueStatus = "To do" | "In progress" | "Done";

interface Issue {
  id: string;
  key: string;
  title: string;
  status: IssueStatus;
  assignee: string;
  due: string;
  start: number;
  length: number;
}

const issues: Issue[] = [
  { id: "1", key: "SR-101", title: "Define the new navigation", status: "Done", assignee: "Anna Schmidt", due: "Dec 2", start: 0, length: 3 },
  { id: "2", key: "SR-102", title: "Design the product page", status: "In progress", assignee: "Lea Hoffmann", due: "Dec 16", start: 2, length: 4 },
  { id: "3", key: "SR-103", title: "Migrate the CMS content", status: "In progress", assignee: "Jonas Becker", due: "Jan 9", start: 4, length: 5 },
  { id: "4", key: "SR-104", title: "Set up redirects", status: "To do", assignee: "Paul Wagner", due: "Jan 23", start: 7, length: 2 },
  { id: "5", key: "SR-105", title: "Load test the checkout", status: "To do", assignee: "Mia Schulz", due: "Feb 6", start: 8, length: 3 },
  { id: "6", key: "SR-106", title: "Train the support team", status: "To do", assignee: "Felix Koch", due: "Feb 13", start: 10, length: 2 },
];

const statusVariants = { "To do": "default", "In progress": "info", Done: "positive" } as const;

const columns = [
  { label: "Key", property: "key", renderer: "text" as const, position: 0, width: 110 },
  { label: "Title", property: "title", renderer: "text" as const, position: 100 },
  {
    label: "Status",
    property: "status",
    renderer: "badge" as const,
    position: 200,
    rendererOptions: {
      renderItemBadge: (data: Issue) => ({ label: data.status, variant: statusVariants[data.status] }),
    },
  },
  { label: "Assignee", property: "assignee", renderer: "text" as const, position: 300 },
  { label: "Due", property: "due", renderer: "text" as const, position: 400 },
];

const currentPage = ref(1);
const limit = ref(10);
const pagedIssues = computed(() =>
  issues.slice((currentPage.value - 1) * limit.value, currentPage.value * limit.value),
);

const weeks = ["W48", "W49", "W50", "W51", "W52", "W1", "W2", "W3", "W4", "W5", "W6", "W7"];

const activity = [
  { who: "Lea Hoffmann", what: "moved SR-102 to In progress", when: "2 hours ago" },
  { who: "Jonas Becker", what: "uploaded Content plan.xlsx", when: "Yesterday" },
  { who: "Anna Schmidt", what: "closed SR-101", when: "Nov 21" },
  { who: "Max Mustermann", what: "created the project", when: "Nov 3" },
];

const { addSnackbar } = useSnackbar();

// Replace it with copying the URL of the project.
function share() {
  addSnackbar({ message: "Link copied" });
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
        <mt-button variant="secondary" size="default" @click="share">
          <template #iconFront>
            <mt-icon name="regular-link" size="var(--scale-size-16)" decorative />
          </template>
          Copy link
        </mt-button>
      </template>

      <div class="stack">
        <mt-content-header title="Storefront relaunch">
          <div class="meta">
            <mt-badge variant="positive">Active</mt-badge>
            <mt-badge>Priority medium</mt-badge>
            <mt-text size="xs" color="color-text-secondary-default" as="span">
              SR · Updated today
            </mt-text>
            <missing-feature title="Description and avatar" kind="slot" inline>
              Content Header has no slots for a description, an icon or avatar next to the title,
              or a back link.
            </missing-feature>
          </div>
        </mt-content-header>

        <mt-card>
          <div class="stats">
            <div v-for="stat in stats" :key="stat.label" class="stat">
              <mt-text size="xs" color="color-text-secondary-default" as="span">
                {{ stat.label }}
              </mt-text>
              <mt-text size="xl" weight="semibold" as="span">{{ stat.value }}</mt-text>
              <mt-progress-bar
                v-if="stat.progress !== undefined"
                :model-value="stat.progress"
                :max-value="100"
                :label="stat.detail"
              />
              <mt-text v-else size="xs" color="color-text-secondary-default" as="span">
                {{ stat.detail }}
              </mt-text>
            </div>
          </div>
        </mt-card>

        <div class="tab-row">
          <mt-tabs :items="tabs" :default-item="tab" @new-item-active="tab = $event" />
          <missing-feature title="Sticky tabs" kind="slot" inline>
            Page has no slot below its header, so the tabs scroll away with the content.
          </missing-feature>
        </div>

        <mt-layout v-if="tab === 'overview'">
          <mt-card title="Brief">
            <mt-text size="s">
              Relaunch the storefront on the new theme before the spring season. The project
              covers the navigation, the product page and the CMS content, and ends with the
              training of the support team.
            </mt-text>
          </mt-card>

          <mt-card title="Files">
            <missing-feature title="File card">
              No component shows a file with its type, size and actions. The cards stand in for it.

              <template #stand-in>
                <ul class="files">
                  <li v-for="file in files" :key="file.name" class="files__card">
                    <mt-icon :name="file.icon" size="var(--scale-size-24)" decorative />
                    <span class="files__text">
                      <mt-text size="xs" weight="semibold" as="span">{{ file.name }}</mt-text>
                      <mt-text size="2xs" color="color-text-secondary-default" as="span">
                        {{ file.size }}
                      </mt-text>
                    </span>
                  </li>
                </ul>
              </template>
            </missing-feature>
          </mt-card>

          <template #end>
            <mt-card title="Status">
              <div class="stack">
                <missing-feature title="Description list" inline>
                  No component for label and value pairs, so the facts are a plain description
                  list.
                </missing-feature>
                <dl class="facts">
                  <mt-text as="dt" size="xs" color="color-text-secondary-default">Owner</mt-text>
                  <mt-text as="dd" size="xs">Max Mustermann</mt-text>
                  <mt-text as="dt" size="xs" color="color-text-secondary-default">Team</mt-text>
                  <mt-text as="dd" size="xs">Storefront</mt-text>
                  <mt-text as="dt" size="xs" color="color-text-secondary-default">Started</mt-text>
                  <mt-text as="dd" size="xs">Nov 3, 2026</mt-text>
                  <mt-text as="dt" size="xs" color="color-text-secondary-default">Estimate</mt-text>
                  <mt-text as="dd" size="xs">14 weeks</mt-text>
                </dl>
              </div>
            </mt-card>

            <mt-card :title="`Contributors (${contributors.length})`">
              <missing-feature title="Avatar group">
                Avatar shows one person. A stack of avatars with an overflow count is missing.

                <template #stand-in>
                  <div class="avatars">
                    <mt-avatar
                      v-for="name in contributors.slice(0, 4)"
                      :key="name"
                      :first-name="name.split(' ')[0]"
                      :last-name="name.split(' ')[1]"
                      size="s"
                    />
                    <mt-text size="xs" color="color-text-secondary-default" as="span">
                      +{{ contributors.length - 4 }}
                    </mt-text>
                  </div>
                </template>
              </missing-feature>
            </mt-card>
          </template>
        </mt-layout>

        <mt-data-table
          v-else-if="tab === 'issues'"
          layout="full"
          caption="Issues"
          :data-source="pagedIssues"
          :columns="columns"
          :current-page="currentPage"
          :pagination-limit="limit"
          :pagination-total-items="issues.length"
          disable-search
          disable-edit
          disable-delete
          disable-settings-table
          @pagination-current-page-change="currentPage = $event"
          @pagination-limit-change="
            (value: number) => {
              limit = value;
              currentPage = 1;
            }
          "
        >
          <template #column-assignee="{ data }">
            <mt-user :name="data.assignee" compact />
          </template>
        </mt-data-table>

        <mt-card v-else-if="tab === 'timeline'" title="Timeline">
          <missing-feature title="Timeline">
            No component shows tasks as bars over time. The rows below stand in for a Gantt chart.

            <template #stand-in>
              <div class="gantt" :style="{ '--weeks': weeks.length }">
                <span />
                <mt-text
                  v-for="week in weeks"
                  :key="week"
                  size="2xs"
                  color="color-text-secondary-default"
                  as="span"
                >
                  {{ week }}
                </mt-text>
                <template v-for="issue in issues" :key="issue.id">
                  <mt-text size="xs" as="span" class="gantt__label">{{ issue.title }}</mt-text>
                  <span
                    class="gantt__bar"
                    :class="`gantt__bar--${issue.status === 'Done' ? 'done' : 'open'}`"
                    :style="{ gridColumn: `${issue.start + 2} / span ${issue.length}` }"
                  />
                </template>
              </div>
            </template>
          </missing-feature>
        </mt-card>

        <missing-feature v-else-if="tab === 'board'" title="Board">
          No component for columns of cards that can be dragged between them. The columns stand in
          for a board, without dragging.

          <template #stand-in>
            <div class="board">
              <section
                v-for="status in ['To do', 'In progress', 'Done'] as IssueStatus[]"
                :key="status"
                class="board__column"
              >
                <mt-text size="xs" weight="semibold" as="h3">{{ status }}</mt-text>
                <mt-card
                  v-for="issue in issues.filter((item) => item.status === status)"
                  :key="issue.id"
                  :title="issue.title"
                  :subtitle="`${issue.key} · ${issue.assignee}`"
                />
              </section>
            </div>
          </template>
        </missing-feature>

        <mt-card v-else title="Activity">
          <missing-feature title="Activity feed">
            No component for a list of events with who, what and when. The entries stand in for it.

            <template #stand-in>
              <ol class="feed">
                <li v-for="entry in activity" :key="entry.what" class="feed__entry">
                  <mt-avatar
                    :first-name="entry.who.split(' ')[0]"
                    :last-name="entry.who.split(' ')[1]"
                    size="xs"
                  />
                  <mt-text size="xs" as="span">
                    <strong>{{ entry.who }}</strong> {{ entry.what }}
                  </mt-text>
                  <mt-text size="2xs" color="color-text-secondary-default" as="span">
                    {{ entry.when }}
                  </mt-text>
                </li>
              </ol>
            </template>
          </missing-feature>
        </mt-card>
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

.meta,
.tab-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--scale-size-8);
}

.tab-row {
  justify-content: space-between;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: var(--scale-size-24);
}

.stat {
  display: grid;
  gap: var(--scale-size-4);
  align-content: start;
}

.facts {
  display: grid;
  grid-template-columns: 6rem minmax(0, 1fr);
  gap: var(--scale-size-8) var(--scale-size-12);
  margin: 0;
}

.facts dd {
  margin: 0;
}

.files {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: var(--scale-size-8);
  margin: 0;
  padding: 0;
  list-style: none;
}

.files__card {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  padding: var(--scale-size-12);
  color: var(--color-icon-secondary-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
}

.files__text {
  display: grid;
  min-width: 0;
}

.avatars {
  display: flex;
  align-items: center;
}

.avatars > :not(:first-child) {
  margin-inline-start: calc(var(--scale-size-8) * -1);
}

.avatars > span:last-child {
  margin-inline-start: var(--scale-size-8);
}

.gantt {
  display: grid;
  grid-template-columns: minmax(10rem, 14rem) repeat(var(--weeks), minmax(2rem, 1fr));
  align-items: center;
  gap: var(--scale-size-8) 0;
  overflow-x: auto;
}

.gantt__label {
  grid-column: 1;
  padding-inline-end: var(--scale-size-12);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gantt__bar {
  height: var(--scale-size-16);
  border-radius: var(--border-radius-s);
}

.gantt__bar--done {
  background-color: var(--color-icon-positive-default);
}

.gantt__bar--open {
  background-color: var(--color-interaction-primary-default);
}

.board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--scale-size-16);
}

.board__column {
  display: grid;
  gap: var(--scale-size-8);
  align-content: start;
}

.board__column > h3 {
  margin: 0;
}

.feed {
  display: grid;
  gap: var(--scale-size-12);
  margin: 0;
  padding: 0;
  list-style: none;
}

.feed__entry {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--scale-size-8);
}
</style>
