import mongoose from "mongoose";

export async function connectMongo(uri: string) {
  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => {
    // eslint-disable-next-line no-console
    console.log("✅ MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("❌ MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    // eslint-disable-next-line no-console
    console.log("⚠️ MongoDB disconnected");
  });

  await mongoose.connect(uri);
}