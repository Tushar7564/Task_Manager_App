import express from "express";
import {
  getTasksController,
  createTaskController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/", getTasksController);
router.post("/", createTaskController);
router.put("/:id", updateTaskController);
router.delete("/:id", deleteTaskController);

export default router;