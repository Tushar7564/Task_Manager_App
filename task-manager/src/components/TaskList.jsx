import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskItem from "./TaskItem";

const TaskList = ({ refreshFlag }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  // Function to fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get("/tasks"); // This will hit the backend API
      setTasks(response.data); // Set the tasks in state
    } catch (err) {
      setError("Error fetching tasks");
      console.error("Error fetching tasks:", err);
    }
  };

  // Call fetchTasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [refreshFlag]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      {error && <p>{error}</p>} {/* Display error if fetching fails */}
      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        tasks.map((task) => {
          return (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={fetchTasks}
              onDelete={fetchTasks}
            />
          );
        })
      )}
    </div>
  );
};

export default TaskList;
