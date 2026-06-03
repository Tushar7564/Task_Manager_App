import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/30 md:block">
        <div>
          <h2 className="text-xl font-bold tracking-tight">TaskFlow</h2>
          <p className="mt-1 text-sm text-slate-400">SaaS Task Manager</p>
        </div>

        <nav className="mt-8 space-y-2">
          <a className="block rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium shadow-lg shadow-blue-950/30">
            Dashboard
          </a>
          <a className="block rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-slate-200">
            Projects
          </a>
          <a className="block rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-slate-200">
            Settings
          </a>
        </nav>
      </aside>

      <main className="md:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-300 md:hidden">
                TaskFlow
              </p>
              <h1 className="truncate text-xl font-semibold tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-slate-400">
                Welcome, {user?.name || "User"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="shrink-0 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="px-4 py-5 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
