import { useState } from "react";

export default function ProjectPanel({
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateProject,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanName = name.trim();

    if (!cleanName) {
      setValidationError("Project name is required.");
      return;
    }

    try {
      setValidationError("");
      await onCreateProject({
        name: cleanName,
        description: description.trim(),
      });
      setName("");
      setDescription("");
    } catch {
      // ProjectPage owns the toast; keep form state for retry.
    }
  }

  return (
    <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Projects</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSelectProject("")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                selectedProjectId === ""
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All tasks
            </button>
            {projects.map((project) => (
              <button
                type="button"
                key={project.id}
                onClick={() => onSelectProject(String(project.id))}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  selectedProjectId === String(project.id)
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-2 sm:max-w-xs">
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            placeholder="Project name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (validationError) setValidationError("");
            }}
          />
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {validationError && (
            <p className="text-sm font-medium text-red-600">
              {validationError}
            </p>
          )}
          <button
            className="rounded-lg bg-black px-4 py-2 text-sm text-white"
            type="submit"
          >
            Add Project
          </button>
        </form>
      </div>
    </section>
  );
}
