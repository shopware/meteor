import { defineCollection, defineContentConfig, z } from "@nuxt/content";
import { useNuxt } from "@nuxt/kit";
import { joinURL } from "ufo";

const { options } = useNuxt();
const cwd = joinURL(options.rootDir, "content");

const linkSchema = z.object({
  label: z.string(),
  icon: z.string(),
  to: z.string(),
  target: z.string().optional(),
});

const meteorSchema = z.object({
  tagName: z.string().optional(),
  status: z
    .enum(["available", "experimental", "deprecated", "none"])
    .optional(),
  packageImports: z.union([z.string(), z.array(z.string())]).optional(),
  packageName: z.string().optional(),
  sourcePath: z.string().optional(),
  sourceUrl: z.string().optional(),
  npmPackage: z.string().optional(),
});

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: "page",
      source: {
        cwd,
        include: "**",
        prefix: "/",
        exclude: ["index.md"],
      },
      schema: z.object({
        links: z.array(linkSchema).optional(),
        meteor: meteorSchema.optional(),
      }),
    }),
    landing: defineCollection({
      type: "page",
      source: {
        cwd,
        include: "index.md",
      },
    }),
  },
});
