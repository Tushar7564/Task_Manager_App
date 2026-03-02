import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";
import EditTaskModal from "../components/EditTaskModal.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/tasksApi.js";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchTasks();
      setTasks(data);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // CREATE
  async function handleCreate(payload) {
    try {
      const created = await createTask(payload);
      setTasks((prev) => [created, ...prev]);
      toast.success("Task added");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to add task.");
      throw e;
    }
  }

  // UPDATE (edit)
  async function handleUpdate(id, payload) {
    try {
      const updated = await updateTask(id, payload);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success("Task updated");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update task.");
      throw e;
    }
  }

  // TOGGLE (optimistic)
  async function handleToggle(task) {
    const nextCompleted = !task.is_completed;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, is_completed: nextCompleted } : t,
      ),
    );

    try {
      const updated = await updateTask(task.id, {
        title: task.title,
        description: task.description ?? "",
        is_completed: nextCompleted,
      });

      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (e) {
      // rollback
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, is_completed: task.is_completed } : t,
        ),
      );
      toast.error(e?.response?.data?.message || "Failed to toggle task.");
    }
  }

  // DELETE (optimistic)
  async function handleDelete(task) {
    const snapshot = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== task.id));

    try {
      await deleteTask(task.id);
      toast.success("Task deleted");
    } catch (e) {
      setTasks(snapshot);
      toast.error(e?.response?.data?.message || "Failed to delete task.");
    }
  }

  const isEmpty = !loading && !error && tasks.length === 0;

  return (
    <div className="mx-auto max-w-2xl">
      <TaskForm onCreate={handleCreate} />

      {loading && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
          Loading tasks…
        </div>
      )}

      {!loading && error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isEmpty && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
          No tasks yet. Add your first task above.
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onDelete={(task) => setDeleteTask(task)}
          onEdit={(task) => setEditingTask(task)}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={async (updatedTask) => {
            await handleUpdate(editingTask.id, {
              title: updatedTask.title,
              description: updatedTask.description ?? "",
              is_completed: editingTask.is_completed,
            });
            setEditingTask(null);
          }}
        />
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteTask}
        taskTitle={deleteTask?.title}
        onCancel={() => setDeleteTask(null)}
        onConfirm={async () => {
          await handleDelete(deleteTask);
          setDeleteTask(null);
        }}
      />
    </div>
  );
}
