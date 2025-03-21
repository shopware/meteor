import { test, expect, vi } from "vitest";
import { NodeFilesystem } from "./node-filesystem.js";
import fs from "node:fs";

vi.mock("node:fs", () => {
  return {
    default: {
      writeFileSync: () => null,
      readFileSync: () => null,
    },
  };
});

test("creates a file", () => {
  // ARRANGE
  const spy = vi.spyOn(fs, "writeFileSync");

  const subject = new NodeFilesystem();

  // ACT
  subject.createFile("./foo.txt", "Hello, world");

  // ASSERT
  expect(spy).toHaveBeenCalledExactlyOnceWith("./foo.txt", "Hello, world");
});

test("reads a file", () => {
  // ARRANGE
  const subject = new NodeFilesystem();
  vi.spyOn(fs, "readFileSync").mockReturnValue("Hello, world");

  // ACT
  const result = subject.readFile("./foo.txt");

  // ASSERT
  expect(result).toBe("Hello, world");
});

test("returns undefined when reading a non-existing file", () => {
  // ARRANGE
  const subject = new NodeFilesystem();
  // @ts-expect-error -- fix later
  vi.spyOn(fs, "readFileSync").mockReturnValue(undefined);

  // ACT
  const result = subject.readFile("./foo.txt");

  // ASSERT
  expect(result).toBe(undefined);
});
