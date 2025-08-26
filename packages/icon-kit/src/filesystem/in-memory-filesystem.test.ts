import { InMemoryFilesystem } from "./in-memory-filessytem.js";
import { test, expect } from "vitest";

test("creates a file", () => {
  // ARRANGE
  const subject = new InMemoryFilesystem();

  // ACT
  subject.createFile("./foo.txt", "Hello, world");

  // ASSERT
  expect(subject.readFile("./foo.txt")).toBe("Hello, world");
});

test("reads a file", () => {
  // ARRANGE
  const subject = new InMemoryFilesystem();
  subject.createFile("./foo.txt", "Hello, world");

  // ACT
  const result = subject.readFile("./foo.txt");

  // ASSERT
  expect(result).toBe("Hello, world");
});

test("returns undefined when reading a non-existing file", () => {
  // ARRANGE
  const subject = new InMemoryFilesystem();

  // ACT
  const result = subject.readFile("./foo.txt");

  // ASSERT
  expect(result).toBeUndefined();
});

test("creates a directory", () => {
  // ARRANGE
  const subject = new InMemoryFilesystem();

  // ACT
  subject.createDirectory("./foo");
});

test("removes a directory", () => {
  // ARRANGE
  const subject = new InMemoryFilesystem();
  subject.createDirectory("./foo");

  // ACT
  subject.removeDirectory("./foo");

  // ASSERT
  expect(subject.readFile("./foo.txt")).toBeUndefined();
});
