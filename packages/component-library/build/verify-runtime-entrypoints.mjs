import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const require = createRequire(import.meta.url);
const entries = [
  "MtDropdownMenuRoot",
  "MtDropdownMenuPortal",
  "MtDropdownMenuTrigger",
  "MtDropdownMenuSub",
  "useTheme",
  "useSnackbar",
];

function verifyModuleGraph(filename, seen = new Set()) {
  if (seen.has(filename)) return;
  seen.add(filename);
  assert.notEqual(filename, path.join(packageRoot, "dist/esm/index.js"));
  assert.ok(!/text-editor|tiptap|codemirror/i.test(filename), filename);
  const source = ts.createSourceFile(
    filename,
    readFileSync(filename, "utf8"),
    ts.ScriptTarget.Latest,
  );
  for (const statement of source.statements) {
    if (
      !ts.isImportDeclaration(statement) &&
      !ts.isExportDeclaration(statement)
    )
      continue;
    const specifier = statement.moduleSpecifier;
    if (
      !specifier ||
      !ts.isStringLiteral(specifier) ||
      !specifier.text.startsWith(".")
    )
      continue;
    const target = path.resolve(path.dirname(filename), specifier.text);
    assert.ok(
      [".js", ".mjs", ".cjs"].includes(path.extname(target)),
      `Unexpected asset dependency: ${target}`,
    );
    verifyModuleGraph(target, seen);
  }
}

for (const entry of entries) {
  for (const format of ["esm", "common"]) {
    assert.ok(
      readFileSync(path.join(packageRoot, "dist", format, `${entry}.d.ts`))
        .length,
    );
  }
  verifyModuleGraph(path.join(packageRoot, "dist/esm", `${entry}.js`));
  const common = require(path.join(packageRoot, "dist/common", `${entry}.js`));
  if (entry.startsWith("Mt")) {
    assert.ok(common.default);
    assert.equal(common.default, common[entry]);
  } else {
    assert.equal(typeof common[entry], "function");
  }
}

const fixture = mkdtempSync(path.join(tmpdir(), "meteor-runtime-entrypoints-"));
try {
  const scope = path.join(fixture, "node_modules/@shopware-ag");
  mkdirSync(scope, { recursive: true });
  symlinkSync(
    packageRoot,
    path.join(scope, "meteor-component-library"),
    "junction",
  );
  const filename = path.join(fixture, "consumer.ts");
  for (const [moduleResolution, module, suffix] of [
    [ts.ModuleResolutionKind.Node10, ts.ModuleKind.CommonJS, "/dist/esm"],
    [ts.ModuleResolutionKind.Bundler, ts.ModuleKind.ESNext, ""],
    [ts.ModuleResolutionKind.NodeNext, ts.ModuleKind.NodeNext, ""],
  ]) {
    const prefix = `@shopware-ag/meteor-component-library${suffix}`;
    const source = `
      import Root, { MtDropdownMenuRoot } from "${prefix}/MtDropdownMenuRoot";
      import Portal from "${prefix}/MtDropdownMenuPortal";
      import Trigger from "${prefix}/MtDropdownMenuTrigger";
      import Sub from "${prefix}/MtDropdownMenuSub";
      import { useTheme, type Theme, type UseThemeOptions } from "${prefix}/useTheme";
      import { useSnackbar, type Snackbar } from "${prefix}/useSnackbar";
      const sameRoot: typeof MtDropdownMenuRoot = Root;
      const theme: Theme = "dark";
      const options: UseThemeOptions = { storageKey: null, applyToTarget: false };
      useTheme(options).setTheme(theme);
      const notice: Omit<Snackbar, "id"> = { message: "Saved" };
      useSnackbar().addSnackbar(notice);
      export { sameRoot, Portal, Trigger, Sub };
    `;
    const options = {
      moduleResolution,
      module,
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      target: ts.ScriptTarget.ES2020,
      types: [],
    };
    const host = ts.createCompilerHost(options);
    const readFile = host.readFile.bind(host);
    const fileExists = host.fileExists.bind(host);
    host.readFile = (file) => (file === filename ? source : readFile(file));
    host.fileExists = (file) => file === filename || fileExists(file);
    const program = ts.createProgram([filename], options, host);
    const diagnostics = ts.getPreEmitDiagnostics(program);
    assert.equal(
      diagnostics.length,
      0,
      ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCanonicalFileName: (file) => file,
        getCurrentDirectory: () => fixture,
        getNewLine: () => "\n",
      }),
    );
  }
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
console.log(
  "Runtime entrypoints: ESM graphs, CommonJS exports and three TypeScript resolvers passed.",
);
