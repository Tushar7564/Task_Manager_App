import { useState } from "react";

export default function ProjectPanel({
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingProjectId, setEditingProjectId] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [validationError, setValidationError] = useState("");
  const [editValidationError, setEditValidationError] = useState("");
  const [deletingProjectId, setDeletingProjectId] = useState("");

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

  function startEdit(project) {
    setEditingProjectId(String(project.id));
    setEditName(project.name || "");
    setEditDescription(project.description || "");
    setEditValidationError("");
  }

  function cancelEdit() {
    setEditingProjectId("");
    setEditName("");
    setEditDescription("");
    setEditValidationError("");
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const cleanName = editName.trim();

    if (!cleanName) {
      setEditValidationError("Project name is required.");
      return;
    }

    try {
      setEditValidationError("");
      await onUpdateProject(editingProjectId, {
        name: cleanName,
        description: editDescription.trim(),
      });
      cancelEdit();
    } catch {
      // TaskPage owns the toast; keep form state for retry.
    }
  }

  async function handleDelete(project) {
    try {
      setDeletingProjectId(String(project.id));
      await onDeleteProject(project);
    } finally {
      setDeletingProjectId("");
    }
  }

  return (
    <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Projects</h2>
            <p className="mt-1 text-sm text-slate-500">
              Group related tasks and filter your workspace.
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSelectProject("")}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${
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
                className={`rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${
                  selectedProjectId === String(project.id)
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {project.name}
              </button>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
              No projects yet. Add one to organize related tasks.
            </div>
          )}

          {projects.length > 0 && (
            <div className="mt-3 space-y-2">
              {projects.map((project) => {
                const isEditing = editingProjectId === String(project.id);
                const isDeleting = deletingProjectId === String(project.id);

                if (isEditing) {
                  return (
                    <form
                      key={project.id}
                      onSubmit={handleUpdate}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                          value={editName}
                          onChange={(e) => {
                            setEditName(e.target.value);
                            if (editValidationError) {
                              setEditValidationError("");
                            }
                          }}
                        />
                        <input
                          className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Description"
                        />
                      </div>
                      {editValidationError && (
                        <p className="mt-2 text-sm font-medium text-red-600">
                          {editValidationError}
                        </p>
                      )}
                      <div className="mt-2 flex gap-2">
                        <button
                          type="submit"
                          className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  );
                }

                return (
                  <div
                    key={project.id}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {project.name}
                      </p>
                      {project.description && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                        onClick={() => startEdit(project)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-60"
                        disabled={isDeleting}
                        onClick={() => handleDelete(project)}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:max-w-xs"
        >
          <input
            className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            placeholder="Project name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (validationError) setValidationError("");
            }}
          />
          <input
            className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
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
            className="min-h-10 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            type="submit"
          >
            Add Project
          </button>
        </form>
      </div>
    </section>
  );
}
