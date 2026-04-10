import type { TutorialCatalogPart, TutorialLessonCatalogEntry } from "./types";

function sortByOrder<TItem extends { order: number }>(items: TItem[]): TItem[] {
  return [...items].sort((left, right) => left.order - right.order);
}

export function normalizeCatalog(lessonEntries: readonly TutorialLessonCatalogEntry[]): TutorialCatalogPart[] {
  const parts = new Map<string, TutorialCatalogPart>();

  for (const lessonEntry of lessonEntries) {
    const { part, chapter } = lessonEntry;
    const existingPart = parts.get(part.id);

    if (!existingPart) {
      parts.set(part.id, {
        ...part,
        chapters: [
          {
            ...chapter,
            lessons: [lessonEntry],
          },
        ],
      });

      continue;
    }

    if (existingPart.title !== part.title || existingPart.order !== part.order) {
      throw new Error(`Duplicate part id "${part.id}" has conflicting metadata`);
    }

    const existingChapter = existingPart.chapters.find((candidate) => candidate.id === chapter.id);

    if (!existingChapter) {
      existingPart.chapters.push({
        ...chapter,
        lessons: [lessonEntry],
      });

      continue;
    }

    if (existingChapter.title !== chapter.title || existingChapter.order !== chapter.order) {
      throw new Error(`Duplicate chapter id "${chapter.id}" in part "${part.id}"`);
    }

    if (existingChapter.lessons.some((candidate) => candidate.lesson.id === lessonEntry.lesson.id)) {
      throw new Error(`Duplicate lesson id "${lessonEntry.lesson.id}" in chapter "${chapter.id}"`);
    }

    existingChapter.lessons.push(lessonEntry);
  }

  const orderedParts = sortByOrder(Array.from(parts.values())).map((part) => {
    return {
      ...part,
      chapters: sortByOrder(part.chapters).map((chapter) => ({
        ...chapter,
        lessons: sortByOrder(chapter.lessons.map((lesson) => ({
          ...lesson,
          order: lesson.lesson.order,
        }))).map(({ order: _order, ...lesson }) => lesson),
      })),
    };
  });

  return orderedParts;
}
