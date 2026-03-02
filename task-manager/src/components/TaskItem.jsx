import EditTaskModal from "./EditTaskModal";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  return (
    <div className="bg-white p-4 mb-4 shadow-md rounded-md">
      <h3
        className={`text-xl font-semibold ${
          task.is_completed ? "line-through text-gray-500" : ""
        }`}
      >
        {task.title}
      </h3>

      {task.description ? (
        <p className={`${task.is_completed ? "line-through text-gray-400" : ""}`}>
          {task.description}
        </p>
      ) : null}

      <div className="flex justify-between items-center mt-3">
        <button
          onClick={onToggle}
          className={`${
            task.is_completed ? "bg-green-500" : "bg-yellow-500"
          } text-white px-4 py-2 rounded`}
        >
          {task.is_completed ? "Completed" : "Mark as Complete"}
        </button>

        <div className="flex gap-2">
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
          <button
            onClick={onEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}