import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskPage from "./pages/TaskPage.jsx";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Task Manager
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Clean CRUD app with filters, search, and modals
          </p>
        </div>

        <TaskPage />
      </div>
    </div>
  );
}

export default App;