import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn.jsx";

const columns = [
  { id: "todo", title: "Todo" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

const getKanbanStatus = (task) => {
  if (!task) return "";
  if (task.completed || task.status === "done") return "done";
  if (task.status === "in_progress") return "in_progress";
  return "todo";
};

export default function KanbanBoard({
  tasks,
  onStatusChange,
  onToggle,
  onDelete,
  onEdit,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const taskById = new Map(tasks.map((task) => [String(task.id), task]));

  const tasksByStatus = columns.reduce((groups, column) => {
    groups[column.id] = tasks.filter(
      (task) => getKanbanStatus(task) === column.id,
    );
    return groups;
  }, {});

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const task = taskById.get(String(active.id));
    if (!task) return;

    const overId = String(over.id);
    const targetStatus = columns.some((column) => column.id === overId)
      ? overId
      : getKanbanStatus(taskById.get(overId));

    if (!targetStatus || getKanbanStatus(task) === targetStatus) return;

    onStatusChange(task, targetStatus);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="mt-4 grid items-start gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasksByStatus[column.id]}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </DndContext>
  );
}
