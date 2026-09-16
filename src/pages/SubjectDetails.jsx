import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../api/axios"

export default function SubjectDetails() {
    const { subjectId } = useParams()

    const [topics, setTopics] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await api.get(
                    `/api/v1/subjects/${subjectId}/topics`
                )

                setTopics(response.data.topics)
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
        return <p className="text-gray-500">Loading topics...</p>
    }

    if (error) {
        return <p className="text-red-500">{error}</p>
    }

    return (
        <div>
            <Link
                to="/subjects"
                className="text-sm text-indigo-600 hover:text-indigo-800"
            >
                ← Back to Subjects
            </Link>

            <h1 className="mt-4 text-3xl font-bold text-gray-900">
                Topics
            </h1>

            <div className="mt-6 space-y-4">
                {topics.length === 0 ? (
                    <p className="text-gray-500">
                        No topics available for this subject.
                    </p>
                ) : (
                    topics.map((topic) => (
                        <div
                            key={topic.id}
                            className="rounded-xl bg-white p-6 shadow"
                        >
                            <h2 className="text-xl font-semibold text-gray-900">
                                {topic.name}
                            </h2>

                            <p className="mt-2 text-gray-600">
                                {topic.description}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}