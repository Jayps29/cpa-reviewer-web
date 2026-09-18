import api from "./axios"

export const getActivities = async (lessonId) => {
    const response = await api.get(
        `/api/v1/lessons/${lessonId}/activities`
    )

    return response.data.activities
}

export const createActivity = async (
    lessonId,
    activityType,
    title,
    prompt,
    explanation,
    correctAnswer,
    position,
    options = []
) => {
    const response = await api.post(
        `/api/v1/lessons/${lessonId}/activities`,
        {
            activity: {
                activity_type: activityType,
                title,
                prompt,
                explanation,
                correct_answer: correctAnswer,
                position,
                activity_options_attributes: options,
            },
        }
    )

    return response.data.activity
}

export const updateActivity = async (
    id,
    activityType,
    title,
    prompt,
    explanation,
    correctAnswer,
    position,
    options = []
) => {
    const response = await api.patch(
        `/api/v1/activities/${id}`,
        {
            activity: {
                activity_type: activityType,
                title,
                prompt,
                explanation,
                correct_answer: correctAnswer,
                position,
                activity_options_attributes: options,
            },
        }
    )

    return response.data.activity
}

export const deleteActivity = async (id) => {
    const response = await api.delete(
        `/api/v1/activities/${id}`
    )

    return response.data
}