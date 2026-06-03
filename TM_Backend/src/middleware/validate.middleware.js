import ApiError from "../utils/ApiError.js";

const formatZodMessage = (error) => {
  const issue = error.issues?.[0];
  return issue?.message || "Invalid request payload";
};

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return next(new ApiError(400, formatZodMessage(result.error)));
  }

  req.body = result.data;
  next();
};
