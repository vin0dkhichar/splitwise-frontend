import { useState } from "react";
import { API_BASE } from "../config";

export default function RegisterForm({ onSwitch }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const res = await fetch(`${API_BASE}/users/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (!res.ok) {
            const errData = await res.json();
            setError(errData.detail || "Failed to register");
            return;
        }

        setUsername("");
        setEmail("");
        setPassword("");

        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => {
            onSwitch();
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Register
                </h2>

                {error && (
                    <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg dark:bg-red-900 dark:text-red-300 dark:border-red-600">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded-lg dark:bg-green-900 dark:text-green-300 dark:border-green-600">
                        {success}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Choose a username"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                    Already have an account?{" "}
                    <button
                        onClick={onSwitch}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}
