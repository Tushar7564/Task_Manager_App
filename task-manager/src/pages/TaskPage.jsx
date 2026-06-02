import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";
import EditTaskModal from "../components/EditTaskModal.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import ProjectPanel from "../components/ProjectPanel.jsx";
import TaskToolbar from "../components/tasks/TaskToolbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/tasksApi";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projectsApi";

const UI_KEY = "tm_ui_v1";

function loadUI() {
  try {
    const raw = localStorage.getItem(UI_KEY);
    const ui = raw ? JSON.parse(raw) : null;

    if (ui?.filter === "is_completed") {
      return { ...ui, filter: "completed" };
    }

    return ui;
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

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(`${task.dueDate}T00:00:00`);
  return dueDate < today;
}

export default function TaskPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState(() => loadUI()?.filter ?? "all");
  const [sort, setSort] = useState(() => loadUI()?.sort ?? "newest");
  const [selectedProjectId, setSelectedProjectId] = useState(
    () => loadUI()?.selectedProjectId ?? "",
  );
  const [search, setSearch] = useState("");
  const loadErrorToastShown = useRef(false);

  const projectById = new Map(
    projects.map((project) => [String(project.id), project]),
  );

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const summaryStats = {
    total: tasks.length,
    completed: counts.completed,
    highPriority: tasks.filter((t) => t.priority === "high").length,
    overdue: tasks.filter(isOverdue).length,
  };

  const visibleTasks = (() => {
    const q = search.trim().toLowerCase();

    let list = [...tasks];

    if (selectedProjectId) {
      list = list.filter((t) => String(t.projectId) === selectedProjectId);
    }

    // filter
    if (filter === "active") list = list.filter((t) => !t.completed);
    if (filter === "completed") list = list.filter((t) => t.completed);

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
        list.sort((a, b) => Number(a.completed) - Number(b.completed));
        break;
      case "newest":
      default:
        list.sort((a, b) => b.id - a.id);
        break;
    }

    return list.map((task) => ({
      ...task,
      projectName: projectById.get(String(task.projectId))?.name || "",
    }));
  })();

  async function load() {
    try {
      setLoading(true);
      setError("");
      const [tasksData, projectsData] = await Promise.all([
        getTasks(),
        getProjects(),
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (e) {
      const message = e?.response?.data?.message || "Failed to load tasks.";
      setError(message);

      if (!loadErrorToastShown.current) {
        toast.error(message, { toastId: "load-tasks-error" });
        loadErrorToastShown.current = true;
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    load();
  }, [token]);

  useEffect(() => {
    saveUI({ filter, sort, selectedProjectId });
  }, [filter, sort, selectedProjectId]);

  useEffect(() => {
    if (
      selectedProjectId &&
      projects.length > 0 &&
      !projects.some((project) => String(project.id) === selectedProjectId)
    ) {
      setSelectedProjectId("");
    }
  }, [projects, selectedProjectId]);

  // CREATE
  async function handleCreate(payload) {
    try {
      const created = await createTask({ ...payload, completed: false });
      setError("");
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
      setError("");
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success("Task updated");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update task.");
      throw e;
    }
  }

  // TOGGLE (optimistic)
  async function handleToggle(task) {
    const nextCompleted = !task.completed;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, completed: nextCompleted } : t,
      ),
    );

    try {
      const updated = await updateTask(task.id, {
        title: task.title,
        description: task.description ?? "",
        completed: nextCompleted,
        projectId: task.projectId || "",
        priority: task.priority || "medium",
        status: task.status || "todo",
        dueDate: task.dueDate || "",
      });

      setError("");
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (e) {
      // rollback
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, completed: task.completed } : t,
        ),
      );
      toast.error(e?.response?.data?.message || "Failed to toggle task.");
    }
  }

  // DELETE
  async function handleDelete(task) {
    if (!task) return;

    try {
      setDeleting(true);
      await deleteTask(task.id);
      setError("");
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      setTaskToDelete(null);
      toast.success("Task deleted");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to delete task.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleCreateProject(payload) {
    try {
      const project = await createProject(payload);
      setProjects((prev) => [...prev, project]);
      setSelectedProjectId(String(project.id));
      toast.success("Project added");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to add project.");
      throw e;
    }
  }

  async function handleUpdateProject(id, payload) {
    try {
      const updatedProject = await updateProject(id, payload);
      setProjects((prev) =>
        prev.map((project) =>
          project.id === updatedProject.id ? updatedProject : project,
        ),
      );
      toast.success("Project updated");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update project.");
      throw e;
    }
  }

  async function handleDeleteProject(project) {
    try {
      await deleteProject(project.id);
      setProjects((prev) => prev.filter((item) => item.id !== project.id));
      setTasks((prev) =>
        prev.map((task) =>
          String(task.projectId) === String(project.id)
            ? { ...task, projectId: "" }
            : task,
        ),
      );

      if (selectedProjectId === String(project.id)) {
        setSelectedProjectId("");
      }

      toast.success("Project deleted");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to delete project.");
      throw e;
    }
  }

  const isEmpty = !loading && !error && visibleTasks.length === 0;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {summaryStats.total}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {summaryStats.completed}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-xs font-medium text-slate-500">High Priority</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {summaryStats.highPriority}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Overdue</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {summaryStats.overdue}
          </p>
        </div>
      </div>

      <ProjectPanel
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onCreateProject={handleCreateProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
      />

      <TaskForm
        onCreate={handleCreate}
        projects={projects}
        selectedProjectId={selectedProjectId}
      />

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
          onDelete={(task) => setTaskToDelete(task)}
          onEdit={(task) => setEditingTask(task)}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          projects={projects}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={async (updatedTask) => {
            await handleUpdate(editingTask.id, {
              title: updatedTask.title,
              description: updatedTask.description ?? "",
              completed: editingTask.completed,
              projectId: updatedTask.projectId,
              priority: updatedTask.priority,
              status: updatedTask.status,
              dueDate: updatedTask.dueDate,
            });
            setEditingTask(null);
          }}
        />
      )}

      <ConfirmDeleteModal
        isOpen={!!taskToDelete}
        taskTitle={taskToDelete?.title}
        deleting={deleting}
        onCancel={() => setTaskToDelete(null)}
        onConfirm={async () => {
          await handleDelete(taskToDelete);
        }}
      />
    </div>
  );
}
