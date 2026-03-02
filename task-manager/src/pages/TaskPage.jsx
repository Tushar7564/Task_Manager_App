import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";
import EditTaskModal from "../components/EditTaskModal.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import TaskToolbar from "../components/tasks/TaskToolbar.jsx";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/tasksApi.js";

const UI_KEY = "tm_ui_v1";

function loadUI() {
  try {
    const raw = localStorage.getItem(UI_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUI(ui) {
  try {
    localStorage.setItem(UI_KEY, JSON.stringify(ui));
  } catch {
    // ignore storage errors
  }
}

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const savedUI = loadUI();

  const [filter, setFilter] = useState(savedUI?.filter ?? "all");
  const [sort, setSort] = useState(savedUI?.sort ?? "newest");
  const [search, setSearch] = useState("");

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.is_completed).length,
    completed: tasks.filter((t) => t.is_completed).length,
  };

  const visibleTasks = (() => {
    const q = search.trim().toLowerCase();

    let list = [...tasks];

    // filter
    if (filter === "active") list = list.filter((t) => !t.is_completed);
    if (filter === "completed") list = list.filter((t) => t.is_completed);

    // search
    if (q) list = list.filter((t) => (t.title || "").toLowerCase().includes(q));

    // sort
    switch (sort) {
      case "oldest":
        list.sort((a, b) => a.id - b.id);
        break;
      case "title_asc":
        list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "completed_last":
        list.sort((a, b) => Number(a.is_completed) - Number(b.is_completed));
        break;
      case "newest":
      default:
        list.sort((a, b) => b.id - a.id);
        break;
    }

    return list;
  })();

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

  useEffect(() => {
    saveUI({ filter, sort });
  }, [filter, sort]);

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

  const isEmpty = !loading && !error && visibleTasks.length === 0;

  return (
    <div className="mx-auto max-w-2xl">
      <TaskForm onCreate={handleCreate} />

      <TaskToolbar
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        counts={counts}
      />

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
          No tasks match your current filter/search.
        </div>
      )}

      {!loading && !error && visibleTasks.length > 0 && (
        <TaskList
          tasks={visibleTasks}
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
