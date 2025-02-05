import { expect, test } from 'vitest';
import { HardDiskFileSystem } from './HardDiskFileSystem.js';
import fs from 'node:fs';
import path from 'node:path';

function cleanUp(pathToFile: string) {
  if (fs.existsSync(pathToFile)) fs.unlinkSync(pathToFile);

  const directory = path.join(__dirname, './artifact');
  if (fs.existsSync(directory)) fs.rmdirSync(directory);
}

test('creates a file that did not exist before', () => {
  // GIVEN
  const pathToFile = path.join(__dirname, './test.txt');
  cleanUp(pathToFile);

  const subject = new HardDiskFileSystem();

  // WHEN
  subject.saveFile(pathToFile, 'Hello, World!');

  // THEN
  const result = fs.readFileSync(pathToFile, 'utf8');
  expect(result).toBe('Hello, World!');

  // TEARDOWN
  cleanUp(pathToFile);
});

test('creates a new file in a nested directory that did not exist before', () => {
  // GIVEN
  const pathToFile = path.join(__dirname, './artifact/test.txt');
  cleanUp(pathToFile);

  const subject = new HardDiskFileSystem();

  // WHEN
  subject.saveFile(pathToFile, 'Hello, Hell!');

  // THEN
  const result = fs.readFileSync(pathToFile, 'utf8');
  expect(result).toBe('Hello, Hell!');

  // TEARDOWN
  cleanUp(pathToFile);
});

test('overwrites a file that already exists', () => {
  // GIVEN
  const pathToFile = path.join(__dirname, './test.txt');
  cleanUp(pathToFile);

  fs.writeFileSync(pathToFile, 'Hello, World!', { encoding: 'utf-8' });

  const subject = new HardDiskFileSystem();

  // WHEN
  subject.saveFile(pathToFile, 'Hello, Heaven!');

  // THEN
  const result = fs.readFileSync(pathToFile, 'utf8');
  expect(result).toBe('Hello, Heaven!');

  // TEARDOWN
  cleanUp(pathToFile);
});

test('overwrites a file in a nested directory that already exists', () => {
  // GIVEN
  const pathToFile = path.join(__dirname, './artifact/test.txt');
  cleanUp(pathToFile);

  fs.mkdirSync(path.dirname(pathToFile), { recursive: true });
  fs.writeFileSync(pathToFile, 'Hello, World!', { encoding: 'utf-8' });

  const subject = new HardDiskFileSystem();

  // WHEN
  subject.saveFile(pathToFile, 'Hello, Darling!');

  // THEN
  const result = fs.readFileSync(pathToFile, 'utf8');
  expect(result).toBe('Hello, Darling!');

  // TEARDOWN
  cleanUp(pathToFile);
});
