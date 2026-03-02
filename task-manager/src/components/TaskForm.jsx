import { useState } from "react";

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function submit(e) {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (cleanTitle.length < 2) return;

    try {
      await onCreate({ title: cleanTitle, description: description.trim() });
      setTitle("");
      setDescription("");
    } catch (err) {
      // error toast already shown in TaskPage; just prevent uncaught promise
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        className="w-full rounded-lg border p-2"
        placeholder="Title"
        value={title}
        required
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-full rounded-lg border p-2"
        placeholder="Description"
        value={description}
        required
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
