import React, { useState } from "react";
import axios from "axios";

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      onTaskAdded(); // To refetch the task list
    } catch (err) {
      console.error("Error adding tasks:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 shadow-md rounded-md mb-4"
    >
      <h2 className="text-lg font-semibold mb-2">Add a New Task</h2>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        className="border p-2 w-full mb-2"
        required
      />
      <textarea
        placeholder="Optional description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        className="border p-2 w-full mb-2"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add task
      </button>
    </form>
  );
};

export default TaskForm;
