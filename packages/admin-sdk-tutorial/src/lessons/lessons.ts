import type { TutorialLesson } from '@/types/lesson';

export const lessons: TutorialLesson[] = [
  {
    id: 'notifications',
    order: 1,
    title: 'Notifications',
    summary: 'Trigger feedback in the dummy admin shell.',
    description:
      'Start with a simple action that shows how Admin SDK calls can create visible UI feedback for the user. Edit the notification text and re-run to see the toast update.',
    objective: 'Edit the code to change the notification title, message, or tone.',
    starterCode: `sdk.notification.dispatch({
  title: 'Hello Meteor',
  message: 'Welcome to the interactive Admin SDK tutorial.',
  tone: 'success',
});`,
    previewLabel: 'Notification concept',
    outputMessage:
      'This lesson teaches the notification flow. Change the title, message, or tone and run the code to update the toast preview.',
  },
  {
    id: 'menu-items',
    order: 2,
    title: 'Menu items',
    summary: 'See how navigation registration could feel.',
    description:
      'Use a lightweight dummy sidebar to explain how extension points can add new entry points into the admin navigation. Re-run the lesson after changing the label or position.',
    objective: 'Edit the code to add, rename, or reposition a custom navigation entry.',
    starterCode: `sdk.menu.add({
  label: 'My Extension',
  position: 20,
});`,
    previewLabel: 'Navigation concept',
    outputMessage:
      'This lesson focuses on navigation. Change the label or position and run the code to see the sidebar update.',
  },
  {
    id: 'locations-positions',
    order: 3,
    title: 'Locations & positions',
    summary: 'Understand placement using simplified extension surfaces.',
    description:
      'Visualize named extension surfaces with simple cards so learners can understand where content appears without needing a full Shopware Administration shell. Change the target position and re-run to move the injected content.',
    objective: 'Edit the code to move content into the intended location or position.',
    starterCode: `sdk.location.render({
  locationId: 'sw-product-detail-actions',
  positionId: 'after-primary-action',
  content: 'Injected action card',
});`,
    previewLabel: 'Extension surfaces concept',
    outputMessage:
      'This lesson explains location IDs and position IDs. Change the target position and run the code to move the injected content between the labeled slots.',
  },
];
