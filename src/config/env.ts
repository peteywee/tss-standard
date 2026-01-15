import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Provider selection (future)
  DATABASE_PROVIDER: z.enum(["supabase", "postgres"]).default("supabase"),

  // Supabase (optional until wired)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_KEY: z.string().min(1).optional(),

  // Logging
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error"]).default("info"),

  // Feature flags
  FEATURE_CALENDAR_SYNC: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => v === "true"),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(input: NodeJS.ProcessEnv): Env {
  const parsed = envSchema.safeParse(input);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = validateEnv(process.env);
