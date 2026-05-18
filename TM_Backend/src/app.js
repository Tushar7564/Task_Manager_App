import express from "express";
import cors from "cors";
import taskRoutes from "./routes/task.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use("/tasks", taskRoutes);

app.use(errorHandler);

export default app;