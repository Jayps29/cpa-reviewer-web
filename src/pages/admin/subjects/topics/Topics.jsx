import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import {
    getTopics,
    deleteTopic,
} from "../../../../api/topics"

import DeleteTopicModal from "../../../../components/admin/DeleteTopicModal"

export default function Topics() {
    const { subjectId } = useParams()
    const navigate = useNavigate()

    const [selectedTopic, setSelectedTopic] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const [topics, setTopics] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const data = await getTopics(subjectId)
                setTopics(data)
            } catch (error) {
                console.error("Failed to fetch topics:", error)
                setError("Failed to load topics.")
            } finally {
                setLoading(false)
            }
        }

        fetchTopics()
    }, [subjectId])

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />

                    <p className="mt-3 text-sm text-gray-500">
                        Loading topics...
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
        if (!selectedTopic) return

        try {
            setDeleting(true)

            await deleteTopic(selectedTopic.id)

            setTopics((currentTopics) =>
                currentTopics.filter(
                    (topic) => topic.id !== selectedTopic.id
                )
            )

            toast.success("Topic deleted successfully")

            setSelectedTopic(null)
        } catch (error) {
            const message =
                error.response?.data?.error ||
                "Failed to delete topic"

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
                        onClick={() => navigate("/admin/subjects")}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                        ← Back to Subjects
                    </button>

                    <h1 className="mt-4 text-3xl font-bold text-gray-900">
                        Manage Topics
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage the topics for this CPA subject.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/admin/subjects/${subjectId}/topics/new`
                        )
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <span className="text-lg leading-none">+</span>
                    Add Topic
                </button>
            </div>

            {/* Stats */}
            <div className="mt-8">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Total Topics
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {topics.length}
                    </p>
                </div>
            </div>

            {/* Topics */}
            <div className="mt-8">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        All Topics
                    </h2>

                    <p className="text-sm text-gray-500">
                        Manage the topics available under this subject.
                    </p>
                </div>

                {topics.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                            📖
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-gray-900">
                            No topics yet
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Add the first topic for this subject.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/admin/subjects/${subjectId}/topics/new`
                                )
                            }
                            className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            Add Topic
                        </button>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="divide-y divide-gray-100">
                            {topics.map((topic) => (
                                <div
                                    key={topic.id}
                                    className="flex items-center justify-between p-6 transition hover:bg-gray-50"
                                >
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
                                            {topic.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-900">
                                                {topic.name}
                                            </h3>

                                            <p className="mt-1 max-w-xl truncate text-sm text-gray-500">
                                                {topic.description ||
                                                    "No description provided."}
                                            </p>

                                            <p className="mt-2 text-xs text-gray-400">
                                                Topic ID: {topic.id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-6 flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/subjects/${subjectId}/topics/${topic.id}/edit`,
                                                    {
                                                        state: { topic },
                                                    }
                                                )
                                            }
                                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedTopic(topic)}
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

            <DeleteTopicModal
                topic={selectedTopic}
                deleting={deleting}
                onConfirm={handleDelete}
                onCancel={() => setSelectedTopic(null)}
            />

        </div>
    )
}