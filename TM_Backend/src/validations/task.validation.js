import { z } from "zod";

const optionalDate = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z
    .string()
    .date("Due date must be a valid date")
    .nullable()
    .optional()
    .default(null),
);

const optionalProjectId = z.preprocess(
  (value) => {
    if (value === "" || value === undefined || value === null) return null;
    return Number(value);
  },
  z
    .number("Project must be a valid project")
    .int("Project must be a valid project")
    .positive("Project must be a valid project")
    .nullable()
    .optional()
    .default(null),
);

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Task title is required"),
  description: z.string().trim().optional().default(""),
  is_completed: z.boolean().optional().default(false),
  priority: z.enum(["low", "medium", "high"], {
    message: "Priority must be low, medium, or high",
  }).optional().default("medium"),
  status: z.enum(["todo", "in_progress", "done"], {
    message: "Status must be todo, in_progress, or done",
  }).optional().default("todo"),
  dueDate: optionalDate,
  projectId: optionalProjectId,
});
