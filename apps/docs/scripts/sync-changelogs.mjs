// Generates the docs "Changelog" page from the changeset-generated
// CHANGELOG.md of each published package. The page is fully generated and
// git-ignored, so it always mirrors the latest release. Each package is a tab
// (Component Library first). Run via the `sync:changelog` script (wired into
// pre dev/build/generate).
import { execFile } from "node:child_process";
import { readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");
const contentDir = resolve(here, "../content");
const outFile = resolve(contentDir, "1.getting-started/6.changelog.md");
// Older output locations to clean up when this script moves the page.
const stale = [
  resolve(contentDir, "7.changelog.md"),
  resolve(contentDir, "7.changelog"),
];
const fences = {
  tabItem: ":::",
  tabContent: "::::",
  changelogVersions: ":::::",
  changelogVersion: "::::::",
};
const changelogVersionUi = `:ui='{"container":"w-full max-w-none [&_ul]:my-0","title":"text-3xl font-bold"}'`;

// Order here is the tab order; Component Library is first.
const packages = [
  {
    dir: "packages/component-library",
    title: "Component Library",
    icon: "i-lucide-blocks",
  },
  { dir: "packages/tokens", title: "Tokens", icon: "i-lucide-palette" },
  { dir: "packages/icon-kit", title: "Icon Kit", icon: "i-lucide-shapes" },
  {
    dir: "packages/stylelint-plugin-meteor",
    title: "Stylelint Plugin",
    icon: "i-lucide-check-check",
  },
];

// Walks `body` line by line, tracking fenced-code-block state the CommonMark
// way: a run of >=3 backticks or tildes opens a fence, and only a run of the
// same character that is at least as long (with no info string) closes it. This
// avoids the desync a naive toggle hits when a ``` block contains a ~~~ line or
// a closing fence of a different length. `inFence` is true for the fence
// delimiter lines themselves and every line between them.
function eachLine(body, visit) {
  let fence = null; // delimiter string of the open fence, e.g. "```", or null
  for (const line of body.split("\n")) {
    const marker = /^\s*(`{3,}|~{3,})\s*(\S.*)?$/.exec(line);
    if (marker) {
      const delimiter = marker[1];
      if (!fence) {
        fence = delimiter;
      } else if (
        delimiter[0] === fence[0] &&
        delimiter.length >= fence.length &&
        !marker[2]
      ) {
        fence = null;
      }
      visit(line, true);
      continue;
    }
    visit(line, Boolean(fence));
  }
}

// Escape `<` and `>` in prose so changeset entries that contain raw tag-like
// text (e.g. "use <Teleport /> for <mt-floating-ui />") render as literal text
// instead of being parsed as (unresolvable) MDC/Vue components.
function escapeAngles(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Neutralize a leading run of >=2 colons so changeset prose that documents MDC
// container syntax (e.g. "::callout" or ":::card") is not parsed as an
// unresolvable container. The HTML entity renders as a literal colon.
function escapeContainerFence(line) {
  return line.replace(/^(\s*):(:+)/, "$1&#58;$2");
}

// Escape a single prose line outside inline code spans, leaving the spans
// verbatim. Operates on author prose only, never on generated MDC fences.
function escapeProseLine(line) {
  const escaped = escapeContainerFence(line);
  const codeSpan = /(`+)(?:(?!\1).)*\1/g;
  let out = "";
  let last = 0;
  let m;
  while ((m = codeSpan.exec(escaped)) !== null) {
    out += escapeAngles(escaped.slice(last, m.index)) + m[0];
    last = codeSpan.lastIndex;
  }
  return out + escapeAngles(escaped.slice(last));
}

function sanitizeProse(body) {
  const out = [];
  eachLine(body, (line, inFence) => {
    out.push(inFence ? line : escapeProseLine(line));
  });
  return out.join("\n");
}

function stripH1Headings(body) {
  const out = [];
  eachLine(body, (line, inFence) => {
    if (inFence || !/^\s{0,3}#(?!#)(?:\s+|$)/.test(line)) out.push(line);
  });
  return out.join("\n");
}

async function packageName(pkg) {
  const pkgJsonPath = resolve(repoRoot, pkg.dir, "package.json");
  const pkgJson = JSON.parse(await readFile(pkgJsonPath, "utf8"));
  return pkgJson.name;
}

function mdcAttr(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, " ");
}

async function releaseDatesForPackage(packageName) {
  try {
    const { stdout } = await execFileAsync(
      "git",
      [
        "tag",
        "--list",
        `${packageName}@*`,
        "--format=%(refname:short)%09%(creatordate:short)",
      ],
      { cwd: repoRoot },
    );

    const dates = new Map();
    const prefix = `${packageName}@`;
    for (const line of stdout.trim().split("\n")) {
      if (!line) continue;
      const [tag, date] = line.split("\t");
      if (!tag?.startsWith(prefix) || !date) continue;
      dates.set(tag.slice(prefix.length), date);
    }
    return dates;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[sync-changelogs] skipped release dates for ${packageName}: ${message}`,
    );
    return new Map();
  }
}

function renderChangelogVersions(body, releaseDates) {
  const intro = [];
  const versions = [];
  let current = null;

  function pushCurrent() {
    if (!current) return;
    versions.push(current);
    current = null;
  }

  eachLine(body, (line, inFence) => {
    // Changesets emit each release as a top-level `## x.y.z` heading, so match
    // that exact shape; anything else (prose, code, deeper headings) is body.
    const match =
      !inFence &&
      /^(\s{0,3})##\s+(\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?)\s*$/.exec(line);

    if (match) {
      pushCurrent();
      current = {
        version: match[2],
        date: releaseDates.get(match[2]),
        lines: [],
      };
      return;
    }

    (current ? current.lines : intro).push(line);
  });
  pushCurrent();

  const renderedVersions = versions
    .map((entry) => {
      const date = entry.date ? ` date="${mdcAttr(entry.date)}"` : "";
      const body = entry.lines.join("\n").trim();
      return `${fences.changelogVersion}u-changelog-version{title="${mdcAttr(entry.version)}"${date} :indicator="false" ${changelogVersionUi}}\n\n#body\n\n${body}\n\n${fences.changelogVersion}`;
    })
    .join("\n\n");

  return [
    intro.join("\n").trim(),
    `${fences.changelogVersions}u-changelog-versions{:indicator="false"}\n\n${renderedVersions}\n\n${fences.changelogVersions}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function tabFor(pkg, body, releaseDates) {
  // Sanitize the raw changelog prose first (drop package-level H1s — the tab
  // label already names the package — then escape angle/container syntax), and
  // only then wrap it in our own MDC fences so sanitization never touches them.
  const prose = sanitizeProse(stripH1Headings(body));
  const content = renderChangelogVersions(prose, releaseDates).trim();
  return `${fences.tabItem}tabs-item{label="${pkg.title}" icon="${pkg.icon}"}\n\n${fences.tabContent}div{class="*:first:mt-0 *:last:mb-0"}\n\n${content}\n\n${fences.tabContent}\n\n${fences.tabItem}`;
}

async function run() {
  const tabs = [];
  for (const pkg of packages) {
    const changelogPath = resolve(repoRoot, pkg.dir, "CHANGELOG.md");
    if (!existsSync(changelogPath)) {
      console.warn(`[sync-changelogs] skipped: no CHANGELOG at ${pkg.dir}`);
      continue;
    }
    const name = await packageName(pkg);
    const releaseDates = await releaseDatesForPackage(name);
    tabs.push(tabFor(pkg, await readFile(changelogPath, "utf8"), releaseDates));
  }

  const page = `---
title: Changelog
description: Release notes for Meteor's documented packages, organized by package and listed newest first.
---

::tabs{variant="pill"}

${tabs.join("\n\n")}

::
`;

  // Remove output from earlier layouts/locations if still around.
  for (const path of stale) {
    await rm(path, { recursive: true, force: true });
  }
  await writeFile(outFile, page);

  console.log(
    `[sync-changelogs] wrote ${tabs.length} changelog tab(s) to content/1.getting-started/6.changelog.md`,
  );
}

run().catch((error) => {
  console.error("[sync-changelogs] failed:", error);
  process.exit(1);
});
