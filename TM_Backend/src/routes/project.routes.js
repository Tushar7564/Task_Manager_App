import express from "express";
import {
  getProjectsController,
  createProjectController,
  updateProjectController,
  deleteProjectController,
} from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getProjectsController);
router.post("/", createProjectController);
router.put("/:id", updateProjectController);
router.delete("/:id", deleteProjectController);

export default router;
