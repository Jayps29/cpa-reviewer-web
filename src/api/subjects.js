import api from "./axios"

export const getSubjects = async () => {
    const response = await api.get("/api/v1/subjects")

    return response.data.subjects
}

export const createSubject = async (name, description) => {
    const response = await api.post("/api/v1/subjects", {
        subject: {
            name,
            description,
        },
    })

    return response.data.subject
}

export const updateSubject = async (id, name, description) => {
    const response = await api.patch(`/api/v1/subjects/${id}`, {
        subject: {
            name,
            description,
        },
    })

    return response.data.subject
}

export const deleteSubject = async (id) => {
    const response = await api.delete(`/api/v1/subjects/${id}`)

    return response.data
}