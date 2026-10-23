import { computed, shallowReactive, shallowRef, type ComponentInternalInstance } from "vue";
import type { RouteLike, RouteRecordLike } from "./useAppRouter";

/** Unsaved changes that a view reports with `useUnsavedChanges()`. */
export interface UnsavedChangesSource {
  hasChanges(): boolean;
  /** The component that reports the changes, which tells the route that renders them. */
  owner: ComponentInternalInstance | null;
}

/** The route record that renders the component: the deepest one that renders it or an ancestor. */
function findRenderingRecord(owner: ComponentInternalInstance, matched: RouteRecordLike[]) {
  const lineage = new Set<ComponentInternalInstance>();
  let component: ComponentInternalInstance | null = owner;

  while (component) {
    lineage.add(component);
    component = component.parent;
  }

  // A record keeps the public instances it renders. `$` leads back to the internal instance, also
  // for the closed instances of `<script setup>` components.
  const isInLineage = (instance: unknown) => {
    const internal = (instance as { $?: ComponentInternalInstance } | null)?.$;
    return internal !== undefined && lineage.has(internal);
  };

  return [...matched]
    .reverse()
    .find((record) => Object.values(record.instances ?? {}).some(isInLineage));
}

/**
 * Whether the navigation takes the changes off the screen: it leaves the route record that renders
 * them or changes the params of its path, as Vue Router's `onBeforeRouteLeave` and
 * `onBeforeRouteUpdate` see it. Changes to the query or the hash and moves between child routes
 * keep them.
 */
function isLeaving(source: UnsavedChangesSource, to: RouteLike, from: RouteLike) {
  const record = source.owner && findRenderingRecord(source.owner, from.matched ?? []);
  if (!record) return to.path !== from.path;
  if (!to.matched?.includes(record)) return true;

  const paramNames = Array.from(record.path.matchAll(/:(\w+)/g), ([, name]) => name);

  return paramNames.some((name) => String(to.params?.[name]) !== String(from.params?.[name]));
}

/**
 * The unsaved changes that views report with `useUnsavedChanges()`, and the confirmation before
 * leaving them. One confirmation is open at a time: asking again while it is open waits for the
 * same answer.
 */
export function createAppUnsavedChanges() {
  const sources = shallowReactive(new Set<UnsavedChangesSource>());
  const pending = shallowRef<{ answer: Promise<boolean>; resolve(discard: boolean): void } | null>(
    null,
  );

  const hasUnsavedChanges = computed(() =>
    Array.from(sources).some((source) => source.hasChanges()),
  );
  const isConfirming = computed(() => pending.value !== null);

  /** Reports unsaved changes until the returned function is called. */
  function registerUnsavedChanges(source: UnsavedChangesSource) {
    sources.add(source);

    return () => {
      sources.delete(source);
    };
  }

  function askToDiscard(): Promise<boolean> {
    if (pending.value) return pending.value.answer;

    let resolve: (discard: boolean) => void = () => undefined;
    const answer = new Promise<boolean>((done) => (resolve = done));
    pending.value = { answer, resolve };

    return answer;
  }

  /** Resolves the open confirmation: `true` discards the changes. */
  function answer(discard: boolean) {
    const current = pending.value;

    pending.value = null;
    current?.resolve(discard);
  }

  /** Asks to discard the unsaved changes, if there are any. Resolves `true` to leave. */
  function confirmLeave(): Promise<boolean> {
    return hasUnsavedChanges.value ? askToDiscard() : Promise.resolve(true);
  }

  /** A navigation guard that asks before a navigation takes unsaved changes off the screen. */
  function guardNavigation(to: RouteLike, from: RouteLike): true | Promise<boolean> {
    const isLosingChanges = Array.from(sources).some(
      (source) => source.hasChanges() && isLeaving(source, to, from),
    );

    return isLosingChanges ? askToDiscard() : true;
  }

  return {
    hasUnsavedChanges,
    isConfirming,
    registerUnsavedChanges,
    confirmLeave,
    guardNavigation,
    answer,
  };
}
