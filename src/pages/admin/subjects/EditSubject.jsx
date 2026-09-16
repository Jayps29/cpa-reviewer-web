import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import api from "../../../api/axios"
import { updateSubject } from "../../../api/subjects"

export default function EditSubject() {
    const { subjectId } = useParams()
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const response = await api.get(
                    `/api/v1/subjects/${subjectId}`
                )

                const subject = response.data.subject

                setName(subject.name)
                setDescription(subject.description || "")
            } catch (error) {
                console.error("Failed to fetch subject:", error)
                toast.error("Failed to load subject")
                navigate("/admin/subjects")
            } finally {
                setLoading(false)
            }
        }

        fetchSubject()
    }, [subjectId, navigate])

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!name.trim()) {
            toast.error("Subject name is required")
            return
        }

        try {
            setSaving(true)

            await updateSubject(
                subjectId,
                name.trim(),
                description.trim()
            )

            toast.success("Subject updated successfully")

            navigate("/admin/subjects")
        } catch (error) {
            console.error("Failed to update subject:", error)

            const errors = error.response?.data?.errors

            if (errors?.length) {
                toast.error(errors.join(", "))
            } else {
                toast.error("Failed to update subject")
            }
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-gray-500">
                    Loading subject...
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-3xl">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/admin/subjects")}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                    ← Back to Subjects
                </button>

                <h1 className="mt-4 text-3xl font-bold text-gray-900">
                    Edit Subject
                </h1>

                <p className="mt-2 text-gray-500">
                    Update the subject information.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Subject Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
                        rows="4"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/subjects")
                        }
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    )
}