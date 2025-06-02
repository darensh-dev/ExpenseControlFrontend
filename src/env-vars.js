import { z } from "zod";

const envSchema = z.object({
  APP_API_URL: z.string().url(),
  APP_STR: z.string(),
  APP_ENV: z.string(),
  APP_KEY_SESSION: z.string(),
  APP_KEY_THEME: z.string(),
});

const { APP_API_URL, APP_STR, APP_ENV, APP_KEY_SESSION, APP_KEY_THEME } = import.meta.env;

const { success, error } = envSchema.safeParse({
  APP_API_URL,
  APP_STR,
  APP_ENV,
  APP_KEY_SESSION,
  APP_KEY_THEME,
});

if (!success) {
  console.error(`Invalid environment variables: ${error}`);
  throw error;
}

export { APP_API_URL, APP_ENV, APP_KEY_SESSION, APP_KEY_THEME, APP_STR };
