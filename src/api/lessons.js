import api from "./axios"

export const getLessons = async (topicId) => {
    const response = await api.get(
        `/api/v1/topics/${topicId}/lessons`
    )

    return response.data.lessons
}

export const createLesson = async (
    topicId,
    title,
    description,
    position
) => {
    const response = await api.post(
        `/api/v1/topics/${topicId}/lessons`,
        {
            lesson: {
                title,
                description,
                position,
            },
        }
    )

    return response.data.lesson
}

export const updateLesson = async (
    id,
    title,
    description,
    position
) => {
    const response = await api.patch(
        `/api/v1/lessons/${id}`,
        {
            lesson: {
                title,
                description,
                position,
            },
        }
    )

    return response.data.lesson
}

export const deleteLesson = async (id) => {
    const response = await api.delete(
        `/api/v1/lessons/${id}`
    )

    return response.data
}