export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3000),
  MONGODB_URI: process.env.MONGODB_URI ?? "mongodb://localhost:27017/genese",

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? "dev_access",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? "dev_refresh",
  JWT_ACCESS_TTL_SECONDS: Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 900),
  JWT_REFRESH_TTL_SECONDS: Number(process.env.JWT_REFRESH_TTL_SECONDS ?? 60 * 60 * 24 * 30),

  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000),
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX ?? 120)
} as const;