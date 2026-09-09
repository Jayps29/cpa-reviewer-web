import { createContext, useContext, useEffect, useState } from "react"
import {
    login as apiLogin,
    logout as apiLogout,
    getCurrentUser,
} from "../api/auth"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const checkAuth = async () => {
        try {
            const currentUser = await getCurrentUser()
            setUser(currentUser)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const login = async (email, password) => {
        const data = await apiLogin(email, password)
        setUser(data.user)
        return data
    }

    const logout = async () => {
        await apiLogout()
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}