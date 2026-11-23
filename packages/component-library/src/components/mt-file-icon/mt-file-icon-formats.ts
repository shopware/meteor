export type MtFileIconCategory =
  | "document"
  | "presentation"
  | "vector"
  | "archive"
  | "table"
  | "image"
  | "video"
  | "audio"
  | "subtitle"
  | "3d"
  | "markup"
  | "font"
  | "executable";

/** Format families whose label uses the color of their brand */
export type MtFileIconBrand = "pdf" | "word" | "excel";

/** The icon of each category. The zipper of archives hangs from the top edge of the page. */
export const categoryIcons: Record<MtFileIconCategory, { icon: string; align?: "top" }> = {
  document: { icon: "bars" },
  presentation: { icon: "chart-pie" },
  vector: { icon: "vector-graphics" },
  archive: { icon: "zipper", align: "top" },
  table: { icon: "table" },
  image: { icon: "image" },
  video: { icon: "video" },
  audio: { icon: "volume-up" },
  subtitle: { icon: "closed-captioning" },
  "3d": { icon: "3d" },
  markup: { icon: "code" },
  font: { icon: "bold" },
  executable: { icon: "window" },
};

export const fileIconCategories = Object.keys(categoryIcons) as MtFileIconCategory[];

/** The extensions of each category. `markup` covers markup, data and source code files. */
export const fileIconFormats: Record<MtFileIconCategory, string[]> = {
  document: ["txt", "pdf", "doc", "docx", "odt", "rtf", "pages", "epub", "log"],
  presentation: ["ppt", "pptx", "pps", "ppsx", "key", "odp"],
  vector: ["svg", "eps", "ai", "cdr", "sketch", "fig"],
  archive: ["zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz", "zst", "jar", "iso"],
  table: ["xls", "xlsx", "xlsm", "csv", "tsv", "ods", "numbers"],
  image: [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "avif",
    "heic",
    "heif",
    "bmp",
    "tif",
    "tiff",
    "ico",
    "psd",
  ],
  video: ["mov", "mp4", "m4v", "webm", "avi", "mkv", "wmv", "mpg", "mpeg", "flv", "3gp", "ogv"],
  audio: ["mp3", "wav", "ogg", "oga", "flac", "aac", "m4a", "wma", "opus", "aiff", "mid", "midi"],
  subtitle: ["srt", "vtt", "ass", "ssa", "sub"],
  "3d": [
    "glb",
    "gltf",
    "obj",
    "stl",
    "fbx",
    "usdz",
    "dae",
    "ply",
    "3ds",
    "3mf",
    "blend",
    "dwg",
    "dxf",
    "step",
    "stp",
  ],
  markup: [
    "html",
    "htm",
    "xml",
    "json",
    "yaml",
    "yml",
    "toml",
    "md",
    "css",
    "scss",
    "less",
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "tsx",
    "vue",
    "twig",
    "php",
    "py",
    "rb",
    "java",
    "go",
    "rs",
    "c",
    "cpp",
    "h",
    "cs",
    "swift",
    "kt",
    "sql",
    "sh",
  ],
  font: ["ttf", "otf", "woff", "woff2", "eot"],
  executable: ["exe", "msi", "bat", "dmg", "pkg", "apk", "deb", "rpm", "bin"],
};

const brands: Record<string, MtFileIconBrand> = {
  pdf: "pdf",
  doc: "word",
  docx: "word",
  xls: "excel",
  xlsx: "excel",
  xlsm: "excel",
};

