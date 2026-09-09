import { useState } from "react"
import { toast } from "sonner"
import { login } from "../api/auth"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const data = await login(email, password)

            toast.success(`Welcome back, ${data.user.name}!`)

            console.log("Login successful:", data)
        } catch (error) {
            console.error("Login failed:", error)

            toast.error(
                error.response?.data?.error ||
                "Invalid email or password"
            )
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-lg">
                        C
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        CPA Reviewer
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Welcome back! Continue your CPA review journey.
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Sign in
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Enter your account details below.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />

                            <label
                                htmlFor="remember"
                                className="ml-2 text-sm text-gray-600"
                            >
                                Remember me
                            </label>
                        </div>

                        {/* Login button */}
                        <button
                            type="submit"
                            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99]"
                        >
                            Sign in
                        </button>
                    </form>

                    {/* Register */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            Create an account
                        </button>
                    </p>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-gray-400">
                    © 2026 CPA Reviewer. All rights reserved.
                </p>
            </div>
        </div>
    )
}
