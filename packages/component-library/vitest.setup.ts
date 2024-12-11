import "@testing-library/jest-dom/vitest";

Object.defineProperty(document, "fonts", {
  value: { ready: Promise.resolve({}) },
});
