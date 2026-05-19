import { useState } from "react";

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

    if (!cleanTitle) {
      setValidationError("Title is required.");
      return;
    }

    if (cleanTitle.length < 3) {
      setValidationError("Title must be at least 3 characters.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Edit Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full rounded-lg border p-2 text-slate-900 placeholder:text-slate-400"
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
            className="w-full rounded-lg border p-2 text-slate-900 placeholder:text-slate-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid gap-3 sm:grid-cols-4">
            <select
              className="w-full rounded-lg border p-2 text-slate-900"
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
              className="w-full rounded-lg border p-2 text-slate-900"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>

            <select
              className="w-full rounded-lg border p-2 text-slate-900"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>

            <input
              className="w-full rounded-lg border p-2 text-slate-900"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-lg border px-4 py-2 text-slate-900 placeholder:text-slate-400"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-white"
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
