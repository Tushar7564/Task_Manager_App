export default function ConfirmDeleteModal({ isOpen, taskTitle, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Delete task?</h2>
        <p className="mt-2 text-sm text-gray-600">
          This will permanently delete <span className="font-medium">{taskTitle}</span>.
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded-lg border px-4 py-2" onClick={onCancel}>
            Cancel
          </button>
          <button className="rounded-lg bg-red-600 px-4 py-2 text-white" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}