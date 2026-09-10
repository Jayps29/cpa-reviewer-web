import { useAuth } from "../../context/AuthContext"

export default function Header() {
    const { user } = useAuth()

    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    Dashboard
                </h2>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                        {user?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                        {user?.email}
                    </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    )
}