import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { updateActivity } from "../../../../../../api/activities"

const ACTIVITY_TYPES = [
    { value: "explanation", label: "Explanation" },
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "true_false", label: "True / False" },
    { value: "numeric_answer", label: "Numeric Answer" },
    { value: "fill_in_the_blank", label: "Fill in the Blank" },
]


export default function EditActivity() {
    const { subjectId, topicId, lessonId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()


    const activity = location.state?.activity

    const [activityType, setActivityType] = useState(
        activity?.activity_type || "explanation"
    )
    const [title, setTitle] = useState(activity?.title || "")
    const [prompt, setPrompt] = useState(activity?.prompt || "")
    const [explanation, setExplanation] = useState(
        activity?.explanation || ""
    )
    const [correctAnswer, setCorrectAnswer] = useState(
        activity?.correct_answer || ""
    )
    const [position, setPosition] = useState(
        activity?.position?.toString() || ""
    )
    const [saving, setSaving] = useState(false)

    const [options, setOptions] = useState(
        activity?.activity_options?.length
            ? activity.activity_options.map((option) => ({
                id: option.id,
                text: option.text,
                position: option.position,
                is_correct: option.is_correct,
            }))
            : []
    )

    useEffect(() => {
        if (!activity) return

        setActivityType(activity.activity_type)
        setTitle(activity.title || "")
        setPrompt(activity.prompt || "")
        setExplanation(activity.explanation || "")
        setCorrectAnswer(activity.correct_answer || "")
        setPosition(activity.position?.toString() || "")

        setOptions(
            activity.activity_options?.map((option) => ({
                id: option.id,
                text: option.text,
                position: option.position,
                is_correct: option.is_correct,
            })) || []
        )
    }, [activity])

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
        } else if (type === "true_false") {
            setOptions([
                {
                    text: "True",
                    position: 1,
                    is_correct: false,
                },
                {
                    text: "False",
                    position: 2,
                    is_correct: false,
                },
            ])
        } else {
            setOptions([])
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
            const allOptionsFilled = options.every(
                (option) => option.text.trim()
            )

            const correctOptions = options.filter(
                (option) => option.is_correct
            )

            if (!allOptionsFilled) {
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
                        ...(option.id ? { id: option.id } : {}),
                        text: option.text.trim(),
                        position: option.position,
                        is_correct: option.is_correct,
                    }))
                    : []
            await updateActivity(
                activity.id,
                activityType,
                title.trim(),
                prompt.trim(),
                explanation.trim(),
                correctAnswer.trim(),
                Number(position),
                activityOptions
            )

            toast.success("Activity updated successfully")
            backToActivities()
        } catch (error) {
            const errors = error.response?.data?.errors || []

            toast.error(
                errors.join(", ") || "Failed to update activity"
            )
        } finally {
            setSaving(false)
        }
    }

    if (!activity) {
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm">
                <h1 className="text-xl font-semibold text-gray-900">
                    Activity not found
                </h1>

                <button
                    type="button"
                    onClick={backToActivities}
                    className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                >
                    Back to Activities
                </button>
            </div>
        )
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
                    Edit Activity
                </h1>

                <p className="mt-2 text-gray-500">
                    Update this interactive activity.
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
                                        key={option.id || option.position}
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
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    />
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
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    )
}