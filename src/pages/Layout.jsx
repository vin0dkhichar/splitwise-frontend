import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import "../index.css"
export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col overflow-x-hidden">
            <Navbar />
            <main className="flex-1 p-6 w-full max-w-full overflow-y-auto mt-7">
                <Outlet />
            </main>
        </div>
    );
}
