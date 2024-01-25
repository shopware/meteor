import { expect, test as fact } from "vitest";
import { HardDiskFileSystem } from "./HardDiskFileSystem";
import fs from "node:fs";
import path from "node:path";

function cleanUp(pathToFile: string) {
  fs.existsSync(pathToFile) && fs.unlinkSync(pathToFile);

  const directory = path.join(__dirname, "./nested");
  fs.existsSync(directory) && fs.rmdirSync(directory);
}

fact("creates a file that did not exist before", () => {
  // GIVEN
  const pathToFile = path.join(__dirname, "./test.txt");
  cleanUp(pathToFile);

  const subject = new HardDiskFileSystem();

  // WHEN
  subject.saveFile(pathToFile, "Hello, World!");

  // THEN
  const result = fs.readFileSync(pathToFile, "utf8");
  expect(result).toBe("Hello, World!");

  // TEARDOWN
  cleanUp(pathToFile);
});

fact(
  "creates a new file in a nested directory that did not exist before",
  () => {
    // GIVEN
    const pathToFile = path.join(__dirname, "./nested/test.txt");
    cleanUp(pathToFile);

    const subject = new HardDiskFileSystem();

    // WHEN
    subject.saveFile(pathToFile, "Hello, Hell!");

    // THEN
    const result = fs.readFileSync(pathToFile, "utf8");
    expect(result).toBe("Hello, Hell!");

    // TEARDOWN
    cleanUp(pathToFile);
  }
);

fact.todo("overwrites a file that already exists");

fact.todo("overwrites a file in a nested directory that already exists");
