import { useEffect, useState } from "react";

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

    if (!cleanTitle) {
      setValidationError("Title is required.");
      return;
    }

    if (cleanTitle.length < 3) {
      setValidationError("Title must be at least 3 characters.");
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
    <form onSubmit={submit} className="space-y-3">
      <input
        className="w-full rounded-lg border p-2 text-slate-900 placeholder:text-slate-400"
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
      <input
        className="w-full rounded-lg border p-2 text-slate-900 placeholder:text-slate-400"
        placeholder="Description"
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
      <button
        className="rounded-lg bg-black px-4 py-2 text-white"
        type="submit"
      >
        Add Task
      </button>
    </form>
  );
}
