import { expect, test as fact } from "vitest";
import { HardDiskFileSystem } from "./HardDiskFileSystem";
import fs from "node:fs";
import path from "node:path";

fact("creates a file that did not exist before", () => {
  // GIVEN
  const pathToFile = path.join(__dirname, "./test.txt");

  fs.existsSync(pathToFile) && fs.unlinkSync(pathToFile);
  const subject = new HardDiskFileSystem();

  // WHEN
  subject.saveFile(pathToFile, "Hello, World!");

  // THEN
  const result = fs.readFileSync(pathToFile, "utf8");
  expect(result).toBe("Hello, World!");
});
