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
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                          value={editName}
                          onChange={(e) => {
                            setEditName(e.target.value);
                            if (editValidationError) {
                              setEditValidationError("");
                            }
                          }}
                        />
                        <input
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
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
                          className="rounded-lg bg-black px-3 py-2 text-sm text-white"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-white"
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
                    className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
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
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-white"
                        onClick={() => startEdit(project)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
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
