import { expect, test } from 'vitest';
import { InMemoryFileSystem } from './InMemoryFileSystem.js';

test('creates a file that did not exist before', () => {
  // GIVEN
  const subject = new InMemoryFileSystem();

  // WHEN
  subject.saveFile('./test.txt', 'Hello, World!');

  // THEN
  const result = subject.readFile('./test.txt');
  expect(result).toBe('Hello, World!');
});

test('creates a new file in a nested directory that did not exist before', () => {
  // GIVEN
  const subject = new InMemoryFileSystem();

  // WHEN
  subject.saveFile('./artifact/test.txt', 'Hello, Hell!');

  // THEN
  const result = subject.readFile('./artifact/test.txt');
  expect(result).toBe('Hello, Hell!');
});

test('overwrites file that already exists', () => {
  // GIVEN
  const subject = new InMemoryFileSystem();
  subject.saveFile('./test.txt', 'Hello, World!');

  // WHEN
  subject.saveFile('./test.txt', 'Hello, Heaven!');

  // THEN
  const result = subject.readFile('./test.txt');
  expect(result).toBe('Hello, Heaven!');
});

test('overwrites a file in a nested directory that already exists', () => {
  // GIVEN
  const subject = new InMemoryFileSystem();
  subject.saveFile('./artifact/test.txt', 'Hello, World!');

  // WHEN
  subject.saveFile('./artifact/test.txt', 'Hello, Darling!');

  // THEN
  const result = subject.readFile('./artifact/test.txt');
  expect(result).toBe('Hello, Darling!');
});
