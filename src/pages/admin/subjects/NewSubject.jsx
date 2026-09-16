import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { createSubject } from "../../../api/subjects"

export default function NewSubject() {
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!name.trim()) {
            toast.error("Subject name is required")
            return
        }

        try {
            setLoading(true)

            await createSubject(
                name.trim(),
                description.trim()
            )

            toast.success("Subject created successfully")

            navigate("/admin/subjects")
        } catch (error) {
            console.error("Failed to create subject:", error)

            const errors = error.response?.data?.errors

            if (errors?.length) {
                toast.error(errors.join(", "))
            } else {
                toast.error("Failed to create subject")
            }
        } finally {
            setLoading(false)
        }
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
                    Add Subject
                </h1>

                <p className="mt-2 text-gray-500">
                    Create a new CPA subject for students.
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
                        placeholder="e.g. Taxation"
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
                        placeholder="Describe what students will learn..."
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
                        disabled={loading}
                        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Subject"}
                    </button>
                </div>
            </form>
        </div>
    )
}