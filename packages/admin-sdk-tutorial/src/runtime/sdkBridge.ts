import type { Ref } from 'vue';

import type { TutorialRuntimeState, TutorialSdkBridge } from '@/types/runtime';

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function createSdkBridge(runtimeState: Ref<TutorialRuntimeState>): TutorialSdkBridge {
  return {
    notification: {
      dispatch(payload) {
        runtimeState.value.notificationTitle = payload.title;
        runtimeState.value.notificationMessage = payload.message;
        runtimeState.value.notificationTone = payload.tone ?? 'info';
        runtimeState.value.emptyStateTitle = payload.title;
        runtimeState.value.emptyStateMessage = payload.message;
      },
    },
    menu: {
      add(payload) {
        const nextItem = {
          id: `dynamic-${slugify(payload.label)}`,
          label: payload.label,
          kind: 'dynamic' as const,
          position: payload.position,
        };

        runtimeState.value.menuItems = [
          ...runtimeState.value.menuItems.filter((item) => item.id !== nextItem.id),
          nextItem,
        ].sort((left, right) => (left.position ?? 999) - (right.position ?? 999));

        runtimeState.value.statusLabel = 'Navigation concept';
        runtimeState.value.notificationTitle = 'Menu item added';
        runtimeState.value.notificationMessage = `“${payload.label}” is now visible in the dummy admin navigation.`;
        runtimeState.value.notificationTone = 'success';
        runtimeState.value.emptyStateTitle = 'Menu item registered';
        runtimeState.value.emptyStateMessage = `Added “${payload.label}” to the dummy admin navigation.`;
      },
    },
    location: {
      render(payload) {
        runtimeState.value.surfaces = runtimeState.value.surfaces.map((surface) => {
          if (surface.id !== payload.positionId) {
            return surface;
          }

          return {
            ...surface,
            title: payload.locationId,
            description: `Position: ${payload.positionId ?? 'default'}`,
            slotLabel: 'Injected content',
            injectedContent: payload.content,
            variant: 'default',
          };
        });

        runtimeState.value.statusLabel = 'Extension surfaces concept';
        runtimeState.value.notificationTitle = 'Location content rendered';
        runtimeState.value.notificationMessage = `Injected content into ${payload.locationId}${payload.positionId ? ` at ${payload.positionId}` : ''}.`;
        runtimeState.value.notificationTone = 'success';
        runtimeState.value.emptyStateTitle = 'Location content rendered';
        runtimeState.value.emptyStateMessage = `Rendered content into ${payload.locationId}${payload.positionId ? ` at ${payload.positionId}` : ''}.`;
      },
    },
    reset(state) {
      runtimeState.value = structuredClone(state);
    },
  };
}
