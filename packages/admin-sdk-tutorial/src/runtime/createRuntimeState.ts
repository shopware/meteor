import type { TutorialLesson } from '@/types/lesson';
import type { TutorialRuntimeState } from '@/types/runtime';

export function createRuntimeState(lesson: TutorialLesson): TutorialRuntimeState {
  const surfaces =
    lesson.id === 'locations-positions'
      ? [
          {
            id: 'before-primary-action',
            title: 'sw-product-detail-actions',
            description: 'Position: before-primary-action',
            variant: 'ghost' as const,
            slotLabel: 'Empty slot',
          },
          {
            id: 'after-primary-action',
            title: 'sw-product-detail-actions',
            description: 'Position: after-primary-action',
            variant: 'ghost' as const,
            slotLabel: 'Empty slot',
          },
        ]
      : [
          {
            id: 'primary',
            title: lesson.title,
            description: lesson.summary,
            variant: 'default' as const,
          },
          {
            id: 'secondary',
            title: 'Try this next',
            description: lesson.objective,
            variant: 'ghost' as const,
          },
        ];

  return {
    statusLabel: lesson.previewLabel,
    notificationTitle: 'Preview ready',
    notificationMessage: 'Preview ready',
    notificationTone: 'info',
    emptyStateTitle: 'Preview ready',
    emptyStateMessage:
      'This dummy admin is intentionally minimal. Later batches will connect the learner code so this area reacts in real time.',
    menuItems: [
      { id: 'dashboard', label: 'Dashboard', kind: 'static', position: 10 },
      { id: 'extensions', label: 'Extensions', kind: 'static', position: 20 },
      { id: 'settings', label: 'Settings', kind: 'static', position: 30 },
    ],
    surfaces,
  };
}

export function resetRuntimeState(lesson: TutorialLesson): TutorialRuntimeState {
  return createRuntimeState(lesson);
}
