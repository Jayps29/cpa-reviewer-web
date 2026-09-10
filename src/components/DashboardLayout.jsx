import { Outlet } from "react-router-dom"
import Sidebar from "./layout/Sidebar"
import Header from "./layout/Header"

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <main className="ml-64 min-h-screen">
                <Header />

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}