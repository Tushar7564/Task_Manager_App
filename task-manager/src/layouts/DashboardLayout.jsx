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
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-slate-900 p-6 md:block">
        <h2 className="text-xl font-bold">TaskFlow</h2>
        <p className="mt-1 text-sm text-slate-400">SaaS Task Manager</p>

        <nav className="mt-8 space-y-2">
          <a className="block rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium">
            Dashboard
          </a>
          <a className="block rounded-xl px-4 py-3 text-sm text-slate-400">
            Projects
          </a>
          <a className="block rounded-xl px-4 py-3 text-sm text-slate-400">
            Settings
          </a>
        </nav>
      </aside>

      <main className="md:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-lg font-semibold">Dashboard</h1>
              <p className="text-sm text-slate-400">
                Welcome, {user?.name || "User"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;