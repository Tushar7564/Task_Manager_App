import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";
import EditTaskModal from "../components/EditTaskModal.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import ProjectPanel from "../components/ProjectPanel.jsx";
import TaskToolbar from "../components/tasks/TaskToolbar.jsx";
import KanbanBoard from "../components/kanban/KanbanBoard.jsx";
import { getApiErrorMessage } from "../api/axios";
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

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div className="mt-4 space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-slate-100" />
          <div className="mt-5 flex gap-2">
            <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ title, message }) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        —
      </div>
      <h2 className="mt-4 text-sm font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState(() => loadUI()?.filter ?? "all");
  const [sort, setSort] = useState(() => loadUI()?.sort ?? "newest");
  const [viewMode, setViewMode] = useState(() => loadUI()?.viewMode ?? "list");
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
      const message = getApiErrorMessage(e);
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
    load();
  }, []);

  useEffect(() => {
    saveUI({ filter, sort, selectedProjectId, viewMode });
  }, [filter, sort, selectedProjectId, viewMode]);

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
      toast.error(getApiErrorMessage(e));
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
      toast.error(getApiErrorMessage(e));
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
      toast.error(getApiErrorMessage(e));
    }
  }

  async function handleStatusChange(task, nextStatus) {
    const previousStatus = task.status || "todo";
    const previousCompleted = task.completed;
    const nextCompleted = nextStatus === "done";

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, completed: nextCompleted, status: nextStatus }
          : t,
      ),
    );

    try {
      const updated = await updateTask(task.id, {
        title: task.title,
        description: task.description ?? "",
        completed: nextCompleted,
        projectId: task.projectId || "",
        priority: task.priority || "medium",
        status: nextStatus,
        dueDate: task.dueDate || "",
      });

      setError("");
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      toast.success("Task status updated");
    } catch (e) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? { ...t, completed: previousCompleted, status: previousStatus }
            : t,
        ),
      );
      toast.error(getApiErrorMessage(e));
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
      toast.error(getApiErrorMessage(e));
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
      toast.error(getApiErrorMessage(e));
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
      toast.error(getApiErrorMessage(e));
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
      toast.error(getApiErrorMessage(e));
      throw e;
    }
  }

  const isEmpty = !loading && !error && visibleTasks.length === 0;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total" value={summaryStats.total} />
        <StatCard label="Completed" value={summaryStats.completed} />
        <StatCard label="High Priority" value={summaryStats.highPriority} />
        <StatCard label="Overdue" value={summaryStats.overdue} />
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
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {loading && (
        <TaskSkeleton />
      )}

      {!loading && error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isEmpty && (
        <EmptyState
          title={tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
          message={
            tasks.length === 0
              ? "Create your first task to start organizing your work."
              : "Try adjusting your project, filter, or search terms."
          }
        />
      )}

      {!loading && !error && visibleTasks.length > 0 && viewMode === "list" && (
        <TaskList
          tasks={visibleTasks}
          onToggle={handleToggle}
          onDelete={(task) => setTaskToDelete(task)}
          onEdit={(task) => setEditingTask(task)}
        />
      )}

      {!loading &&
        !error &&
        visibleTasks.length > 0 &&
        viewMode === "kanban" && (
          <KanbanBoard
            tasks={visibleTasks}
            onStatusChange={handleStatusChange}
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
