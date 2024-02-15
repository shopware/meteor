import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const schema = z.object({
  FIGMA_TOKEN: z.string().min(1),
  ADMIN_TOKENS_FILE_KEY: z.string().min(1),
  PRIMITIVE_TOKENS_FILE_KEY: z.string().min(1),
});

export const env = schema.parse(process.env);
