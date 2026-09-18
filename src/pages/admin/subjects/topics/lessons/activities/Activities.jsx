import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import {
    getActivities,
    deleteActivity,
} from "../../../../../../api/activities"

import DeleteActivityModal from "../../../../../../components/admin/DeleteActivityModal"

export default function Activities() {
    const { subjectId, topicId, lessonId } = useParams()
    const navigate = useNavigate()

    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedActivity, setSelectedActivity] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await getActivities(lessonId)
                setActivities(data)
            } catch (error) {
                console.error(
                    "Failed to fetch activities:",
                    error
                )
                setError("Failed to load activities.")
            } finally {
                setLoading(false)
            }
        }

        fetchActivities()
    }, [lessonId])

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />

                    <p className="mt-3 text-sm text-gray-500">
                        Loading activities...
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
        if (!selectedActivity) return

        try {
            setDeleting(true)

            await deleteActivity(selectedActivity.id)

            setActivities((currentActivities) =>
                currentActivities.filter(
                    (activity) =>
                        activity.id !== selectedActivity.id
                )
            )

            toast.success("Activity deleted successfully")
            setSelectedActivity(null)
        } catch (error) {
            const message =
                error.response?.data?.error ||
                "Failed to delete activity"

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
                            navigate(
                                `/admin/subjects/${subjectId}/topics/${topicId}/lessons`
                            )
                        }
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                        ← Back to Lessons
                    </button>

                    <h1 className="mt-4 text-3xl font-bold text-gray-900">
                        Manage Activities
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage the activities for this CPA lesson.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/admin/subjects/${subjectId}/topics/${topicId}/lessons/${lessonId}/activities/new`
                        )
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <span className="text-lg leading-none">+</span>
                    Add Activity
                </button>
            </div>

            {/* Stats */}
            <div className="mt-8">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Total Activities
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {activities.length}
                    </p>
                </div>
            </div>

            {/* Activities */}
            <div className="mt-8">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        All Activities
                    </h2>

                    <p className="text-sm text-gray-500">
                        Manage the activities included in this lesson.
                    </p>
                </div>

                {activities.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                            🎯
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-gray-900">
                            No activities yet
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Add the first activity for this lesson.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/admin/subjects/${subjectId}/topics/${topicId}/lessons/${lessonId}/activities/new`
                                )
                            }
                            className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            Add Activity
                        </button>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="divide-y divide-gray-100">
                            {activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center justify-between p-6 transition hover:bg-gray-50"
                                >
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                                            {activity.position}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-gray-900">
                                                    {activity.title ||
                                                        "Untitled Activity"}
                                                </h3>

                                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                                    {activity.activity_type}
                                                </span>
                                            </div>

                                            <p className="mt-1 max-w-xl truncate text-sm text-gray-500">
                                                {activity.prompt ||
                                                    "No prompt provided."}
                                            </p>

                                            <p className="mt-2 text-xs text-gray-400">
                                                Activity ID: {activity.id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-6 flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/subjects/${subjectId}/topics/${topicId}/lessons/${lessonId}/activities/${activity.id}/edit`,
                                                    {
                                                        state: { activity },
                                                    }
                                                )
                                            }
                                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedActivity(activity)}
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

            <DeleteActivityModal
                activity={selectedActivity}
                deleting={deleting}
                onConfirm={handleDelete}
                onCancel={() => setSelectedActivity(null)}
            />

        </div>
    )
}