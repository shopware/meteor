import type { TutorialLessonManifest } from "../../../../catalog/types";

const lessonManifest: TutorialLessonManifest = {
  part: {
    id: "foundations",
    title: "Foundations",
    order: 1,
  },
  chapter: {
    id: "notifications",
    title: "Notifications",
    order: 1,
  },
  lesson: {
    id: "dispatch-notification",
    title: "Dispatch a notification",
    order: 1,
    summary: "Send a notification from the SDK and tune the feedback developers see in the fake admin shell.",
  },
  docsLinks: [
    {
      label: "Notification API reference",
      href: "/guide/api-reference/notification",
    },
  ],
  proseFile: "lesson.md",
  starterFile: "starter.ts",
  solutionFile: "solution.ts",
  supportFiles: ["support/fake-admin-log.ts"],
  primaryEditableFile: "starter.ts",
  scenario: {
    kind: "notification",
  },
};

export default lessonManifest;
