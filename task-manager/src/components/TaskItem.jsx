import React, { useState } from "react";
import axios from "axios";
import EditTaskModal from "./EditTaskModal";
import { toast } from "react-toastify";

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleCompleteToggle = async () => {
    try {
      await axios.put(`/tasks/${task.id}`, {
        ...task,
        is_completed: !task.is_completed,
      });
      onUpdate(); // Refresh task list
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/tasks/${task.id}`);
      onDelete(); // Refresh task list
      toast.success("Task deleted!");
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task.");
    }
  };

  const handleSave = async (updatedTask) => {
    try {
      await axios.put(`/tasks/${task.id}`, {
        ...updatedTask,
        is_completed: task.is_completed,
      });
      onUpdate();
      setIsEditing(false);
      toast.success("Task updated successfully!");
    } catch (err) {
      console.error("Error saving task:", err);
      toast.error("Failed to update task.");
    }
  };

  return (
    <div className="bg-white p-4 mb-4 shadow-md rounded-md">
      <h3
        className={`text-xl font-semibold ${
          task.is_completed ? "line-through text-gray-500" : ""
        }`}
      >
        {task.title}
      </h3>
      <p className={`${task.is_completed ? "line-through text-gray-400" : ""}`}>
        {task.description}
      </p>
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={handleCompleteToggle}
          className={`${
            task.is_completed ? "bg-green-500" : "bg-yellow-500"
          } text-white px-4 py-2 rounded`}
        >
          {task.is_completed ? "Completed" : "Mark as Complete"}
        </button>
        <div>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            Delete
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
          <EditTaskModal
            task={task}
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
