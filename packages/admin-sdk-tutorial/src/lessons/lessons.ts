import type { TutorialLesson } from '@/types/lesson';

export const lessons: TutorialLesson[] = [
  {
    id: 'notifications',
    order: 1,
    title: 'Notifications',
    summary: 'Trigger feedback in the dummy admin shell.',
    description:
      'Trigger a host notification from extension code and watch the toast update in the dummy admin.',
    task: 'Change the notification title, message, or variant, then run the code again.',
    objective: 'See how a simple SDK call can create immediate host feedback.',
    runtimeLocationId: 'sw-main-hidden',
    starterCode: `notification.dispatch({
  title: 'Hello Meteor',
  message: 'Welcome to the interactive Admin SDK tutorial.',
  variant: 'success',
});`,
    previewLabel: 'Notification concept',
    outputMessage:
      'What to try: tweak the notification title, message, or variant and verify the toast changes in the preview.',
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
    runtimeLocationId: 'sw-main-hidden',
    starterCode: `if (location.is('sw-main-hidden')) {
  ui.menu.addMenuItem({
    label: 'My Extension',
    locationId: 'meteor-tutorial-menu-item',
    parent: 'sw-extension',
    position: 20,
  });
}`,
    previewLabel: 'Navigation concept',
    outputMessage:
      'What to try: change the label or position and confirm the sidebar reorders the dynamic entry for the given locationId.',
  },
  {
    id: 'locations-positions',
    order: 3,
    title: 'Locations & positions',
    summary: 'Understand placement using simplified extension surfaces.',
    description:
      'Register a component section in the hidden iframe and render its view in the matching location iframe.',
    task: 'Change the positionId or locationId, then run the code again to move the rendered location view.',
    objective: 'Understand how positionId chooses a host surface and locationId chooses which iframe view gets rendered there.',
    runtimeLocationId: 'sw-main-hidden',
    starterCode: `if (location.is(location.MAIN_HIDDEN)) {
  ui.componentSection.add({
    component: 'card',
    positionId: 'after-primary-action',
    props: {
      title: 'Injected action card',
      subtitle: 'Rendered through a real SDK host message',
      locationId: 'meteor-location-card',
    },
  });
}

if (location.is('meteor-location-card')) {
  document.body.innerHTML = \
    '<div style="padding:16px;font:14px/1.6 Inter,sans-serif;color:#0f172a;">' +
    '<strong style="display:block;margin-bottom:8px;">Location iframe view</strong>' +
    '<span>This content is rendered because the host opened the matching locationId.</span>' +
    '</div>';

  location.updateHeight(140);
}`,
    previewLabel: 'Extension surfaces concept',
    outputMessage:
      'What to try: change the positionId or locationId and verify which host slot gets the location iframe.',
  },
];
