// The definitions of convert-units 2.3.4, which mt-unit-field used before. Its rounded ratios
// between metric and imperial units are kept, so converted values stay the same.
const units = {
  mm: { measure: "length", system: "metric", toAnchor: 1 / 1000 },
  cm: { measure: "length", system: "metric", toAnchor: 1 / 100 },
  m: { measure: "length", system: "metric", toAnchor: 1 },
  in: { measure: "length", system: "imperial", toAnchor: 1 / 12 },
  ft: { measure: "length", system: "imperial", toAnchor: 1 },
  yd: { measure: "length", system: "imperial", toAnchor: 3 },
  g: { measure: "mass", system: "metric", toAnchor: 1 },
  kg: { measure: "mass", system: "metric", toAnchor: 1000 },
  oz: { measure: "mass", system: "imperial", toAnchor: 1 / 16 },
  lb: { measure: "mass", system: "imperial", toAnchor: 1 },
} as const;

// From the metric anchor to the imperial one and back: m and ft, g and lb
const systemRatios = {
  length: { metric: 3.28084, imperial: 1 / 3.28084 },
  mass: { metric: 1 / 453.592, imperial: 453.592 },
};

export type Unit = keyof typeof units;

type Measure = (typeof units)[Unit]["measure"];

export function unitsOf(measure: Measure): Unit[] {
  return (Object.keys(units) as Unit[]).filter((unit) => units[unit].measure === measure);
}

/**
 * Converts like convert-units, with the same steps, so the floating point results are identical.
 * Returns undefined for units of different measures.
 */
export function convertUnit(value: number, from: Unit, to: Unit): number | undefined {
  if (from === to) {
    return value;
  }

  const origin = units[from];
  const destination = units[to];

  if (origin.measure !== destination.measure) {
    return undefined;
  }

  let result = value * origin.toAnchor;

  if (origin.system !== destination.system) {
    result *= systemRatios[origin.measure][origin.system];
  }

  return result / destination.toAnchor;
}