/** The extension of each MIME type whose subtype does not already name it */
const mimeTypeExtensions: Record<string, string> = {
  "text/plain": "txt",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.oasis.opendocument.text": "odt",
  "application/rtf": "rtf",
  "text/rtf": "rtf",
  "application/epub+zip": "epub",

  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx",
  "application/vnd.apple.keynote": "key",
  "application/vnd.oasis.opendocument.presentation": "odp",

  "image/svg+xml": "svg",
  "application/postscript": "eps",
  "application/illustrator": "ai",

  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
  "application/vnd.rar": "rar",
  "application/x-rar-compressed": "rar",
  "application/x-7z-compressed": "7z",
  "application/x-tar": "tar",
  "application/gzip": "gz",
  "application/x-gzip": "gz",
  "application/x-bzip2": "bz2",
  "application/x-xz": "xz",
  "application/zstd": "zst",
  "application/java-archive": "jar",
  "application/x-iso9660-image": "iso",

  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel.sheet.macroenabled.12": "xlsm",
  "text/csv": "csv",
  "text/tab-separated-values": "tsv",
  "application/vnd.oasis.opendocument.spreadsheet": "ods",

  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/bmp": "bmp",
  "image/tiff": "tiff",
  "image/vnd.microsoft.icon": "ico",
  "image/x-icon": "ico",
  "image/vnd.adobe.photoshop": "psd",

  "video/quicktime": "mov",
  "video/mp4": "mp4",
  "video/x-m4v": "m4v",
  "video/webm": "webm",
  "video/x-msvideo": "avi",
  "video/x-matroska": "mkv",
  "video/x-ms-wmv": "wmv",
  "video/mpeg": "mpg",
  "video/x-flv": "flv",
  "video/3gpp": "3gp",
  "video/ogg": "ogv",

  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/flac": "flac",
  "audio/aac": "aac",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/x-ms-wma": "wma",
  "audio/opus": "opus",
  "audio/aiff": "aiff",
  "audio/midi": "mid",

  "application/x-subrip": "srt",
  "text/vtt": "vtt",

  "model/gltf-binary": "glb",
  "model/gltf+json": "gltf",
  "model/obj": "obj",
  "model/stl": "stl",
  "model/vnd.usdz+zip": "usdz",
  "model/vnd.collada+xml": "dae",
  "model/3mf": "3mf",
  "image/vnd.dwg": "dwg",
  "image/vnd.dxf": "dxf",
  "model/step": "step",

  "text/html": "html",
  "application/xml": "xml",
  "text/xml": "xml",
  "application/json": "json",
  "application/yaml": "yaml",
  "application/toml": "toml",
  "text/markdown": "md",
  "text/css": "css",
  "text/javascript": "js",
  "application/javascript": "js",
  "application/typescript": "ts",
  "application/x-httpd-php": "php",
  "text/x-python": "py",
  "application/sql": "sql",
  "application/x-sh": "sh",

  "font/ttf": "ttf",
  "font/otf": "otf",
  "font/woff": "woff",
  "font/woff2": "woff2",
  "application/vnd.ms-fontobject": "eot",

  "application/vnd.microsoft.portable-executable": "exe",
  "application/x-msi": "msi",
  "application/x-apple-diskimage": "dmg",
  "application/vnd.android.package-archive": "apk",
  "application/vnd.debian.binary-package": "deb",
  "application/x-rpm": "rpm",
};

const mimeTypePrefixes: Record<string, MtFileIconCategory> = {
  "image/": "image",
  "video/": "video",
  "audio/": "audio",
  "model/": "3d",
  "font/": "font",
  "text/": "document",
};

const extensionCategories = new Map<string, MtFileIconCategory>(
  fileIconCategories.flatMap((category) =>
    fileIconFormats[category].map((extension) => [extension, category] as const),
  ),
);

function normalizeExtension(value?: string): string | undefined {
  const extension = value?.trim().replace(/^\./, "").toLowerCase();

  return extension || undefined;
}

function normalizeMimeType(value?: string): string | undefined {
  const mimeType = value?.split(";")[0].trim().toLowerCase();

  return mimeType || undefined;
}

function extensionFromFileName(fileName?: string): string | undefined {
  // Ignores the query and hash of URLs, and dot files such as `.env` that have no extension
  const name = fileName?.split(/[?#]/)[0].split(/[\\/]/).pop() ?? "";
  const dotIndex = name.lastIndexOf(".");

  return dotIndex > 0 ? normalizeExtension(name.slice(dotIndex + 1)) : undefined;
}

function categoryFromMimeType(mimeType?: string): MtFileIconCategory | undefined {
  if (!mimeType) return undefined;

  const prefix = Object.keys(mimeTypePrefixes).find((key) => mimeType.startsWith(key));

  return prefix ? mimeTypePrefixes[prefix] : undefined;
}

export type ResolvedFileIcon = {
  /** The category, when it is given or can be derived */
  category?: MtFileIconCategory;
  /** The format label in capitals, such as `PDF`, when it is given or can be derived */
  format?: string;
  /** The brand whose color the format label uses */
  brand?: MtFileIconBrand;
};

/**
 * Works out the category and format label of a file. An explicit `format` or `category` wins over
 * what the file name or MIME type say, and the file name wins over the MIME type.
 */
export function resolveFileIcon(input: {
  fileName?: string;
  mimeType?: string;
  format?: string;
  category?: MtFileIconCategory;
}): ResolvedFileIcon {
  const mimeType = normalizeMimeType(input.mimeType);
  const mimeTypeExtension = mimeType ? mimeTypeExtensions[mimeType] : undefined;
  const extension =
    normalizeExtension(input.format) ?? extensionFromFileName(input.fileName) ?? mimeTypeExtension;
  const known = (value?: string) => (value ? extensionCategories.get(value) : undefined);

  return {
    category:
      input.category ??
      known(extension) ??
      known(mimeTypeExtension) ??
      categoryFromMimeType(mimeType),
    format: extension?.toUpperCase(),
    brand: extension ? brands[extension] : undefined,
  };
}
