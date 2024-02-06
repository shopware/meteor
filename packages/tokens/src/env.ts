import { z } from 'zod';
import dotenv from 'dotenv'

dotenv.config()

const schema = z.object({
  API_KEY: z.string().min(1),
});

export const env = schema.parse(process.env);
