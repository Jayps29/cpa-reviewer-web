import { useAuth } from "../context/AuthContext"

export default function Dashboard() {
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard
                </h1>

                <p className="mt-2 text-gray-600">
                    Welcome, {user.name}!
                </p>

                <div className="mt-6 rounded-xl bg-white p-6 shadow">
                    <p className="text-gray-700">
                        You are authenticated.
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        Email: {user.email}
                    </p>
                </div>
            </div>
        </div>
    )
}