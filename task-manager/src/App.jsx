import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskPage from "./pages/TaskPage.jsx";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="App w-auto">
        <h1 className="text-4xl font-bold text-center my-6">Task Manager</h1>
        <TaskPage />
      </div>
    </>
  );
}

export default App;