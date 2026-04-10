import { notification } from "@shopware-ag/meteor-admin-sdk";

import { buildNotificationMessage } from "./support/fake-admin-log";

export async function runLesson(): Promise<void> {
  await notification.dispatch({
    title: "Profile synced",
    message: buildNotificationMessage("The fake admin shell received your SDK notification."),
    variant: "success",
    appearance: "notification",
    growl: true,
  });
}
