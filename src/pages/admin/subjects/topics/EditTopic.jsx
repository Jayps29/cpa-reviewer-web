import { useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { updateTopic } from "../../../../api/topics"

export default function EditTopic() {
    const { subjectId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    const topic = location.state?.topic

    const [name, setName] = useState(topic?.name || "")
    const [description, setDescription] = useState(
        topic?.description || ""
    )
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name.trim()) {
            toast.error("Topic name is required")
            return
        }

        try {
            setSaving(true)

            await updateTopic(
                topic.id,
                name.trim(),
                description.trim()
            )

            toast.success("Topic updated successfully")

            navigate(`/admin/subjects/${subjectId}/topics`)
        } catch (error) {
            const message =
                error.response?.data?.errors?.join(", ") ||
                "Failed to update topic"

            toast.error(message)
        } finally {
            setSaving(false)
        }
    }

    if (!topic) {
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm">
                <h1 className="text-xl font-semibold text-gray-900">
                    Topic not found
                </h1>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/admin/subjects/${subjectId}/topics`
                        )
                    }
                    className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                >
                    Back to Topics
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
                            `/admin/subjects/${subjectId}/topics`
                        )
                    }
                    className="mb-4 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                    ← Back to Topics
                </button>

                <h1 className="text-3xl font-bold text-gray-900">
                    Edit Topic
                </h1>

                <p className="mt-2 text-gray-500">
                    Update the topic information.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-xl bg-white p-6 shadow-sm"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Topic Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Conceptual Framework"
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
                        placeholder="Describe this topic..."
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/admin/subjects/${subjectId}/topics`
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
                        className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    )
}