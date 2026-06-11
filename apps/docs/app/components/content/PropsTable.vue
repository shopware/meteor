<template>
  <div v-if="meta" class="not-prose my-8 space-y-8">
    <template v-if="meta.props.length">
      <section>
        <h3 class="mb-3 text-lg font-semibold text-default">Props</h3>
        <div class="overflow-x-auto rounded-lg border border-muted">
          <table class="w-full border-collapse text-sm">
            <thead
              class="bg-muted text-left text-xs font-semibold text-default"
            >
              <tr>
                <th class="px-4 py-2">Name</th>
                <th class="px-4 py-2">Type</th>
                <th class="px-4 py-2">Default</th>
                <th class="px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-muted">
              <tr v-for="prop in meta.props" :key="prop.name" class="align-top">
                <td class="px-4 py-3">
                  <code
                    class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs"
                  >
                    {{ prop.name }}
                  </code>
                  <UBadge
                    v-if="prop.required"
                    color="warning"
                    variant="subtle"
                    size="sm"
                    class="ml-2"
                  >
                    required
                  </UBadge>
                  <UBadge
                    v-if="prop.deprecated"
                    color="error"
                    variant="subtle"
                    size="sm"
                    class="ml-2"
                  >
                    deprecated
                  </UBadge>
                </td>
                <td class="max-w-80 px-4 py-3">
                  <code
                    class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs break-words text-muted"
                  >
                    {{ prop.type }}
                  </code>
                </td>
                <td class="px-4 py-3">
                  <code
                    v-if="prop.default"
                    class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs"
                  >
                    {{ prop.default }}
                  </code>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="px-4 py-3 text-default">
                  {{ prop.description }}
                  <em v-if="prop.deprecated" class="mt-1 block text-error">
                    {{ prop.deprecated }}
                  </em>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <template v-if="meta.events.length">
      <section>
        <h3 class="mb-3 text-lg font-semibold text-default">Events</h3>
        <div class="overflow-x-auto rounded-lg border border-muted">
          <table class="w-full border-collapse text-sm">
            <thead
              class="bg-muted text-left text-xs font-semibold text-default"
            >
              <tr>
                <th class="px-4 py-2">Name</th>
                <th class="px-4 py-2">Payload</th>
                <th class="px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-muted">
              <tr
                v-for="event in meta.events"
                :key="event.name"
                class="align-top"
              >
                <td class="px-4 py-3">
                  <code
                    class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs"
                  >
                    {{ event.name }}
                  </code>
                </td>
                <td class="max-w-80 px-4 py-3">
                  <code
                    class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs break-words text-muted"
                  >
                    {{ event.type }}
                  </code>
                </td>
                <td class="px-4 py-3 text-default">{{ event.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <template v-if="meta.slots.length">
      <section>
        <h3 class="mb-3 text-lg font-semibold text-default">Slots</h3>
        <div class="overflow-x-auto rounded-lg border border-muted">
          <table class="w-full border-collapse text-sm">
            <thead
              class="bg-muted text-left text-xs font-semibold text-default"
            >
              <tr>
                <th class="px-4 py-2">Name</th>
                <th class="px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-muted">
              <tr v-for="slot in meta.slots" :key="slot.name" class="align-top">
                <td class="px-4 py-3">
                  <code
                    class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs"
                  >
                    {{ slot.name }}
                  </code>
                </td>
                <td class="px-4 py-3 text-default">{{ slot.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
  <div
    v-else
    class="not-prose my-6 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-default"
  >
    No API metadata available for
    <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
      {{ component }}
    </code>
    . Add it to the allowlist in
    <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
      modules/component-meta.ts
    </code>
    .
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import componentMeta from "#meteor-component-meta";

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
