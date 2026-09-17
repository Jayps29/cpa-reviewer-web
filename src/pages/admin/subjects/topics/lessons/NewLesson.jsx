import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { createLesson } from "../../../../../api/lessons"

export default function NewLesson() {
    const { subjectId, topicId } = useParams()
    const navigate = useNavigate()

    const [positionError, setPositionError] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [position, setPosition] = useState("")
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

            await createLesson(
                topicId,
                title.trim(),
                description.trim(),
                Number(position)
            )

            toast.success("Lesson created successfully")

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
                    errors.join(", ") || "Failed to create lesson"
                )
            }
        } finally {
            setSaving(false)
        }
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
                    Add Lesson
                </h1>

                <p className="mt-2 text-gray-500">
                    Create a new lesson for this topic.
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
                        placeholder="e.g. Introduction to Audit Evidence"
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
                        placeholder="Describe what students will learn..."
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
                        placeholder="1"
                        className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 ${positionError
                                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                : "border-gray-300 focus:border-gray-500 focus:ring-gray-200"
                            }`}
                    />

                    {positionError ? (
                        <p className="mt-1 text-sm text-red-600">
                            {positionError}
                        </p>
                    ) : (
                        <p className="mt-1 text-xs text-gray-500">
                            Determines the lesson order.
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
                        {saving ? "Creating..." : "Create Lesson"}
                    </button>
                </div>
            </form>
        </div>
    )
}