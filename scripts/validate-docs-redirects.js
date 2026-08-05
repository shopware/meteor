#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = process.cwd();
const docsRoot = path.join(repoRoot, "docs", "admin-sdk");
const redirectsFile = path.join(docsRoot, "docs.yml");
const docsRootRepoPath = "docs/admin-sdk";

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

/**
 * Parse the flat "redirects:" mapping from docs.yml with a minimal
 * line-based parser, so the script runs without any YAML dependency.
 * Values are only unquoted and trimmed — a malformed path is caught
 * later because it never matches an existing page or file.
 * Parse errors are collected instead of aborting on the first one.
 * @returns {{entries: Array<{lineNumber: number, source: string, target: string}>, errors: string[]}}
 */
function parseRedirects() {
  if (!fs.existsSync(redirectsFile)) {
    throw new Error(`Redirect config not found: ${redirectsFile}`);
  }

  const lines = fs.readFileSync(redirectsFile, "utf8").split(/\r?\n/);
  const entries = [];
  const errors = [];
  let insideRedirects = false;
  let foundRedirects = false;

  for (let index = 0; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    const line = lines[index];
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    if (!insideRedirects) {
      if (trimmedLine === "redirects:") {
        insideRedirects = true;
        foundRedirects = true;
      }
      continue;
    }

    if (!/^\s+/.test(line)) {
      break;
    }

    const separatorIndex = trimmedLine.indexOf(":");
    if (separatorIndex === -1) {
      errors.push(`Line ${lineNumber}: invalid redirect entry`);
      continue;
    }

    const source = stripQuotes(trimmedLine.slice(0, separatorIndex).trim());
    const target = stripQuotes(trimmedLine.slice(separatorIndex + 1).trim());

    if (!source || !target) {
      errors.push(`Line ${lineNumber}: invalid redirect entry`);
      continue;
    }

    entries.push({ lineNumber, source, target });
  }

  if (!foundRedirects) {
    errors.push('Missing top-level "redirects:" section');
  }

  return { entries, errors };
}

/**
 * Recursively collect all file paths below a directory.
 * @param {string} dirPath - Absolute directory to walk
 * @returns {string[]} Absolute file paths
 */
