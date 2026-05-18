import ApiError from "../utils/ApiError.js";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/task.service.js";

export const getTasksController = async (req, res, next) => {
  try {
    const tasks = await getAllTasks(req.user.id);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const createTaskController = async (req, res, next) => {
  try {
    const { title, description, is_completed = false } = req.body;

    if (!title?.trim()) {
      throw new ApiError(400, "Task title is required");
    }

    const task = await createTask({
      title,
      description: description || "",
      is_completed,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, is_completed } = req.body;

    if (!title?.trim()) {
      throw new ApiError(400, "Task title is required");
    }

    const task = await updateTask(id, {
      title,
      description: description || "",
      is_completed,
      userId: req.user.id,
    });

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTaskController = async (req, res, next) => {
  try {
    const task = await deleteTask(req.params.id, req.user.id);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};