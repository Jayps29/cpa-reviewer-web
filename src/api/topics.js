import api from "./axios"

export const getTopics = async (subjectId) => {
    const response = await api.get(
        `/api/v1/subjects/${subjectId}/topics`
    )

    return response.data.topics
}

export const createTopic = async (
    subjectId,
    name,
    description
) => {
    const response = await api.post("/api/v1/topics", {
        topic: {
            subject_id: subjectId,
            name,
            description,
        },
    })

    return response.data.topic
}

export const updateTopic = async (
    id,
    name,
    description
) => {
    const response = await api.patch(`/api/v1/topics/${id}`, {
        topic: {
            name,
            description,
        },
    })

    return response.data.topic
}

export const deleteTopic = async (id) => {
    const response = await api.delete(`/api/v1/topics/${id}`)

    return response.data
}