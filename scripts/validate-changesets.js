#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Recursively find all package.json files under given directories
 * @param {string[]} searchPaths - Array of root paths to search
 * @returns {string[]} Array of package names found
 */
function discoverPackageNames(searchPaths) {
  const packageNames = new Set();

  function walkDirectory(dirPath) {
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      return;
    }

    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // Don't follow symlinks outside the repo or into node_modules
          if (
            entry.isSymbolicLink() ||
            entry.name === "node_modules" ||
            entry.name === ".git"
          ) {
            continue;
          }
          walkDirectory(fullPath);
        } else if (entry.name === "package.json") {
          try {
            const packageJson = JSON.parse(fs.readFileSync(fullPath, "utf8"));
            if (packageJson.name && typeof packageJson.name === "string") {
              packageNames.add(packageJson.name.trim());
            }
          } catch (err) {
            // Skip invalid package.json files
            console.warn(
              `Warning: Could not parse ${fullPath}: ${err.message}`
            );
          }
        }
      }
    } catch (err) {
      console.warn(
        `Warning: Could not read directory ${dirPath}: ${err.message}`
      );
    }
  }

  searchPaths.forEach((searchPath) => {
    if (fs.existsSync(searchPath)) {
      walkDirectory(searchPath);
    }
  });

  return Array.from(packageNames).sort();
}

/**
 * Parse YAML frontmatter from changeset content
 * @param {string} content - The changeset file content
 * @returns {Object|null} Parsed frontmatter object or null if invalid
 */
function parseFrontmatter(content) {
  const lines = content.split("\n");

  // Must start with ---
  if (lines[0] !== "---") {
    return null;
  }

  // Find closing ---
  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    return null;
  }

  const yamlContent = lines.slice(1, endIndex).join("\n").trim();
  if (!yamlContent) {
    return {};
  }

  try {
    // Simple YAML parser for the specific changeset format
    const result = {};
    const yamlLines = yamlContent.split("\n");

    for (const line of yamlLines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("#")) {
        continue;
      }

      const colonIndex = trimmedLine.indexOf(":");
      if (colonIndex === -1) {
        throw new Error(`Invalid YAML line: ${trimmedLine}`);
      }

      let key = trimmedLine.substring(0, colonIndex).trim();
      let value = trimmedLine.substring(colonIndex + 1).trim();

      // Remove quotes from key if present
      if (
        (key.startsWith('"') && key.endsWith('"')) ||
        (key.startsWith("'") && key.endsWith("'"))
      ) {
        key = key.slice(1, -1);
      }

      // Remove quotes from value if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      // Validate bump type
      if (!["major", "minor", "patch"].includes(value)) {
        throw new Error(
          `Invalid bump type "${value}". Must be one of: major, minor, patch`
        );
      }

      result[key] = value;
    }

    return result;
  } catch (err) {
    throw new Error(`Failed to parse YAML frontmatter: ${err.message}`);
  }
}

/**
 * Find and validate all changeset files
 * @param {string[]} validPackageNames - Array of valid package names
 * @returns {Object} Validation results
 */
function validateChangesets(validPackageNames) {
  const changesetDir = path.join(process.cwd(), ".changeset");

  if (!fs.existsSync(changesetDir)) {
    return { valid: true, errors: [] };
  }

  const files = fs
    .readdirSync(changesetDir)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => path.join(changesetDir, file));

  if (files.length === 0) {
    return { valid: true, errors: [] };
  }

  const errors = [];
  const validPackageSet = new Set(validPackageNames);

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const frontmatter = parseFrontmatter(content);

      if (!frontmatter) {
        errors.push({
          file: path.relative(process.cwd(), filePath),
          issues: ["Invalid or missing YAML frontmatter"],
        });
        continue;
      }

      const invalidPackages = [];
      for (const packageName of Object.keys(frontmatter)) {
        const trimmedName = packageName.trim();
        if (!validPackageSet.has(trimmedName)) {
          invalidPackages.push(trimmedName);
        }
      }

      if (invalidPackages.length > 0) {
        errors.push({
          file: path.relative(process.cwd(), filePath),
          issues: invalidPackages.map(
            (pkg) => `"${pkg}" is not a known package`
          ),
        });
      }
    } catch (err) {
      errors.push({
        file: path.relative(process.cwd(), filePath),
        issues: [`Failed to process file: ${err.message}`],
      });
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Main validation function
 */
function main() {
  try {
    // Discover packages from packages/ and apps/ directories
    const searchPaths = [
      path.join(process.cwd(), "packages"),
      path.join(process.cwd(), "apps"),
    ];

    const packageNames = discoverPackageNames(searchPaths);

    if (packageNames.length === 0) {
      console.error("No packages found in packages/ or apps/ directories");
      process.exit(1);
    }

    // Validate changesets
    const result = validateChangesets(packageNames);

    if (result.valid) {
      // Success - no output or minimal success message
      process.exit(0);
    }

    // Print errors
    console.error("Changesets package name validation failed:\n");

    for (const error of result.errors) {
      console.error(`${error.file}`);
      for (const issue of error.issues) {
        console.error(`  - ${issue}`);
      }
      console.error("");
    }

    console.error("Available packages:");
    for (const packageName of packageNames) {
      console.error(`  - ${packageName}`);
    }

    process.exit(1);
  } catch (err) {
    console.error(`Validation script failed: ${err.message}`);
    process.exit(1);
  }
}

// Run the script
main();
