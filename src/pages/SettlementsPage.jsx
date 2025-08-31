import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SettlementsPage() {
    const { token, user } = useContext(AuthContext);
    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [fromUserId, setFromUserId] = useState("");
    const [toUserId, setToUserId] = useState("");

    useEffect(() => {
        if (user?.id) fetchSettlements();
    }, [user]);

    const fetchSettlements = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`http://localhost:8000/settlements/users/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            const data = await res.json();
            setSettlements(data.group_balances || []);
        } catch (err) {
            console.error("Failed to fetch settlements:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSettlement = async () => {
        if (!selectedGroup || !fromUserId || !toUserId || !amount) {
            alert("Please fill all fields to create settlement");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8000/settlements/groups/${selectedGroup}/mark-paid`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    from_user_id: parseInt(fromUserId),
                    to_user_id: parseInt(toUserId),
                    amount: parseFloat(amount),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Failed to create settlement");
            }

            alert("Settlement created successfully!");
            setAmount("");
            setSelectedGroup(null);
            setFromUserId("");
            setToUserId("");
            fetchSettlements(); // Refresh balances
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    return (
        <div className="pt-24 px-6">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Your Settlements</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && settlements.length === 0 && <p>No settlements found.</p>}

            {!loading && !error && settlements.length > 0 && (
                <div className="space-y-4 mb-6">
                    {settlements.map((s) => (
                        <div
                            key={s.group_id}
                            className="p-4 bg-white dark:bg-gray-700 rounded shadow-sm flex justify-between items-center"
                        >
                            <span>Group ID: {s.group_id}</span>
                            <span className={`${s.balance > 0 ? "text-green-600" : "text-red-600"}`}>
                                {s.status}: ₹{s.balance.toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <div className="p-4 bg-white dark:bg-gray-700 rounded shadow-sm">
                <h3 className="font-semibold mb-2 dark:text-white">Create Settlement</h3>
                <div className="flex flex-col gap-3">
                    <input
                        type="number"
                        placeholder="Group ID"
                        value={selectedGroup || ""}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                    <input
                        type="number"
                        placeholder="From User ID (owes)"
                        value={fromUserId}
                        onChange={(e) => setFromUserId(e.target.value)}
                        className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                    <input
                        type="number"
                        placeholder="To User ID (receives)"
                        value={toUserId}
                        onChange={(e) => setToUserId(e.target.value)}
                        className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                    <button
                        onClick={handleCreateSettlement}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                        Create Settlement
                    </button>
                </div>
            </div>
        </div>
    );
}
