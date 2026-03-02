export default function ConfirmDeleteModal({
  isOpen,
  taskTitle,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Delete task?
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          This will permanently delete{" "}
          <span className="font-medium text-slate-900">{taskTitle}</span>.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}