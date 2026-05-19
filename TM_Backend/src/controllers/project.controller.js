import ApiError from "../utils/ApiError.js";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/project.service.js";

export const getProjectsController = async (req, res, next) => {
  try {
    const projects = await getAllProjects(req.user.id);

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const createProjectController = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      throw new ApiError(400, "Project name is required");
    }

    const project = await createProject({
      name: name.trim(),
      description: description || "",
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProjectController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name?.trim()) {
      throw new ApiError(400, "Project name is required");
    }

    const project = await updateProject(id, {
      name: name.trim(),
      description: description || "",
      userId: req.user.id,
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProjectController = async (req, res, next) => {
  try {
    const project = await deleteProject(req.params.id, req.user.id);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};
