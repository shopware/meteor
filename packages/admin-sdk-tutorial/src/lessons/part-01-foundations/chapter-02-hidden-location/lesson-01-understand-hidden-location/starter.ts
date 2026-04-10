import { location } from "@shopware-ag/meteor-admin-sdk";

import {
  hiddenLocationLabel,
  lessonCardLocationId,
  lessonCardPositionId,
  renderedLocationLabel,
} from "./support/location-constants";

export function describeCurrentSurface(): string {
  if (location.is(location.MAIN_HIDDEN)) {
    return `${hiddenLocationLabel}: register your extension point at ${lessonCardPositionId}.`;
  }

  if (location.is(lessonCardLocationId)) {
    return `${renderedLocationLabel}: render the lesson card for ${lessonCardLocationId}.`;
  }

  return `Unknown location. Start by checking ${lessonCardPositionId} and ${lessonCardLocationId}.`;
}
