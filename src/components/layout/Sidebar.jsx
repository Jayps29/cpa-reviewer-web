import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { toast } from "sonner"

export default function Sidebar() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()

            toast.success("Successfully signed out")

            navigate("/login")
        } catch (error) {
            console.error("Logout failed:", error)

            toast.error("Failed to sign out")
        }
    }

    return (
        <aside className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow">
            <div className="border-b border-gray-100 p-6">
                <h1 className="text-xl font-bold text-gray-900">
                    CPA Reviewer
                </h1>

                <p className="mt-1 text-xs text-gray-400">
                    Your CPA review journey
                </p>
            </div>

            <nav className="flex-1 p-4">
                <Link
                    to="/dashboard"
                    className="block rounded-lg bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-600"
                >
                    Dashboard
                </Link>
            </nav>

            <div className="border-t border-gray-100 p-4">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                >
                    Sign out
                </button>
            </div>
        </aside>
    )
}