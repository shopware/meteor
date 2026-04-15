import type { TutorialLesson } from '@/types/lesson';

export const lessons: TutorialLesson[] = [
  {
    id: 'notifications',
    order: 1,
    title: 'Notifications',
    summary: 'Trigger feedback in the dummy admin shell.',
    description:
      'Trigger a host notification from extension code and watch the toast update in the dummy admin.',
    task: 'Change the notification title, message, or tone, then run the code again.',
    objective: 'See how a simple SDK call can create immediate host feedback.',
    starterCode: `sdk.notification.dispatch({
  title: 'Hello Meteor',
  message: 'Welcome to the interactive Admin SDK tutorial.',
  tone: 'success',
});`,
    previewLabel: 'Notification concept',
    outputMessage:
      'What to try: tweak the notification title, message, or tone and verify the toast changes in the preview.',
  },
  {
    id: 'menu-items',
    order: 2,
    title: 'Menu items',
    summary: 'See how navigation registration could feel.',
    description:
      'Register a custom navigation entry and use the dummy sidebar to understand how host navigation can change.',
    task: 'Rename the menu item or change its position, then run the code again.',
    objective: 'Understand how extension code can add new entry points into admin navigation.',
    starterCode: `sdk.menu.add({
  label: 'My Extension',
  position: 20,
});`,
    previewLabel: 'Navigation concept',
    outputMessage:
      'What to try: change the label or position and confirm the sidebar reorders the dynamic entry.',
  },
  {
    id: 'locations-positions',
    order: 3,
    title: 'Locations & positions',
    summary: 'Understand placement using simplified extension surfaces.',
    description:
      'Render extension content into labeled host slots so you can see how locations and positions affect placement.',
    task: 'Change the target position and run the code again to move the injected content.',
    objective: 'Understand how location IDs and position IDs determine where extension content appears.',
    starterCode: `sdk.location.render({
  locationId: 'sw-product-detail-actions',
  positionId: 'after-primary-action',
  content: 'Injected action card',
});`,
    previewLabel: 'Extension surfaces concept',
    outputMessage:
      'What to try: move the injected content between the labeled slots by changing the target position.',
  },
];
