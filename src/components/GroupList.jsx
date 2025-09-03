import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function GroupList() {
    const { token } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);
    const [editingGroup, setEditingGroup] = useState(null);
    const [form, setForm] = useState({ name: "", description: "" });

    useEffect(() => {
        if (token) {
            fetch("http://localhost:8000/groups/", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setGroups(data))
                .catch((err) => console.error("Failed to load groups", err));
        }
    }, [token]);

    const handleEditClick = (group) => {
        setEditingGroup(group.id);
        setForm({ name: group.name, description: group.description || "" });
    };

    const handleUpdate = async (groupId) => {
        try {
            const res = await fetch(`http://localhost:8000/groups/${groupId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed to update group");

            const updatedGroup = await res.json();
            setGroups((prev) =>
                prev.map((g) => (g.id === groupId ? updatedGroup : g))
            );
            setEditingGroup(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (groupId) => {
        try {
            const res = await fetch(`http://localhost:8000/groups/${groupId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to delete group");

            setGroups((prev) => prev.filter((g) => g.id !== groupId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl dark:text-white font-semibold">Groups</h2>
                <Link
                    to="/groups/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Create Group
                </Link>
            </div>

            {groups.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No groups available.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-4">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            className="block bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition"
                        >
                            {editingGroup === group.id ? (
                                <>
                                    <input
                                        type="text"
                                        className="text-gray-900 w-full mb-2 p-2 border rounded dark:text-white"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                    <textarea
                                        className="text-gray-600 w-full mb-2 p-2 border rounded dark:text-gray-400"
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm({ ...form, description: e.target.value })
                                        }
                                    />
                                    <button
                                        className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                                        onClick={() => handleUpdate(group.id)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="bg-gray-400 text-white px-3 py-1 rounded"
                                        onClick={() => setEditingGroup(null)}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
                                            {group.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {group.description || "No description"}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            to={`/groups/${group.id}`}
                                            className="bg-blue-800 hover:bg-blue-700 transition text-white px-4 py-1 rounded-md shadow-sm"
                                        >
                                            View
                                        </Link>
                                        <button
                                            className="bg-yellow-700 hover:bg-yellow-600 transition text-white px-4 py-1 rounded-md shadow-sm"
                                            onClick={() => handleEditClick(group)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-700 hover:bg-red-700 transition text-white px-4 py-1 rounded-md shadow-sm"
                                            onClick={() => handleDelete(group.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
