import axios from "axios";

// Vite proxy handles /tasks -> http://localhost:8080/tasks
const http = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});

export async function fetchTasks() {
  const res = await http.get("/tasks");
  return res.data; // array
}

export async function createTask(payload) {
  const res = await http.post("/tasks", payload);
  return res.data; // created task
}

export async function updateTask(id, payload) {
  const res = await http.put(`/tasks/${id}`, payload);
  return res.data; // updated task
}

export async function deleteTask(id) {
  await http.delete(`/tasks/${id}`);
}

export async function toggleTask(id, nextCompleted) {
  // We need full update for your backend PUT contract.
  // We'll call updateTask with current title/description from state.
  // (So toggle will be handled inside TaskPage where we have task data.)
  return { id, is_completed: nextCompleted };
}