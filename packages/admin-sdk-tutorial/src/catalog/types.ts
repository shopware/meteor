export interface TutorialPart {
  id: string;
  title: string;
  order: number;
}

export interface TutorialChapter {
  id: string;
  title: string;
  order: number;
}

export interface TutorialLesson {
  id: string;
  title: string;
  order: number;
  summary: string;
}

export interface TutorialDocsLink {
  label: string;
  href: string;
}

export interface TutorialLessonScenario {
  kind: "notification" | "location" | "position";
}

export interface TutorialLessonManifest {
  part: TutorialPart;
  chapter: TutorialChapter;
  lesson: TutorialLesson;
  docsLinks: TutorialDocsLink[];
  proseFile: string;
  starterFile: string;
  solutionFile: string;
  supportFiles: string[];
  // Phase 1 only supports a single learner-editable file, so this must match starterFile.
  primaryEditableFile: string;
  scenario: TutorialLessonScenario;
}
