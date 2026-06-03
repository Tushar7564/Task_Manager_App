import express from "express";
import {
  getProjectsController,
  createProjectController,
  updateProjectController,
  deleteProjectController,
} from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { projectSchema } from "../validations/project.validation.js";

const router = express.Router();

router.use(protect);

router.get("/", getProjectsController);
router.post("/", validate(projectSchema), createProjectController);
router.put("/:id", validate(projectSchema), updateProjectController);
router.delete("/:id", deleteProjectController);

export default router;
