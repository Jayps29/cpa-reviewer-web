import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
    getSubjects,
    deleteSubject,
} from "../../../api/subjects"
import DeleteSubjectModal from "../../../components/subjects/DeleteSubjectModal"

export default function Subjects() {
    const navigate = useNavigate()
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [deleting, setDeleting] = useState(false)


    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await getSubjects()
                setSubjects(data)
            } catch (error) {
                console.error("Failed to fetch subjects:", error)
                setError("Failed to load subjects.")
            } finally {
                setLoading(false)
            }
        }

        fetchSubjects()
    }, [])

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />
                    <p className="mt-3 text-sm text-gray-500">
                        Loading subjects...
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
        if (!selectedSubject) {
            return
        }

        try {
            setDeleting(true)

            await deleteSubject(selectedSubject.id)

            setSubjects((currentSubjects) =>
                currentSubjects.filter(
                    (subject) => subject.id !== selectedSubject.id
                )
            )

            toast.success("Subject deleted successfully")

            setSelectedSubject(null)
        } catch (error) {
            console.error("Failed to delete subject:", error)

            const errors = error.response?.data?.errors

            if (errors?.length) {
                toast.error(errors.join(", "))
            } else {
                toast.error("Failed to delete subject")
            }
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Subjects
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage the CPA subjects available to students.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/admin/subjects/new")}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <span className="text-lg leading-none">+</span>
                    Add Subject
                </button>
            </div>

            {/* Stats */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Total Subjects
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {subjects.length}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Available
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-600">
                        {subjects.length}
                    </p>
                </div>
            </div>

            {/* Subjects */}
            <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            All Subjects
                        </h2>

                        <p className="text-sm text-gray-500">
                            Manage your CPA review subjects.
                        </p>
                    </div>
                </div>

                {subjects.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                            📚
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-gray-900">
                            No subjects yet
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Create your first CPA subject to get started.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/admin/subjects/new")}
                            className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            Add Subject
                        </button>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="divide-y divide-gray-100">
                            {subjects.map((subject) => (
                                <div
                                    key={subject.id}
                                    className="group flex items-center justify-between p-6 transition hover:bg-gray-50"
                                >
                                    {/* Subject Information */}
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
                                            {subject.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-900">
                                                {subject.name}
                                            </h3>

                                            <p className="mt-1 max-w-xl truncate text-sm text-gray-500">
                                                {subject.description ||
                                                    "No description provided."}
                                            </p>

                                            <p className="mt-2 text-xs text-gray-400">
                                                Subject ID: {subject.id}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="ml-6 flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(`/admin/subjects/${subject.id}/edit`)
                                            }
                                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedSubject(subject)}
                                            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
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

            <DeleteSubjectModal
                subject={selectedSubject}
                deleting={deleting}
                onConfirm={handleDelete}
                onCancel={() => setSelectedSubject(null)}
            />
        </div>


    )
}