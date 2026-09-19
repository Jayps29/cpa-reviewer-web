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
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">
                    Loading lesson...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (!lesson) {
        return null
    }

    return (
        <div className="mx-auto max-w-4xl p-6">
            <Link
                to="/subjects"
                className="text-sm text-indigo-600 hover:text-indigo-800"
            >
                ← Back to Subjects
            </Link>

            <div className="mt-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {lesson.title}
                </h1>

                {lesson.description && (
                    <p className="mt-3 text-gray-600">
                        {lesson.description}
                    </p>
                )}
            </div>

            <article className="mt-8 rounded-xl bg-white p-8 shadow-sm">
                <div className="whitespace-pre-line text-gray-800 leading-7">
                    {lesson.content}
                </div>
            </article>

            <div className="mt-8 flex justify-end">
                <Link
                    to={`/lessons/${lesson.id}/learn`}
                    className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
                >
                    Start Activities
                </Link>
            </div>
        </div>
    )
}