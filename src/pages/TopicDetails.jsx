import { useEffect, useState } from "react"
import {
    Link,
    useParams,
    useLocation,
} from "react-router-dom"
import {
    getLessons,
    getLessonProgress,
} from "../api/lessons"

export default function TopicDetails() {
    const { topicId } = useParams()
    const location = useLocation()

    const [lessons, setLessons] = useState([])
    const [progress, setProgress] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const loadLessons = async () => {
            try {
                setLoading(true)
                setError("")

                // Load lessons
                const data = await getLessons(topicId)

                setLessons(data)

                // Load progress for each lesson
                const progressData = {}

                for (const lesson of data) {
                    try {
                        const lessonProgress =
                            await getLessonProgress(lesson.id)

                        progressData[lesson.id] =
                            lessonProgress
                    } catch (error) {
                        console.error(
                            `Failed to load progress for lesson ${lesson.id}:`,
                            error
                        )

                        // Keep a default value if progress
                        // cannot be loaded
                        progressData[lesson.id] = {
                            completed: 0,
                            total: 0,
                            percentage: 0,
                            score: {
                                correct: 0,
                                total: 0,
                            },
                        }
                    }
                }

                setProgress(progressData)
            } catch (error) {
                console.error(
                    "Failed to load lessons:",
                    error
                )

                setError("Failed to load lessons.")
            } finally {
                setLoading(false)
            }
        }

        loadLessons()
    }, [topicId, location.key])

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-gray-500">
                    Loading lessons...
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

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <Link
                    to="/subjects"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                    ← Back to Subjects
                </Link>

                <h1 className="mt-4 text-3xl font-bold text-gray-900">
                    Lessons
                </h1>

                <p className="mt-2 text-gray-500">
                    Study the lesson materials before answering
                    the activities.
                </p>
            </div>

            {/* Lessons */}
            {lessons.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-gray-500">
                        No lessons available yet.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2">
                    {lessons.map((lesson) => {
                        const lessonProgress =
                            progress[lesson.id]

                        const percentage =
                            lessonProgress?.percentage ?? 0

                        const completed =
                            lessonProgress?.completed_activities ?? 0

                        const total =
                            lessonProgress?.total_activities ?? 0

                        const correct =
                            lessonProgress?.score?.correct ?? 0

                        const scoreTotal =
                            lessonProgress?.score?.total ?? total

                        const isCompleted =
                            lessonProgress?.completed === true

                        const hasStarted =
                            completed > 0

                        let buttonText = "Start Lesson"

                        if (isCompleted) {
                            buttonText = "Review Lesson"
                        } else if (hasStarted) {
                            buttonText = "Continue Lesson"
                        }

                        return (
                            <div
                                key={lesson.id}
                                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                            >
                                {/* Lesson information */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {lesson.title}
                                    </h2>

                                    {lesson.description && (
                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                                            {lesson.description}
                                        </p>
                                    )}
                                </div>

                                {/* Progress */}
                                <div className="mt-5">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">
                                            Progress
                                        </span>

                                        <span className="text-sm font-semibold text-gray-900">
                                            {percentage}%
                                        </span>
                                    </div>

                                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                                            style={{
                                                width: `${percentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Activities completed */}
                                <div className="mt-4 flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                        Activities completed
                                    </span>

                                    <span className="font-medium text-gray-700">
                                        {completed} / {total}
                                    </span>
                                </div>

                                {/* Score */}
                                {scoreTotal > 0 && (
                                    <div className="mt-1 flex items-center justify-between text-sm">
                                        <span className="text-gray-500">
                                            Score
                                        </span>

                                        <span className="font-medium text-gray-700">
                                            {correct} /{" "}
                                            {scoreTotal}
                                        </span>
                                    </div>
                                )}

                                {/* Action */}
                                <div className="mt-5">
                                    <Link
                                        to={`/lessons/${lesson.id}`}
                                        className="block w-full rounded-lg bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        {buttonText}
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}