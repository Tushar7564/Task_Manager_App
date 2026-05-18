import ApiError from "../utils/ApiError.js";
import { registerUser, loginUser } from "../services/auth.service.js";

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      throw new ApiError(400, "Name, email and password are required");
    }

    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters");
    }

    const user = await registerUser({ name, email, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      throw new ApiError(400, "Email and password are required");
    }

    const data = await loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    next(error);
  }
};