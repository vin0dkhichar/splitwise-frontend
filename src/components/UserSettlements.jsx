import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE } from "../config";

export default function UserSettlements() {
    const { id } = useParams();
    const { token, user } = useContext(AuthContext);
    const [settlements, setSettlements] = useState(null);
    const [groupSuggestions, setGroupSuggestions] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id && token) {
            fetchUserSettlements();
        }
    }, [id, token]);

    const fetchUserSettlements = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/settlements/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setSettlements(data);

                if (data.group_balances?.length > 0) {
                    await fetchGroupSuggestions(data.group_balances.map(g => g.group_id));
                }
            } else {
                console.error("Failed to load settlements", res.status);
            }
        } catch (err) {
            console.error("Error fetching user settlements:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroupSuggestions = async (groupIds) => {
        const suggestionsMap = {};
        try {
            for (const gid of groupIds) {
                const res = await fetch(`${API_BASE}/settlements/groups/${gid}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    suggestionsMap[gid] = data.settlements || [];
                }
            }
            setGroupSuggestions(suggestionsMap);
        } catch (err) {
            console.error("Error fetching group suggestions:", err);
        }
    };

    const handleMarkPaid = async (groupId, fromUserId, toUserId, amount) => {
        try {
            const res = await fetch(`${API_BASE}/settlements/groups/${groupId}/mark-paid`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    from_user_id: fromUserId,
                    to_user_id: toUserId,
                    amount,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Failed to mark settlement as paid");
            }

            fetchUserSettlements();
        } catch (err) {
            console.error("Error marking paid:", err);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400">Loading settlements...</p>
            </div>
        );
    }

    if (!settlements) {
        return (
            <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400">No settlement data available.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    {user?.username}'s Settlements
                </h1>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                        Balances Across Groups
                    </h2>
                    {settlements.group_balances?.length > 0 ? (
                        <ul className="space-y-4">
                            {settlements.group_balances.map((g) => {
                                const userSettlements =
                                    groupSuggestions[g.group_id]?.filter(
                                        (s) => s.from_user_id === user.id
                                    ) || [];

                                return (
                                    <li
                                        key={g.group_id}
                                        className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {g.group_name}
                                            </span>
                                            <span
                                                className={
                                                    g.status === "owed"
                                                        ? "text-green-600 dark:text-green-400"
                                                        : g.status === "owes"
                                                            ? "text-red-600 dark:text-red-400"
                                                            : "text-gray-600 dark:text-gray-300"
                                                }
                                            >
                                                {g.status === "settled"
                                                    ? "Settled"
                                                    : `${g.status === "owed" ? "+" : "-"}$${Math.abs(
                                                        g.balance
                                                    ).toFixed(2)}`}
                                            </span>
                                        </div>

                                        {userSettlements.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {userSettlements.map((s, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex justify-between items-center text-sm bg-gray-100 dark:bg-gray-600 p-2 rounded"
                                                    >
                                                        <span className="text-gray-800 dark:text-gray-200">
                                                            You pay{" "}
                                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                                ${s.amount}
                                                            </span>{" "}
                                                            to {s.to_username}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleMarkPaid(
                                                                    g.group_id,
                                                                    s.from_user_id,
                                                                    s.to_user_id,
                                                                    s.amount
                                                                )
                                                            }
                                                            className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                                                        >
                                                            Mark Paid
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                            You are all settled up
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
