import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import ApiError from "./utils/ApiError.js";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: env.clientUrl,
  }),
);
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use("/auth", apiLimiter, authRoutes);
app.use("/tasks", apiLimiter, taskRoutes);
app.use("/projects", apiLimiter, projectRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

export default app;
