import React, { useState } from "react";
import "./App.css";
import TaskList from "./components/TaskList.jsx";
import TaskForm from "./components/TaskForm.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refreshTasks = () => {
    setRefreshFlag(!refreshFlag); // Triggers re-render in TaskList
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="App w-auto">
        <h1 className="text-4xl font-bold text-center my-6">Task Manager</h1>
        <TaskForm onTaskAdded={refreshTasks} />
        <TaskList refreshFlag={refreshFlag} />
      </div>
    </>
  );
}

export default App;
