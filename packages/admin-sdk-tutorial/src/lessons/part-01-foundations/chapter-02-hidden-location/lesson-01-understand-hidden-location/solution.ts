import { location, ui } from "@shopware-ag/meteor-admin-sdk";

import {
  hiddenLocationLabel,
  lessonCardLocationId,
  lessonCardPositionId,
  renderedLocationLabel,
} from "./support/location-constants";

export function bootstrapLessonLocation(): string {
  if (location.is(location.MAIN_HIDDEN)) {
    ui.componentSection.add({
      component: "card",
      positionId: lessonCardPositionId,
      props: {
        title: "Tutorial lesson surface",
        subtitle: "The visible lesson UI is rendered in a separate location.",
        locationId: lessonCardLocationId,
      },
    });

    return `${hiddenLocationLabel}: created ${lessonCardLocationId} at ${lessonCardPositionId}.`;
  }

  if (location.is(lessonCardLocationId)) {
    return `${renderedLocationLabel}: render lesson UI inside ${lessonCardLocationId}.`;
  }

  return `Unknown location. Expected ${lessonCardLocationId}.`;
}
