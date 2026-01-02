import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testMatch: ["<rootDir>/tests/integration/**/*.test.ts"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"]
};

export default config;