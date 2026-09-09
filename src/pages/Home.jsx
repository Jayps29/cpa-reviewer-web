import { toast } from "sonner"

function Home() {
    const showMessage = () => {
        toast.success("CPA Reviewer is working!")
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold">
                CPA Reviewer
            </h1>

            <button
                onClick={showMessage}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
                Test Notification
            </button>
        </div>
    )
}

export default Home