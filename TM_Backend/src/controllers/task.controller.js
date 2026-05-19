import ApiError from "../utils/ApiError.js";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/task.service.js";
import { getProjectById } from "../services/project.service.js";

const priorities = ["low", "medium", "high"];
const statuses = ["todo", "in_progress", "done"];

const normalizeTaskFields = ({
  priority = "medium",
  status = "todo",
  dueDate = null,
  projectId = null,
}) => {
  if (!priorities.includes(priority)) {
    throw new ApiError(400, "Priority must be low, medium, or high");
  }

  if (!statuses.includes(status)) {
    throw new ApiError(400, "Status must be todo, in_progress, or done");
  }

  return {
    priority,
    status,
    dueDate: dueDate || null,
    projectId: projectId || null,
  };
};

const ensureOwnedProject = async (projectId, userId) => {
  if (!projectId) return null;

  const project = await getProjectById(projectId, userId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project.id;
};

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
    const { priority, status, dueDate, projectId } =
      normalizeTaskFields(req.body);

    if (!title?.trim()) {
      throw new ApiError(400, "Task title is required");
    }

    const ownedProjectId = await ensureOwnedProject(projectId, req.user.id);

    const task = await createTask({
      title,
      description: description || "",
      is_completed,
      priority,
      status,
      dueDate,
      projectId: ownedProjectId,
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
    const { priority, status, dueDate, projectId } =
      normalizeTaskFields(req.body);

    if (!title?.trim()) {
      throw new ApiError(400, "Task title is required");
    }

    const ownedProjectId = await ensureOwnedProject(projectId, req.user.id);

    const task = await updateTask(id, {
      title,
      description: description || "",
      is_completed,
      priority,
      status,
      dueDate,
      projectId: ownedProjectId,
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
