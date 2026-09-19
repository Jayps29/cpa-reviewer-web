import api from "./axios"

export const getLessons = async (topicId) => {
    const response = await api.get(
        `/api/v1/topics/${topicId}/lessons`
    )

    return response.data.lessons
}

export const getLessonForLearning = async (lessonId) => {
    const response = await api.get(
        `/api/v1/lessons/${lessonId}/learn`
    )

    return response.data.lesson
}

export const submitActivityAnswer = async (activityId, answer) => {
    const response = await api.post(
        `/api/v1/activities/${activityId}/answer`,
        {
            answer,
        }
    )

    return response.data
}

export const createLesson = async (
    topicId,
    title,
    description,
    content,
    position
) => {
    const response = await api.post(
        `/api/v1/topics/${topicId}/lessons`,
        {
            lesson: {
                title,
                description,
                content,
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
    content,
    position
) => {
    const response = await api.patch(
        `/api/v1/lessons/${id}`,
        {
            lesson: {
                title,
                description,
                content,
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

export const getLessonForStudy = async (lessonId) => {
    const response = await api.get(
        `/api/v1/lessons/${lessonId}/study`
    )

    return response.data.lesson
}