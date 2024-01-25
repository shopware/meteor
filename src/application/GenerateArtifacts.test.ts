import { expect, test as fact, vitest } from "vitest";
import { GenerateArtifacts } from "./GenerateArtifacts";
import { InMemoryFileSystem } from "../common/domain/file-system/InMemoryFileSystem";
import { FigmaApi } from "../figmaApi";

fact(
  "it creates a Dictionary in form of a JSON file for the primitive Design Tokens",
  async () => {
    // GIVEN
    const figmaApi = {
      getLocalVariablesOfFile: vitest.fn().mockResolvedValueOnce({
        status: 200,
        error: false,
        meta: {
          variables: {
            "VariableID:11953:115880": {
              id: "VariableID:11953:115880",
              name: "blue",
              key: "db9aa5d3b7c6f03b4cddb78e045b566fae112d17",
              variableCollectionId: "VariableCollectionId:11953:115879",
              resolvedType: "COLOR",
              valuesByMode: {
                "11953:0": {
                  r: 0,
                  g: 0,
                  b: 1,
                  a: 1,
                },
              },
              remote: false,
              description: "",
              hiddenFromPublishing: false,
              scopes: ["ALL_SCOPES"],
            },
          },
          variableCollections: {
            "VariableCollectionId:11953:115879": {
              id: "VariableCollectionId:11953:115879",
              name: ".Design Tokens",
              key: "9130479ef323598b1ccfb32e7b16dc80fcb30f14",
              modes: [{ modeId: "11953:0", name: "Light mode" }],
              defaultModeId: "11953:0",
              remote: false,
              hiddenFromPublishing: true,
              variableIds: ["VariableID:11953:115880"],
            },
          },
        },
      }),
    } as unknown as FigmaApi;

    const fileSystem = new InMemoryFileSystem();
    const subject = new GenerateArtifacts(fileSystem, figmaApi);

    // WHEN
    await subject.execute();

    // THEN
    const result = fileSystem.readFile(
      "./tokens/foundation/primitives.tokens.json"
    );

    expect(result).toMatchInlineSnapshot(`
      "{
        "blue": {
          "$value": "#0000ff",
          "$type": "color"
        }
      }"
    `);
  }
);
