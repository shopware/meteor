import { notification } from "@shopware-ag/meteor-admin-sdk";

import { buildNotificationMessage } from "./support/fake-admin-log";

export async function runLesson(): Promise<void> {
  await notification.dispatch({
    title: "Draft notification",
    message: buildNotificationMessage("Replace this copy with a success message that feels finished."),
    variant: "info",
    appearance: "notification",
    growl: true,
  });
}
