import { useState } from "react";
import { validateTaskPayload } from "../utils/validation";

export default function EditTaskModal({ task, projects = [], onClose, onSave }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [projectId, setProjectId] = useState(task.projectId || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [status, setStatus] = useState(task.status || "todo");
  const [dueDate, setDueDate] = useState(
    task.due_date ? task.due_date.split("T")[0] : task.dueDate || "",
  );
  const [validationError, setValidationError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanTitle = title.trim();
    const validationMessage = validateTaskPayload({
      title: cleanTitle,
      dueDate,
    });

    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    try {
      setSaving(true);
      setValidationError("");
      await onSave({
        title: cleanTitle,
        description: description.trim(),
        completed: task.completed,
        projectId,
        priority,
        status,
        dueDate,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Edit Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            aria-label="Task title"
            className="min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError("");
            }}
          />
          {validationError && (
            <p className="text-sm font-medium text-red-600">
              {validationError}
            </p>
          )}

          <input
            aria-label="Task description"
            className="min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid gap-3 md:grid-cols-4">
            <select
              aria-label="Project"
              className="min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">No project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <select
              aria-label="Priority"
              className="min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>

            <select
              aria-label="Status"
              className="min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>

            <input
              aria-label="Due date"
              className="min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
