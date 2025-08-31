import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    const linkClasses = ({ isActive }) =>
        `px-2 py-1 rounded ${isActive ? "bg-gray-900 text-white" : "hover:text-gray-300"
        }`;

    return (
        <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md flex-no-wrap fixed top-0 z-10 w-full">
            <div className="flex items-center gap-6">
                <h1 className="text-xl font-bold">💰 Expense Tracker</h1>
                <div className="flex gap-4 text-sm">
                    <NavLink to="/" className={linkClasses} end>
                        Home
                    </NavLink>
                    <NavLink to="/settlements" className={linkClasses}>
                        Settlements
                    </NavLink>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {user && <span className="hidden sm:block">Hello, {user.username}</span>}
                <button
                    onClick={logout}
                    className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
