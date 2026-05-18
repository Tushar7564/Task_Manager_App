import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import ApiError from "../utils/ApiError.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized, token missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, "Not authorized, token invalid"));
  }
};