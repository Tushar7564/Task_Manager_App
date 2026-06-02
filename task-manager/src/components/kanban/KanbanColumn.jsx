import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import KanbanCard from "./KanbanCard.jsx";

export default function KanbanColumn({
  column,
  tasks,
  onToggle,
  onDelete,
  onEdit,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <section
      ref={setNodeRef}
      className={`min-h-80 rounded-2xl border border-slate-200 bg-slate-50 p-4 ${
        isOver ? "ring-2 ring-slate-300" : ""
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          {column.title}
        </h2>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 shadow-sm">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((task) => String(task.id))}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onToggle={() => onToggle(task)}
              onDelete={() => onDelete(task)}
              onEdit={() => onEdit(task)}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center text-sm text-slate-400">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}
