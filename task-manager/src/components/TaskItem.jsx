import EditTaskModal from "./EditTaskModal";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <button
            onClick={onToggle}
            className={`mt-1 h-5 w-5 rounded-md border transition
          ${task.is_completed ? "bg-slate-900 border-slate-900" : "bg-white border-slate-300 hover:border-slate-400"}
        `}
            aria-label="Toggle complete"
          />

          <div>
            <div className="flex items-center gap-2">
              <h3
                className={`text-sm font-semibold ${task.is_completed ? "text-slate-400 line-through" : "text-slate-900"}`}
              >
                {task.title}
              </h3>
              {task.is_completed && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  Completed
                </span>
              )}
            </div>

            {task.description ? (
              <p
                className={`mt-1 text-sm ${task.is_completed ? "text-slate-400" : "text-slate-600"}`}
              >
                {task.description}
              </p>
            ) : null}
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
