import { useEffect, useState } from "react";
import { validateTaskPayload } from "../utils/validation";

export default function TaskForm({
  onCreate,
  projects = [],
  selectedProjectId = "",
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(selectedProjectId);
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setProjectId(selectedProjectId);
  }, [selectedProjectId]);

  async function submit(e) {
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
      setValidationError("");
      await onCreate({
        title: cleanTitle,
        description: description.trim(),
        priority,
        status,
        dueDate,
        projectId,
      });
      setTitle("");
      setDescription("");
      setProjectId(selectedProjectId);
      setPriority("medium");
      setStatus("todo");
      setDueDate("");
    } catch {
      // error toast already shown in TaskPage; just prevent uncaught promise
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="grid gap-3">
        <label className="sr-only" htmlFor="task-title">
          Task title
        </label>
        <input
          id="task-title"
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => {
            setTitle(e.target.value);
            if (validationError) setValidationError("");
          }}
        />
      {validationError && (
        <p className="text-sm font-medium text-red-600">{validationError}</p>
      )}
        <label className="sr-only" htmlFor="task-description">
          Task description
        </label>
        <input
          id="task-description"
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <select
          aria-label="Project"
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
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
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>

        <select
          aria-label="Status"
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>

        <input
          aria-label="Due date"
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <button
        className="mt-3 min-h-11 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        type="submit"
      >
        Add Task
      </button>
    </form>
  );
}
