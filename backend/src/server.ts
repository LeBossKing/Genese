import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.resolve(process.cwd(), ".env")});

import { createApp } from "./app";
import { connectMongo } from "./config/mongoose";
import { env } from "./config/env";

async function main() {
  console.log("Starting server...");
  console.log("MONGODB_URI =", env.MONGODB_URI);

  await connectMongo(env.MONGODB_URI);

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`✅ GENESE API listening on :${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});