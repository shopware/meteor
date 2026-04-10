import type { TutorialLessonManifest } from "../../../../catalog/types";

const lessonManifest: TutorialLessonManifest = {
  part: {
    id: "foundations",
    title: "Foundations",
    order: 1,
  },
  chapter: {
    id: "hidden-location",
    title: "Hidden location",
    order: 2,
  },
  lesson: {
    id: "understand-hidden-location",
    title: "Understand the hidden location",
    order: 1,
    summary: "Separate hidden bootstrap work from visible rendering so location and position IDs stay understandable.",
  },
  docsLinks: [
    {
      label: "Locations concept guide",
      href: "/guide/concepts/locations",
    },
    {
      label: "Positions concept guide",
      href: "/guide/concepts/positions",
    },
  ],
  proseFile: "lesson.md",
  starterFile: "starter.ts",
  solutionFile: "solution.ts",
  supportFiles: ["support/location-constants.ts"],
  primaryEditableFile: "starter.ts",
  scenario: {
    kind: "location",
  },
};

export default lessonManifest;
