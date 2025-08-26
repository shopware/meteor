import { test, expect, vi } from "vitest";
import { NodeFilesystem } from "./node-filesystem.js";
import fs from "node:fs";
import { NoOpLogger } from "../logger/no-op-logger.js";

vi.mock("node:fs", () => {
  return {
    default: {
      writeFileSync: () => null,
      readFileSync: () => null,
      mkdirSync: () => null,
      rmSync: () => null,
    },
  };
});

test("creates a file", () => {
  // ARRANGE
  const spy = vi.spyOn(fs, "writeFileSync");

  const subject = new NodeFilesystem(new NoOpLogger());

  // ACT
  subject.createFile("./foo.txt", "Hello, world");

  // ASSERT
  expect(spy).toHaveBeenCalledExactlyOnceWith("./foo.txt", "Hello, world");
});

test("reads a file", () => {
  // ARRANGE
  const subject = new NodeFilesystem(new NoOpLogger());
  vi.spyOn(fs, "readFileSync").mockReturnValue("Hello, world");

  // ACT
  const result = subject.readFile("./foo.txt");

  // ASSERT
  expect(result).toBe("Hello, world");
});

test("returns undefined when reading a non-existing file", () => {
  // ARRANGE
  const subject = new NodeFilesystem(new NoOpLogger());
  // @ts-expect-error -- fix later
  vi.spyOn(fs, "readFileSync").mockReturnValue(undefined);

  // ACT
  const result = subject.readFile("./foo.txt");

  // ASSERT
  expect(result).toBe(undefined);
});

test("creates a directory", () => {
  // ARRANGE
  const subject = new NodeFilesystem(new NoOpLogger());
  const spy = vi.spyOn(fs, "mkdirSync");

  // ACT
  subject.createDirectory("./foo");

  // ASSERT
  expect(spy).toHaveBeenCalledExactlyOnceWith("./foo");
});

test("removes a directory", () => {
  // ARRANGE
  const subject = new NodeFilesystem(new NoOpLogger());
  const spy = vi.spyOn(fs, "rmSync");

  // ACT
  subject.removeDirectory("./foo");

  // ASSERT
  expect(spy).toHaveBeenCalledExactlyOnceWith("./foo", {
    recursive: true,
    force: true,
  });
});
