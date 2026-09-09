import api from "./axios"

export const login = async (email, password) => {
    const response = await api.post("/users/sign_in", {
        user: {
            email,
            password,
        },
    })

    return response.data
}

export const getCurrentUser = async () => {
    const response = await api.get("/api/v1/me")
    return response.data.user
}

export const logout = async () => {
    const response = await api.delete("/users/sign_out")
    return response.data
}