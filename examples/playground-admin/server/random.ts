/**
 * A seeded random generator (mulberry32), so the mock data is the same on every load.
 */
export function createRandom(seed: number) {
  let state = seed;

  function next() {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }

  /** A whole number between `min` and `max`, both included. */
  function int(min: number, max: number) {
    return Math.floor(next() * (max - min + 1)) + min;
  }

  function pick<Item>(items: readonly Item[]): Item {
    return items[int(0, items.length - 1)];
  }

  /** Up to `count` different items. */
  function some<Item>(items: readonly Item[], count: number): Item[] {
    return [...items].sort(() => next() - 0.5).slice(0, count);
  }

  function chance(probability: number) {
    return next() < probability;
  }

  /** A price that ends in .90, .95 or .00, like a shop would set it. */
  function price(min: number, max: number) {
    const base = int(min, max);

    return base + pick([0.9, 0.95, 0]);
  }

  /** A pseudo UUID without dashes, like the ids of the Admin API. */
  function id() {
    return Array.from({ length: 32 }, () => int(0, 15).toString(16)).join("");
  }

  return { next, int, pick, some, chance, price, id };
}

/** Rounds to cents. */
export function round(value: number) {
  return Math.round(value * 100) / 100;
}
