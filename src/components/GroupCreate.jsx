import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE } from "../config";

export default function GroupCreate() {
    const { token, user } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");

        const res = await fetch(`${API_BASE}/groups`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                description,
            }),
        });

        if (!res.ok) {
            const errData = await res.json();
            setError(errData.detail || "Failed to create group");
            return;
        }

        navigate("/");
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <div className="w-full max-w-[40vh] h-[35vh] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white">
                    Create Group
                </h2>

                <form
                    onSubmit={handleCreate}
                    className="flex flex-col gap-4"
                >
                    <input
                        type="text"
                        placeholder="Group name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Create
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>
            </div>
        </div>

    );
}
