import express from "express";
import {
  getTasksController,
  createTaskController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { taskSchema } from "../validations/task.validation.js";

const router = express.Router();

router.use(protect);

router.get("/", getTasksController);
router.post("/", validate(taskSchema), createTaskController);
router.put("/:id", validate(taskSchema), updateTaskController);
router.delete("/:id", deleteTaskController);

export default router;
