<template>
  <div v-if="meta" class="props-table">
    <template v-if="meta.props.length">
      <h3 class="props-table__heading">Props</h3>
      <div class="props-table__wrapper">
        <table class="props-table__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prop in meta.props" :key="prop.name">
              <td>
                <code>{{ prop.name }}</code>
                <span
                  v-if="prop.required"
                  class="props-table__badge props-table__badge--required"
                >
                  required
                </span>
                <span
                  v-if="prop.deprecated"
                  class="props-table__badge props-table__badge--deprecated"
                >
                  deprecated
                </span>
              </td>
              <td>
                <code class="props-table__type">{{ prop.type }}</code>
              </td>
              <td>
                <code v-if="prop.default">{{ prop.default }}</code>
                <span v-else>-</span>
              </td>
              <td>
                {{ prop.description }}
                <em v-if="prop.deprecated" class="props-table__deprecation">{{
                  prop.deprecated
                }}</em>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-if="meta.events.length">
      <h3 class="props-table__heading">Events</h3>
      <div class="props-table__wrapper">
        <table class="props-table__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Payload</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in meta.events" :key="event.name">
              <td>
                <code>{{ event.name }}</code>
              </td>
              <td>
                <code class="props-table__type">{{ event.type }}</code>
              </td>
              <td>{{ event.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-if="meta.slots.length">
      <h3 class="props-table__heading">Slots</h3>
      <div class="props-table__wrapper">
        <table class="props-table__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="slot in meta.slots" :key="slot.name">
              <td>
                <code>{{ slot.name }}</code>
              </td>
              <td>{{ slot.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
  <div v-else class="props-table__missing">
    No API metadata available for <code>{{ component }}</code
    >. Add it to the allowlist in <code>modules/component-meta.ts</code>.
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import componentMeta from "#build/meteor-component-meta.mjs";

const props = defineProps<{
  /** Component name from the meta allowlist, e.g. MtButton */
  component: string;
}>();

interface ComponentMeta {
  props: {
    name: string;
    description: string;
    type: string;
    required: boolean;
    default?: string;
    deprecated?: string;
  }[];
  events: { name: string; description: string; type: string }[];
  slots: { name: string; description: string }[];
}

const meta = computed<ComponentMeta | undefined>(
  () => (componentMeta as Record<string, ComponentMeta>)[props.component],
);
</script>

<style scoped>
.props-table__heading {
  font-size: var(--font-size-l);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary-default);
  margin: var(--scale-size-24) 0 var(--scale-size-12);
}

.props-table__wrapper {
  border: 1px solid var(--color-border-secondary-default);
  border-radius: 8px;
  overflow-x: auto;
}

.props-table__table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-xs);
}

.props-table__table th {
  text-align: left;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary-default);
  background-color: var(--color-background-secondary-default);
  padding: var(--scale-size-8) var(--scale-size-16);
  border-bottom: 1px solid var(--color-border-secondary-default);
}

.props-table__table td {
  padding: var(--scale-size-8) var(--scale-size-16);
  border-bottom: 1px solid var(--color-border-secondary-default);
  color: var(--color-text-primary-default);
  vertical-align: top;
}

.props-table__table tr:last-child td {
  border-bottom: none;
}

.props-table__type {
  color: var(--color-text-secondary-default);
  word-break: break-word;
}

.props-table__badge {
  display: inline-block;
  margin-left: var(--scale-size-4);
  padding: 0 var(--scale-size-4);
  border-radius: 4px;
  font-size: 11px;
}

.props-table__badge--required {
  background-color: var(--color-background-attention-default);
  color: var(--color-text-attention-default);
}

.props-table__badge--deprecated {
  background-color: var(--color-background-critical-default);
  color: var(--color-text-critical-default);
}

.props-table__deprecation {
  display: block;
  color: var(--color-text-critical-default);
}

.props-table__missing {
  margin: 24px 0;
  padding: var(--scale-size-12) var(--scale-size-16);
  border: 1px solid var(--color-border-attention-default);
  border-radius: 8px;
  background-color: var(--color-background-attention-default);
  color: var(--color-text-primary-default);
  font-size: var(--font-size-xs);
}
</style>
