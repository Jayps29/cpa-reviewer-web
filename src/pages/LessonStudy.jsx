import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getLessonForStudy } from "../api/lessons"

export default function LessonStudy() {
    const { lessonId } = useParams()

    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const loadLesson = async () => {
            try {
                const data = await getLessonForStudy(lessonId)
                setLesson(data)
            } catch (error) {
                console.error(error)
                setError("Failed to load lesson.")
            } finally {
                setLoading(false)
            }
        }

        loadLesson()
    }, [lessonId])

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-gray-500">
                    Loading lesson...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="text-red-600">
                    {error}
                </p>
            </div>
        )
    }

    if (!lesson) {
        return null
    }

    return (
        <div className="mx-auto max-w-4xl">
            {/* Back */}
            <Link
                to="/subjects"
                className="text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
            >
                ← Back to Subjects
            </Link>

            {/* Lesson Header */}
            <div className="mt-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                        Study Material
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-900">
                        {lesson.title}
                    </h1>

                    {lesson.description && (
                        <p className="mt-3 text-base leading-7 text-gray-600">
                            {lesson.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Study Material */}
            <article className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Lesson Material
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Read the material carefully before answering
                        the activities.
                    </p>
                </div>

                {lesson.content ? (
                    <div className="whitespace-pre-line text-base leading-8 text-gray-700">
                        {lesson.content}
                    </div>
                ) : (
                    <div className="rounded-lg bg-gray-50 p-6 text-center">
                        <p className="text-gray-500">
                            No study material has been added to
                            this lesson yet.
                        </p>
                    </div>
                )}
            </article>

            {/* Start Activities */}
            <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Ready to test your knowledge?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Complete the activities based on the
                            lesson material you just studied.
                        </p>
                    </div>

                    <Link
                        to={`/lessons/${lesson.id}/learn`}
                        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Start Activities →
                    </Link>
                </div>
            </div>
        </div>
    )
}