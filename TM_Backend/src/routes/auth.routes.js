import express from "express";
import {
  registerController,
  loginController,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "../validations/auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);

export default router;
