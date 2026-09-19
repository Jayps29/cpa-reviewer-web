import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getLessons } from "../api/lessons"

export default function TopicDetails() {
    const { topicId } = useParams()

    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const loadLessons = async () => {
            try {
                const data = await getLessons(topicId)
                setLessons(data)
            } catch (error) {
                console.error(error)
                setError("Failed to load lessons.")
            } finally {
                setLoading(false)
            }
        }

        loadLessons()
    }, [topicId])

    if (loading) {
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm">
                <p className="text-gray-500">
                    Loading lessons...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm">
                <p className="text-red-500">
                    {error}
                </p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    to="/subjects"
                    className="mb-4 inline-block text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                    ← Back to Subjects
                </Link>

                <h1 className="text-3xl font-bold text-gray-900">
                    Lessons
                </h1>

                <p className="mt-2 text-gray-500">
                    Choose a lesson to study.
                </p>
            </div>

            {/* Empty State */}
            {lessons.length === 0 ? (
                <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                    <p className="text-gray-500">
                        No lessons available yet.
                    </p>
                </div>
            ) : (
                /* Lesson Cards */
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {lessons.map((lesson, index) => (
                        <Link
                            key={lesson.id}
                            to={`/lessons/${lesson.id}`}
                            className="group rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex h-full flex-col">
                                {/* Lesson Number */}
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-600">
                                    {index + 1}
                                </div>

                                {/* Lesson Title */}
                                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                                    {lesson.title}
                                </h2>

                                {/* Lesson Description */}
                                {lesson.description && (
                                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                                        {lesson.description}
                                    </p>
                                )}

                                {/* Study Action */}
                                <div className="mt-auto pt-6 text-sm font-medium text-indigo-600">
                                    Study Lesson →
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}