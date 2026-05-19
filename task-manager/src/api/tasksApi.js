import api from "./axios";

const toDateInputValue = (value) => {
  if (!value) return "";
  return String(value).split("T")[0];
};

const normalizeTask = (task) => ({
  ...task,
  completed: Boolean(task.completed ?? task.is_completed),
  priority: task.priority || "medium",
  status: task.status || "todo",
  dueDate: toDateInputValue(task.dueDate ?? task.due_date),
  projectId: task.projectId ?? task.project_id ?? "",
});

const normalizeTasks = (tasks) => tasks.map(normalizeTask);

const toBackendTaskPayload = (taskData) => {
  const payload = { ...taskData };

  if ("completed" in payload) {
    payload.is_completed = payload.completed;
    delete payload.completed;
  }

  if ("projectId" in payload) {
    payload.projectId = payload.projectId || null;
  }

  return payload;
};

export const getTasks = async () => {
  const response = await api.get("/tasks");
  return normalizeTasks(response.data.data);
};

export const createTask = async (taskData) => {
  const response = await api.post("/tasks", toBackendTaskPayload(taskData));
  return normalizeTask(response.data.data);
};

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, toBackendTaskPayload(taskData));
  return normalizeTask(response.data.data);
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return normalizeTask(response.data.data);
};
