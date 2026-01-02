import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimiter } from "./middlewares/rateLimit";
import { errorHandler } from "./middlewares/errorHandler";

import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import consentsRoutes from "./routes/consents.routes";
import bilansRoutes from "./routes/bilans.routes";
import programmesRoutes from "./routes/programmes.routes";
import seancesRoutes from "./routes/seances.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import exercicesRoutes from "./routes/exercices.routes";
import alertsRoutes from "./routes/alerts.routes";
import notificationsRoutes from "./routes/notifications.routes";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));
  app.use(rateLimiter());

  app.get("/api/health", (_req, res) => res.json({ success: true, data: { ok: true } }));

  app.use("/api/auth", authRoutes);
  app.use("/api/users", usersRoutes);
  app.use("/api/users/me/consents", consentsRoutes);
  app.use("/api/bilans", bilansRoutes);
  app.use("/api/programmes", programmesRoutes);
  app.use("/api/seances", seancesRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/exercices", exercicesRoutes);
  app.use("/api/alerts", alertsRoutes);
  app.use("/api/notifications", notificationsRoutes);

  app.use(errorHandler);
  return app;
};