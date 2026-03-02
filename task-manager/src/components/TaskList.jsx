import TaskItem from "./TaskItem.jsx";

export default function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  return (
    <div className="mt-4 space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggle(task)}
          onDelete={() => onDelete(task)}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}