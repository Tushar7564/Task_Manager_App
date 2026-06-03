import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";

const byPrefixAndName = {
  fas: {
    list: faList,
    "square-kanban": faTableColumns,
  },
};

export default function TaskToolbar({
  filter,
  setFilter,
  search,
  setSearch,
  sort,
  setSort,
  counts,
  viewMode = "list",
  setViewMode,
}) {
  const filters = [
    { key: "all", label: `All (${counts.all})` },
    { key: "active", label: `Active (${counts.active})` },
    { key: "completed", label: `Completed (${counts.completed})` },
  ];

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`min-h-10 rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${
                filter === f.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 md:w-64"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="min-h-10 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title_asc">Title A–Z</option>
            <option value="completed_last">Completed last</option>
          </select>

          {setViewMode && (
            <div className="flex h-10 w-24 shrink-0 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                title="List View"
                aria-label="List View"
                onClick={() => setViewMode("list")}
                className={`flex h-8 flex-1 items-center justify-center rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-slate-100 ${
                  viewMode === "list"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <FontAwesomeIcon icon={byPrefixAndName.fas["list"]} />
              </button>
              <button
                type="button"
                title="Kanban View"
                aria-label="Kanban View"
                onClick={() => setViewMode("kanban")}
                className={`flex h-8 flex-1 items-center justify-center rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-slate-100 ${
                  viewMode === "kanban"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <FontAwesomeIcon icon={byPrefixAndName.fas["square-kanban"]} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
