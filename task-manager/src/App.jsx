import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskPage from "./pages/TaskPage.jsx";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName="rounded-xl border border-slate-200 bg-white text-sm text-slate-800 shadow-xl"
        progressClassName="bg-blue-600"
      />

      <div className="mx-auto w-full max-w-7xl px-0 py-0 sm:px-2 lg:px-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
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
