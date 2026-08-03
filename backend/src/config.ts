import 'dotenv/config'
import { z } from 'zod'

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  GEMINI_MODEL: z.string().min(1).default('gemini-3.1-flash-lite'),
  HOST: z.string().min(1).default('127.0.0.1'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  CLIENT_ORIGIN: z.string().url().optional(),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().min(5_000).max(120_000).default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).max(100).default(10),
})

const parsed = configSchema.safeParse(process.env)

if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => issue.message).join(', ')
  throw new Error(`Invalid backend configuration: ${details}`)
}

export const config = parsed.data
