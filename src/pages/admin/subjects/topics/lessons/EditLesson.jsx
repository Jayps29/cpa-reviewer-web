import { useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { updateLesson } from "../../../../../api/lessons"

export default function EditLesson() {
    const { subjectId, topicId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    const lesson = location.state?.lesson

    const [positionError, setPositionError] = useState("")
    const [title, setTitle] = useState(lesson?.title || "")
    const [description, setDescription] = useState(
        lesson?.description || ""
    )
    const [position, setPosition] = useState(
        lesson?.position?.toString() || ""
    )
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        setPositionError("")

        if (!title.trim()) {
            toast.error("Lesson title is required")
            return
        }

        if (!position || Number(position) < 1) {
            setPositionError("Lesson position must be 1 or higher")
            return
        }

        try {
            setSaving(true)

            await updateLesson(
                lesson.id,
                title.trim(),
                description.trim(),
                Number(position)
            )

            toast.success("Lesson updated successfully")

            navigate(
                `/admin/subjects/${subjectId}/topics/${topicId}/lessons`
            )
        } catch (error) {
            const errors = error.response?.data?.errors || []

            const duplicatePositionError = errors.find((message) =>
                message.toLowerCase().includes("position")
            )

            if (duplicatePositionError) {
                setPositionError(duplicatePositionError)
            } else {
                toast.error(
                    errors.join(", ") || "Failed to update lesson"
                )
            }
        } finally {
            setSaving(false)
        }
    }

    if (!lesson) {
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm">
                <h1 className="text-xl font-semibold text-gray-900">
                    Lesson not found
                </h1>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/admin/subjects/${subjectId}/topics/${topicId}/lessons`
                        )
                    }
                    className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                >
                    Back to Lessons
                </button>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8">
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/admin/subjects/${subjectId}/topics/${topicId}/lessons`
                        )
                    }
                    className="mb-4 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                    ← Back to Lessons
                </button>

                <h1 className="text-3xl font-bold text-gray-900">
                    Edit Lesson
                </h1>

                <p className="mt-2 text-gray-500">
                    Update the lesson information.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-xl bg-white p-6 shadow-sm"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Lesson Title
                    </label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    />
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        rows={5}
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    />
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">
                        Position
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={position}
                        onChange={(e) => {
                            setPosition(e.target.value)
                            setPositionError("")
                        }}
                        className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 ${positionError
                                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                : "border-gray-300 focus:border-gray-500 focus:ring-gray-200"
                            }`}
                    />

                    {positionError && (
                        <p className="mt-1 text-sm text-red-600">
                            {positionError}
                        </p>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/admin/subjects/${subjectId}/topics/${topicId}/lessons`
                            )
                        }
                        disabled={saving}
                        className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    )
}