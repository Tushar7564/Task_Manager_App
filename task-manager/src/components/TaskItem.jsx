const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const priorityClasses = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

const statusLabels = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

function formatDate(value) {
  if (!value) return "";

  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const priority = task.priority || "medium";
  const status = task.status || "todo";
  const dueDate =
    task.dueDate || (task.due_date ? task.due_date.split("T")[0] : "");
  const projectName = task.projectName || task.project?.name || "";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <button
            onClick={onToggle}
            className={`mt-1 h-5 w-5 rounded-md border transition
          ${task.completed ? "bg-slate-900 border-slate-900" : "bg-white border-slate-300 hover:border-slate-400"}
        `}
            aria-label="Toggle complete"
          />

          <div>
            <div className="flex items-center gap-2">
              <h3
                className={`text-sm font-semibold ${task.completed ? "text-slate-400 line-through" : "text-slate-900"}`}
              >
                {task.title}
              </h3>
              {task.completed && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  completed
                </span>
              )}
            </div>

            {task.description ? (
              <p
                className={`mt-1 text-sm ${task.completed ? "text-slate-400" : "text-slate-600"}`}
              >
                {task.description}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${priorityClasses[priority] || priorityClasses.medium}`}
              >
                {priorityLabels[priority] || priorityLabels.medium} priority
              </span>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                {statusLabels[status] || statusLabels.todo}
              </span>
              {dueDate && (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                  Due {formatDate(dueDate)}
                </span>
              )}
              {projectName && (
                <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                  {projectName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
