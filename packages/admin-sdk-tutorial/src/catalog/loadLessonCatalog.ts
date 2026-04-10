import { normalizeCatalog } from "./normalizeCatalog";
import type { TutorialLessonCatalogEntry, TutorialLessonManifest } from "./types";

type LessonManifestModules = Record<string, TutorialLessonManifest>;
type LessonAssetModules = Record<string, string>;
type LessonCatalogModules = {
  manifests: LessonManifestModules;
  assets: LessonAssetModules;
};

const defaultLessonCatalogModules = {
  manifests: import.meta.glob("../lessons/**/lesson.manifest.ts", {
    import: "default",
    eager: true,
  }) as LessonManifestModules,
  assets: import.meta.glob("../lessons/**/*.{md,ts,js,vue,json}", {
    import: "default",
    eager: true,
    query: "?raw",
  }) as LessonAssetModules,
} satisfies LessonCatalogModules;

export function resolveLessonBundleFilePath(bundlePath: string, filePath: string): string {
  const normalizedFilePath = filePath.replace(/^\.\//, "");

  if (normalizedFilePath.startsWith("/")) {
    throw new Error(`Lesson bundle references must stay relative: "${filePath}"`);
  }

  if (normalizedFilePath.split("/").includes("..")) {
    throw new Error(`Lesson bundle references must not escape the lesson directory: "${filePath}"`);
  }

  return `${bundlePath}/${normalizedFilePath}`;
}

function readLessonBundleFile(bundlePath: string, filePath: string, assetModules: LessonAssetModules): string {
  const assetPath = resolveLessonBundleFilePath(bundlePath, filePath);
  const asset = assetModules[assetPath];

  if (typeof asset !== "string") {
    throw new Error(`Missing lesson asset "${filePath}" in bundle "${bundlePath}"`);
  }

  return asset;
}

function createLessonCatalogEntry(
  manifestPath: string,
  manifest: TutorialLessonManifest,
  assetModules: LessonAssetModules
): TutorialLessonCatalogEntry {
  const bundlePath = manifestPath.replace(/\/lesson\.manifest\.ts$/, "");
  const { proseFile, starterFile, solutionFile, supportFiles, primaryEditableFile } = manifest;

  if (primaryEditableFile !== starterFile) {
    throw new Error(
      `Lesson "${manifest.lesson.id}" must keep primaryEditableFile aligned with starterFile.`
    );
  }

  return {
    part: manifest.part,
    chapter: manifest.chapter,
    lesson: manifest.lesson,
    bundlePath,
    prose: readLessonBundleFile(bundlePath, proseFile, assetModules),
    starterFile,
    starterCode: readLessonBundleFile(bundlePath, starterFile, assetModules),
    solutionFile,
    solutionCode: readLessonBundleFile(bundlePath, solutionFile, assetModules),
    primaryEditableFile,
    supportFiles: supportFiles.map((supportFile) => ({
      path: supportFile,
      contents: readLessonBundleFile(bundlePath, supportFile, assetModules),
    })),
    docsLinks: manifest.docsLinks,
    scenario: manifest.scenario,
  };
}

export function loadLessonCatalogFromModules(modules: LessonCatalogModules) {
  const lessonEntries = Object.entries(modules.manifests).map(([manifestPath, manifest]) =>
    createLessonCatalogEntry(manifestPath, manifest, modules.assets)
  );

  return normalizeCatalog(lessonEntries);
}

export function loadLessonCatalog() {
  return loadLessonCatalogFromModules(defaultLessonCatalogModules);
}
