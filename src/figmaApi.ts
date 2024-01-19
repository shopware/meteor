import { get } from "./httpClient";
import { z } from "zod";

const variableAlias = z.object({
  id: z.string(),
  type: z.literal("VARIABLE_ALIAS"),
});

const colorValue = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number(),
  a: z.number(),
});

export type FigmaVariable = z.infer<typeof variableSchema>;
const variableSchema = z.object({
  id: z.string(),
  name: z.string(),
  key: z.string(),
  variableCollectionId: z.string(),
  resolvedType: z.enum(["BOOLEAN", "FLOAT", "STRING", "COLOR"]),
  valuesByMode: z.record(
    z.string(),
    z.union([z.boolean(), z.number(), z.string(), variableAlias, colorValue])
  ),
  remote: z.boolean(),
  description: z.string(),
  hiddenFromPublishing: z.boolean(),
  scopes: z.array(z.unknown()),
  // codeSyntax: variableCodeSyntax,
});

export type FigmaVariableCollection = z.infer<typeof variableCollection>;
const variableCollection = z.object({
  id: z.string(),
  name: z.string(),
  key: z.string(),
  modes: z.array(z.object({ modeId: z.string(), name: z.string() })),
  defaultModeId: z.string(),
  remote: z.boolean(),
  hiddenFromPublishing: z.boolean(),
  variableIds: z.array(z.string()),
});

const responseSchema = z.object({
  status: z.number(),
  error: z.boolean(),
  meta: z.object({
    variables: z.record(z.string(), variableSchema),
    variableCollections: z.record(z.string(), variableCollection),
  }),
});

type Config = {
  apiKey: string;
};

export class FigmaApi {
  constructor(private readonly config: Config) {}

  getLocalVariablesOfFile(fileKey: string) {
    return get(`https://api.figma.com/v1/files/${fileKey}/variables/local`, {
      Accept: "*/*",
      "X-Figma-Token": this.config.apiKey,
    }).then((response) => responseSchema.parse(response));
  }
}
