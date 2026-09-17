import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getLessons } from "../../../../../api/lessons"
import { toast } from "sonner"
import { deleteLesson } from "../../../../../api/lessons"
import DeleteLessonModal from "../../../../../components/admin/DeleteLessonModal"

export default function Lessons() {
    const { subjectId, topicId } = useParams()
    const navigate = useNavigate()

    const [selectedLesson, setSelectedLesson] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const data = await getLessons(topicId)
                setLessons(data)
            } catch (error) {
                console.error("Failed to fetch lessons:", error)
                setError("Failed to load lessons.")
            } finally {
                setLoading(false)
            }
        }

        fetchLessons()
    }, [topicId])

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />

                    <p className="mt-3 text-sm text-gray-500">
                        Loading lessons...
                    </p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <h2 className="font-semibold text-red-800">
                    Something went wrong
                </h2>

                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            </div>
        )
    }

    const handleDelete = async () => {
        if (!selectedLesson) return

        try {
            setDeleting(true)

            await deleteLesson(selectedLesson.id)

            setLessons((currentLessons) =>
                currentLessons.filter(
                    (lesson) => lesson.id !== selectedLesson.id
                )
            )

            toast.success("Lesson deleted successfully")
            setSelectedLesson(null)
        } catch (error) {
            const message =
                error.response?.data?.error ||
                "Failed to delete lesson"

            toast.error(message)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-start justify-between">
                <div>
                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/admin/subjects/${subjectId}/topics`)
                        }
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                        ← Back to Topics
                    </button>

                    <h1 className="mt-4 text-3xl font-bold text-gray-900">
                        Manage Lessons
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage the lessons for this CPA topic.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/admin/subjects/${subjectId}/topics/${topicId}/lessons/new`
                        )
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <span className="text-lg leading-none">+</span>
                    Add Lesson
                </button>
            </div>

            {/* Stats */}
            <div className="mt-8">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Total Lessons
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {lessons.length}
                    </p>
                </div>
            </div>

            {/* Lessons */}
            <div className="mt-8">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        All Lessons
                    </h2>

                    <p className="text-sm text-gray-500">
                        Manage the lessons available under this topic.
                    </p>
                </div>

                {lessons.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                            📚
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-gray-900">
                            No lessons yet
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Add the first lesson for this topic.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/admin/subjects/${subjectId}/topics/${topicId}/lessons/new`
                                )
                            }
                            className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            Add Lesson
                        </button>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="divide-y divide-gray-100">
                            {lessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className="flex items-center justify-between p-6 transition hover:bg-gray-50"
                                >
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                                            {lesson.position}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-900">
                                                {lesson.title}
                                            </h3>

                                            <p className="mt-1 max-w-xl truncate text-sm text-gray-500">
                                                {lesson.description ||
                                                    "No description provided."}
                                            </p>

                                            <p className="mt-2 text-xs text-gray-400">
                                                Lesson ID: {lesson.id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-6 flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/subjects/${subjectId}/topics/${topicId}/lessons/${lesson.id}/edit`,
                                                    {
                                                        state: { lesson },
                                                    }
                                                )
                                            }
                                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedLesson(lesson)}
                                            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <DeleteLessonModal
                lesson={selectedLesson}
                deleting={deleting}
                onConfirm={handleDelete}
                onCancel={() => setSelectedLesson(null)}
            />

        </div>
    )
}