function walkFiles(dirPath) {
  const files = [];

  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    return files;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Index the docs content redirect targets are validated against.
 * `currentPages` holds the public .html paths derived from .md files,
 * `currentFiles` holds every file (e.g. assets) relative to docs/admin-sdk.
 * @returns {{currentFiles: Set<string>, currentPages: Set<string>}}
 */
function collectDocsFiles() {
  const relativeFiles = walkFiles(docsRoot).map((filePath) =>
    path.relative(docsRoot, filePath).split(path.sep).join("/")
  );

  return {
    currentFiles: new Set(relativeFiles),
    currentPages: new Set(
      relativeFiles
        .filter((relativePath) => relativePath.endsWith(".md"))
        .map((relativePath) => relativePath.replace(/\.md$/, ".html"))
    ),
  };
}

/**
 * Validate parsed redirect entries: no duplicate or self-referencing
 * sources, sources must no longer exist as pages, and every target must
 * resolve to an existing page (.html) or file — not to another redirect.
 * @param {Array<{lineNumber: number, source: string, target: string}>} entries
 * @param {Set<string>} currentPages - Public .html paths of existing pages
 * @param {Set<string>} currentFiles - All existing files in docs/admin-sdk
 * @returns {string[]} Human-readable validation errors
 */
function validateRedirectEntries(entries, currentPages, currentFiles) {
  const errors = [];
  const seenSources = new Map();
  const redirectSources = new Set(entries.map((entry) => entry.source));

  for (const entry of entries) {
    if (seenSources.has(entry.source)) {
      errors.push(
        `Line ${entry.lineNumber}: duplicate redirect source "${entry.source}" (already defined on line ${seenSources.get(entry.source)})`
      );
      continue;
    }

    seenSources.set(entry.source, entry.lineNumber);

    if (entry.source === entry.target) {
      errors.push(
        `Line ${entry.lineNumber}: redirect "${entry.source}" points to itself`
      );
    }

    if (entry.source.endsWith(".html") && currentPages.has(entry.source)) {
      errors.push(
        `Line ${entry.lineNumber}: redirect source "${entry.source}" still exists as a page`
      );
    }

    if (entry.target.endsWith(".html")) {
      if (!currentPages.has(entry.target)) {
        errors.push(
          `Line ${entry.lineNumber}: redirect target "${entry.target}" does not match an existing page`
        );
      }
    } else if (!currentFiles.has(entry.target)) {
      errors.push(
        `Line ${entry.lineNumber}: redirect target "${entry.target}" does not match an existing file`
      );
    }

    if (redirectSources.has(entry.target)) {
      errors.push(
        `Line ${entry.lineNumber}: redirect target "${entry.target}" points to another redirect`
      );
    }
  }

  return errors;
}

/**
 * Map a repo path from git output to the public .html path used in
 * docs.yml, e.g. "docs/admin-sdk/concepts/foo.md" -> "concepts/foo.html".
 * @param {string} repoPath - Path relative to the repository root
 * @returns {string|null} Public path, or null for files outside
 *   docs/admin-sdk or non-markdown files
 */
function repoPathToPublicPath(repoPath) {
  const normalizedPath = repoPath.replace(/\\/g, "/");
  const relativePath = path.posix.relative(docsRootRepoPath, normalizedPath);

  if (
    !relativePath ||
    relativePath === "." ||
    relativePath.startsWith("../") ||
    !relativePath.endsWith(".md")
  ) {
    return null;
  }

  return relativePath.replace(/\.md$/, ".html");
}

/**
 * Diff docs/admin-sdk against a base ref (merge-base semantics via
 * "baseRef...HEAD") and return the public paths of markdown pages that
 * were deleted or renamed away — the pages that now need a redirect.
 * @param {string} baseRef - Git ref to compare against, e.g. "origin/main"
 * @returns {string[]} Sorted public paths of removed pages
 */
function findRemovedMarkdownPages(baseRef) {
  try {
    const output = execFileSync(
      "git",
      [
        "diff",
        "--name-status",
        "--find-renames",
        `${baseRef}...HEAD`,
        "--",
        docsRootRepoPath,
      ],
      {
        cwd: repoRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }
    );
    const removedPages = new Set();

    output
      .split(/\r?\n/)
      .filter(Boolean)
      .forEach((line) => {
        const parts = line.split("\t");
        const status = parts[0];

        if (status.startsWith("D")) {
          const removedPage = repoPathToPublicPath(parts[1]);
          if (removedPage) {
            removedPages.add(removedPage);
          }
          return;
        }

        if (status.startsWith("R")) {
          const oldPage = repoPathToPublicPath(parts[1]);
          const newPage = repoPathToPublicPath(parts[2]);

          if (oldPage && oldPage !== newPage) {
            removedPages.add(oldPage);
          }
        }
      });

    return Array.from(removedPages).sort();
  } catch {
    throw new Error(
      `Failed to compare docs against "${baseRef}". Make sure the ref exists locally.`
    );
  }
}

/**
 * Report every removed page that has no redirect entry pointing away
 * from its old location.
 * @param {string[]} removedPages - Public paths of removed pages
 * @param {Array<{source: string}>} entries - Parsed redirect entries
 * @returns {string[]} Human-readable validation errors
 */
function validateRemovedPagesHaveRedirects(removedPages, entries) {
  const errors = [];
  const redirectSources = new Set(entries.map((entry) => entry.source));

  removedPages.forEach((page) => {
    if (!redirectSources.has(page)) {
      errors.push(`Removed page "${page}" is missing a redirect entry`);
    }
  });

  return errors;
}

function main() {
  try {
    let args = process.argv.slice(2);

    if (args[0] === "--") {
      args = args.slice(1);
    }

    if (args.length > 1) {
      throw new Error("Expected at most one base ref argument");
    }

    const baseRef = args[0] || null;
    const { currentPages, currentFiles } = collectDocsFiles();
    const parsedRedirects = parseRedirects();
    const errors = [
      ...parsedRedirects.errors,
      ...validateRedirectEntries(
        parsedRedirects.entries,
        currentPages,
        currentFiles
      ),
    ];

    if (baseRef) {
      const removedPages = findRemovedMarkdownPages(baseRef);
      errors.push(
        ...validateRemovedPagesHaveRedirects(
          removedPages,
          parsedRedirects.entries
        )
      );
    }

    if (errors.length > 0) {
      console.error("Docs redirect validation failed:\n");
      errors.forEach((error) => console.error(`- ${error}`));
      process.exit(1);
    }

    console.log("Docs redirect validation passed.");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
