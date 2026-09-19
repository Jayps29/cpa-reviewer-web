import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
    getLessonForLearning,
    submitActivityAnswer,
} from "../api/lessons"

export default function LessonPlayer() {
    const { lessonId } = useParams()

    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [currentIndex, setCurrentIndex] = useState(0)
    const [answer, setAnswer] = useState("")
    const [feedback, setFeedback] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const loadLesson = async () => {
            try {
                const data = await getLessonForLearning(lessonId)
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

    const currentActivity = lesson?.activities?.[currentIndex]

    const handleSubmit = async () => {
        if (!currentActivity || submitting) {
            return
        }

        if (answer === "") {
            return
        }

        try {
            setSubmitting(true)

            const result = await submitActivityAnswer(
                currentActivity.id,
                answer
            )

            setFeedback(result)
        } catch (error) {
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleNext = () => {
        setCurrentIndex((currentIndex) => currentIndex + 1)
        setAnswer("")
        setFeedback(null)
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading lesson...</p>
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

    if (!currentActivity) {
        return (
            <div className="mx-auto max-w-3xl p-6 text-center">
                <h1 className="text-3xl font-bold">
                    Lesson Complete!
                </h1>

                <p className="mt-2 text-gray-600">
                    You have finished this lesson.
                </p>
            </div>
        )
    }

    const isExplanation =
        currentActivity.activity_type === "explanation"

    const isAnswered = feedback !== null

    return (
        <div className="mx-auto max-w-3xl p-6">
            {/* Lesson header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    {lesson.title}
                </h1>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{
                            width: `${((currentIndex + 1) /
                                    lesson.activities.length) *
                                100
                                }%`,
                        }}
                    />
                </div>

                <p className="mt-2 text-sm text-gray-500">
                    Activity {currentIndex + 1} of{" "}
                    {lesson.activities.length}
                </p>
            </div>

            {/* Activity */}
            <div className="rounded-xl border p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">
                    {currentActivity.title}
                </h2>

                {currentActivity.prompt && (
                    <p className="mt-4 text-lg">
                        {currentActivity.prompt}
                    </p>
                )}

                {/* Explanation */}
                {isExplanation && (
                    <div className="mt-6 rounded-lg bg-gray-50 p-5">
                        <p className="text-gray-700">
                            {currentActivity.explanation}
                        </p>
                    </div>
                )}

                {/* Multiple Choice / True False */}
                {!isExplanation &&
                    (currentActivity.activity_type ===
                        "multiple_choice" ||
                        currentActivity.activity_type ===
                        "true_false") && (
                        <div className="mt-6 space-y-3">
                            {currentActivity.options.map(
                                (option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        disabled={isAnswered}
                                        onClick={() =>
                                            setAnswer(
                                                String(option.id)
                                            )
                                        }
                                        className={`w-full rounded-lg border p-4 text-left transition ${answer ===
                                                String(option.id)
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:bg-gray-50"
                                            } ${isAnswered
                                                ? "cursor-default"
                                                : ""
                                            }`}
                                    >
                                        {option.text}
                                    </button>
                                )
                            )}
                        </div>
                    )}

                {/* Numeric / Fill in the Blank */}
                {!isExplanation &&
                    (currentActivity.activity_type ===
                        "numeric_answer" ||
                        currentActivity.activity_type ===
                        "fill_in_the_blank") && (
                        <input
                            type="text"
                            value={answer}
                            disabled={isAnswered}
                            onChange={(event) =>
                                setAnswer(event.target.value)
                            }
                            placeholder="Enter your answer"
                            className="mt-6 w-full rounded-lg border p-4 outline-none focus:border-blue-500"
                        />
                    )}

                {/* Feedback */}
                {feedback && (
                    <div
                        className={`mt-6 rounded-lg border p-4 ${feedback.attempt.correct
                                ? "border-green-300 bg-green-50"
                                : "border-red-300 bg-red-50"
                            }`}
                    >
                        <p
                            className={`font-semibold ${feedback.attempt.correct
                                    ? "text-green-700"
                                    : "text-red-700"
                                }`}
                        >
                            {feedback.attempt.correct
                                ? "Correct!"
                                : "Incorrect"}
                        </p>

                        {feedback.explanation && (
                            <p className="mt-2 text-gray-700">
                                {feedback.explanation}
                            </p>
                        )}
                    </div>
                )}

                {/* Buttons */}
                <div className="mt-6">
                    {isExplanation && !feedback && (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600"
                        >
                            Continue
                        </button>
                    )}

                    {!isExplanation && !feedback && (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={
                                answer === "" || submitting
                            }
                            className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting
                                ? "Checking..."
                                : "Check Answer"}
                        </button>
                    )}

                    {!isExplanation && feedback && (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}