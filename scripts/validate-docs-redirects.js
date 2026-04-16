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

function normalizeRedirectValue(value, lineNumber, label) {
  const normalizedValue = stripQuotes(value.trim()).replace(/\\/g, "/");

  if (!normalizedValue) {
    throw new Error(`Line ${lineNumber}: redirect ${label} must not be empty`);
  }

  if (/^https?:\/\//i.test(normalizedValue)) {
    return normalizedValue;
  }

  if (normalizedValue.startsWith("/")) {
    throw new Error(
      `Line ${lineNumber}: redirect ${label} must be relative, got "${normalizedValue}"`
    );
  }

  if (normalizedValue.includes("?") || normalizedValue.includes("#")) {
    throw new Error(
      `Line ${lineNumber}: redirect ${label} must not contain query strings or hashes`
    );
  }

  const safePath = path.posix.normalize(normalizedValue);

  if (
    safePath === "." ||
    safePath === ".." ||
    safePath.startsWith("../")
  ) {
    throw new Error(
      `Line ${lineNumber}: redirect ${label} must stay inside docs/admin-sdk`
    );
  }

  return safePath;
}

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

    const rawSource = trimmedLine.slice(0, separatorIndex);
    const rawTarget = trimmedLine.slice(separatorIndex + 1);

    try {
      entries.push({
        lineNumber,
        source: normalizeRedirectValue(rawSource, lineNumber, "source"),
        target: normalizeRedirectValue(rawTarget, lineNumber, "target"),
      });
    } catch (error) {
      errors.push(error.message);
    }
  }

  if (!foundRedirects) {
    errors.push('Missing top-level "redirects:" section');
  }

  return { entries, errors };
}

function walkMarkdownFiles(dirPath) {
  const files = [];

  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    return files;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function toPublicPath(relativePath) {
  return relativePath.split(path.sep).join("/").replace(/\.md$/, ".html");
}

function collectCurrentPages() {
  return new Set(
    walkMarkdownFiles(docsRoot).map((filePath) =>
      toPublicPath(path.relative(docsRoot, filePath))
    )
  );
}

function validateRedirectEntries(entries, currentPages) {
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

    if (!entry.target.endsWith(".html")) {
      continue;
    }

    if (!currentPages.has(entry.target)) {
      errors.push(
        `Line ${entry.lineNumber}: redirect target "${entry.target}" does not match an existing page`
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
    const currentPages = collectCurrentPages();
    const parsedRedirects = parseRedirects();
    const errors = [
      ...parsedRedirects.errors,
      ...validateRedirectEntries(parsedRedirects.entries, currentPages),
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
