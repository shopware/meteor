import { expect, test as fact } from "vitest";
import { Dictionary } from "./dictionary";

fact("it is possible to create a dictionary out of the Figma Variables", () => {
  // GIVEN
  const subject = Dictionary;

  // WHEN
  const result = subject.fromFigmaVariables().value;

  // THEN
  expect(result).toStrictEqual({
    blue: {
      $type: "color",
      $value: "#0000FF",
    },
  });
});
