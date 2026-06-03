export default function ConfirmDeleteModal({
  isOpen,
  taskTitle,
  onCancel,
  onConfirm,
  deleting = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Delete task?
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          This will permanently delete{" "}
          <span className="font-medium text-slate-900">{taskTitle}</span>.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-60"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>

          <button
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-60"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
