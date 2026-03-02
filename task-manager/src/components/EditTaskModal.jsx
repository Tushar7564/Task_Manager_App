import { useState } from "react";

export default function EditTaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (cleanTitle.length < 2) return;

    await onSave({
      title: cleanTitle,
      description: description.trim(),
      is_completed: task.is_completed,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Edit Task</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full rounded-lg border p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full rounded-lg border p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-lg border px-4 py-2"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}