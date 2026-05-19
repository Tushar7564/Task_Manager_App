import { useState } from "react";

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");

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
      await onCreate({ title: cleanTitle, description: description.trim() });
      setTitle("");
      setDescription("");
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
      <button
        className="rounded-lg bg-black px-4 py-2 text-white"
        type="submit"
      >
        Add Task
      </button>
    </form>
  );
}
