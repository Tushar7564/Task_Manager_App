import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const priorityClasses = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-red-200 bg-red-50 text-red-700",
};

function formatDate(value) {
  if (!value) return "";

  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function KanbanCard({ task, onToggle, onDelete, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(task.id) });

  const priority = task.priority || "medium";
  const dueDate =
    task.dueDate || (task.due_date ? task.due_date.split("T")[0] : "");
  const projectName = task.projectName || task.project?.name || "";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${
        isDragging ? "opacity-70 ring-2 ring-slate-300" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          className={`mt-1 h-5 w-5 shrink-0 rounded-md border transition ${
            task.completed
              ? "border-slate-900 bg-slate-900"
              : "border-slate-300 bg-white hover:border-slate-400"
          }`}
          aria-label="Toggle complete"
          onClick={onToggle}
        />

        <button
          type="button"
          className="cursor-grab rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-400 active:cursor-grabbing"
          aria-label="Drag task"
          {...attributes}
          {...listeners}
        >
          ::
        </button>
      </div>

      <h3
        className={`mt-2 text-sm font-semibold ${
          task.completed ? "text-slate-400 line-through" : "text-slate-900"
        }`}
      >
        {task.title}
      </h3>

      {task.description ? (
        <p
          className={`mt-1 text-sm ${
            task.completed ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {task.description}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
            priorityClasses[priority] || priorityClasses.medium
          }`}
        >
          {priorityLabels[priority] || priorityLabels.medium} priority
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

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          type="button"
          className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
