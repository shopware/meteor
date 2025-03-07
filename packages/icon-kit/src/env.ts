import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    FIGMA_FILE: z.string(),
    FIGMA_TOKEN: z.string().startsWith("figd_"),
  },
  
  runtimeEnv: process.env,
  
  skipValidation: false,
}); 