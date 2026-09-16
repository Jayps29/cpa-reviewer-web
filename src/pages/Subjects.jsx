import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getSubjects } from "../api/subjects"


export default function Subjects() {
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

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
        return <p className="text-gray-500">Loading subjects...</p>
    }

    if (error) {
        return <p className="text-red-500">{error}</p>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900">
                CPA Subjects
            </h1>

            <p className="mt-2 text-gray-600">
                Choose a subject to start reviewing.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                {subjects.map((subject) => (
                    <Link
                        key={subject.id}
                        to={`/subjects/${subject.id}`}
                        className="block rounded-xl bg-white p-6 shadow transition hover:shadow-md"
                    >
                        <h2 className="text-xl font-semibold text-gray-900">
                            {subject.name}
                        </h2>

                        <p className="mt-2 text-gray-600">
                            {subject.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}