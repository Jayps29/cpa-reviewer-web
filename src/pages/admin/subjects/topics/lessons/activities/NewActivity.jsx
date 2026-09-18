import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { createActivity } from "../../../../../../api/activities"


const ACTIVITY_TYPES = [
    { value: "explanation", label: "Explanation" },
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "true_false", label: "True / False" },
    { value: "numeric_answer", label: "Numeric Answer" },
    { value: "fill_in_the_blank", label: "Fill in the Blank" },
]

export default function NewActivity() {
    const { subjectId, topicId, lessonId } = useParams()
    const navigate = useNavigate()

    const [activityType, setActivityType] = useState("explanation")
    const [title, setTitle] = useState("")
    const [prompt, setPrompt] = useState("")
    const [explanation, setExplanation] = useState("")
    const [correctAnswer, setCorrectAnswer] = useState("")
    const [position, setPosition] = useState("")
    const [saving, setSaving] = useState(false)

    const [options, setOptions] = useState([
        { text: "", position: 1, is_correct: false },
        { text: "", position: 2, is_correct: false },
        { text: "", position: 3, is_correct: false },
        { text: "", position: 4, is_correct: false },
    ])

    const backToActivities = () =>
        navigate(
            `/admin/subjects/${subjectId}/topics/${topicId}/lessons/${lessonId}/activities`
        )

    const handleTypeChange = (type) => {
        setActivityType(type)
        setCorrectAnswer("")

        if (type === "multiple_choice") {
            setOptions([
                { text: "", position: 1, is_correct: false },
                { text: "", position: 2, is_correct: false },
                { text: "", position: 3, is_correct: false },
                { text: "", position: 4, is_correct: false },
            ])
        }

        if (type === "true_false") {
            setOptions([
                { text: "True", position: 1, is_correct: false },
                { text: "False", position: 2, is_correct: false },
            ])
        }
    }

    const handleOptionChange = (index, field, value) => {
        setOptions((currentOptions) =>
            currentOptions.map((option, optionIndex) =>
                optionIndex === index
                    ? { ...option, [field]: value }
                    : option
            )
        )
    }

    const handleCorrectOption = (index) => {
        setOptions((currentOptions) =>
            currentOptions.map((option, optionIndex) => ({
                ...option,
                is_correct: optionIndex === index,
            }))
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!title.trim()) {
            toast.error("Activity title is required")
            return
        }

        if (!prompt.trim()) {
            toast.error("Activity prompt is required")
            return
        }

        if (!position || Number(position) < 1) {
            toast.error("Activity position must be 1 or higher")
            return
        }

        if (activityType === "multiple_choice") {
            const validOptions = options.every(
                (option) => option.text.trim()
            )

            const correctOptions = options.filter(
                (option) => option.is_correct
            )

            if (!validOptions) {
                toast.error("All options are required")
                return
            }

            if (correctOptions.length !== 1) {
                toast.error("Select exactly one correct option")
                return
            }
        }

        if (activityType === "true_false") {
            const correctOptions = options.filter(
                (option) => option.is_correct
            )

            if (correctOptions.length !== 1) {
                toast.error("Select exactly one correct answer")
                return
            }
        }

        if (
            ["numeric_answer", "fill_in_the_blank"].includes(
                activityType
            ) &&
            !correctAnswer.trim()
        ) {
            toast.error("Correct answer is required")
            return
        }

        try {
            setSaving(true)

            const activityOptions =
                activityType === "multiple_choice" ||
                    activityType === "true_false"
                    ? options.map((option) => ({
                        ...option,
                        text: option.text.trim(),
                    }))
                    : []

            await createActivity(
                lessonId,
                activityType,
                title.trim(),
                prompt.trim(),
                explanation.trim(),
                correctAnswer.trim(),
                Number(position),
                activityOptions
            )

            toast.success("Activity created successfully")
            backToActivities()
        } catch (error) {
            const errors = error.response?.data?.errors || []

            toast.error(
                errors.join(", ") || "Failed to create activity"
            )
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8">
                <button
                    type="button"
                    onClick={backToActivities}
                    className="mb-4 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                    ← Back to Activities
                </button>

                <h1 className="text-3xl font-bold text-gray-900">
                    Add Activity
                </h1>

                <p className="mt-2 text-gray-500">
                    Create an interactive activity for this lesson.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-xl bg-white p-6 shadow-sm"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Activity Type
                    </label>

                    <select
                        value={activityType}
                        onChange={(e) =>
                            handleTypeChange(e.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    >
                        {ACTIVITY_TYPES.map((type) => (
                            <option
                                key={type.value}
                                value={type.value}
                            >
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">
                        Title
                    </label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Audit Evidence Basics"
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    />
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">
                        Prompt
                    </label>

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        placeholder="Enter the question or learning content..."
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    />
                </div>

                {(activityType === "multiple_choice" ||
                    activityType === "true_false") && (
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">
                                Options
                            </label>

                            <div className="mt-3 space-y-3">
                                {options.map((option, index) => (
                                    <div
                                        key={option.position}
                                        className="flex items-center gap-3"
                                    >
                                        <input
                                            type="text"
                                            value={option.text}
                                            onChange={(e) =>
                                                handleOptionChange(
                                                    index,
                                                    "text",
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                activityType ===
                                                "true_false"
                                            }
                                            placeholder={`Option ${index + 1}`}
                                            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCorrectOption(
                                                    index
                                                )
                                            }
                                            className={`rounded-lg px-3 py-2 text-sm font-medium ${option.is_correct
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {option.is_correct
                                                ? "Correct"
                                                : "Mark Correct"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                {(activityType === "numeric_answer" ||
                    activityType === "fill_in_the_blank") && (
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">
                                Correct Answer
                            </label>

                            <input
                                type="text"
                                value={correctAnswer}
                                onChange={(e) =>
                                    setCorrectAnswer(e.target.value)
                                }
                                placeholder="Enter the correct answer"
                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                            />
                        </div>
                    )}

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">
                        Explanation
                    </label>

                    <textarea
                        value={explanation}
                        onChange={(e) =>
                            setExplanation(e.target.value)
                        }
                        rows={4}
                        placeholder="Explain why the answer is correct..."
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
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
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="1"
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                        Determines the activity order within the lesson.
                    </p>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={backToActivities}
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
                        {saving ? "Creating..." : "Create Activity"}
                    </button>
                </div>
            </form>
        </div>
    )
}