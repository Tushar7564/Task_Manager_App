import axios from "axios";

// Vite proxy handles /tasks -> http://localhost:8080/tasks
const http = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});

function unwrap(res) {
  return res.data?.data ?? res.data;
}

export async function fetchTasks() {
  const res = await http.get("/tasks");
  return unwrap(res);
}

export async function createTask(payload) {
  const res = await http.post("/tasks", payload);
  return unwrap(res);
}

export async function updateTask(id, payload) {
  const res = await http.put(`/tasks/${id}`, payload);
  return unwrap(res);
}

export async function deleteTask(id) {
  const res = await http.delete(`/tasks/${id}`);
  return unwrap(res);
}