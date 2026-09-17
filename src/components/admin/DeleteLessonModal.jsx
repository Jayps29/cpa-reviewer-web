export default function DeleteLessonModal({
    lesson,
    deleting,
    onConfirm,
    onCancel,
}) {
    if (!lesson) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-gray-900">
                    Delete Lesson?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-900">
                        {lesson.title}
                    </span>
                    ? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={deleting}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={deleting}
                        className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                        {deleting ? "Deleting..." : "Delete Lesson"}
                    </button>
                </div>
            </div>
        </div>
    )
}