// Are the types wrong doesn't expand the "./*" export pattern, so every file in src/exports is
// passed as an entry point.
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const entrypoints = fs
  .readdirSync(new URL("../src/exports", import.meta.url))
  .map((file) => `./${file.replace(/\.ts$/, "")}`);

execFileSync(
  "attw",
  [
    "--pack",
    ".",
    "--profile",
    "esm-only",
    "--format",
    "table-flipped",
    "--entrypoints",
    ".",
    ...entrypoints,
  ],
  { stdio: "inherit" },
);
