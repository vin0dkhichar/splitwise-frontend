import React from "react";

export default function GroupSettlements({ settlements, onMarkPaid }) {
    if (!settlements) return null;

    return (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Group Settlement Overview
            </h2>

            <div className="mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Balances
                </h3>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                    {settlements.balances?.map((b, idx) => (
                        <li key={idx} className="flex justify-between">
                            <span>{b.username}</span>
                            <span
                                className={
                                    b.amount > 0
                                        ? "text-green-600 dark:text-green-400"
                                        : b.amount < 0
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-gray-600 dark:text-gray-400"
                                }
                            >
                                {b.amount > 0
                                    ? `+ $${b.amount}`
                                    : b.amount < 0
                                        ? `- $${Math.abs(b.amount)}`
                                        : "Settled"}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Who Pays Whom
                </h3>
                {settlements.settlements?.length > 0 ? (
                    <ul className="space-y-2">
                        {settlements.settlements.map((s, idx) => (
                            <li key={idx} className="flex justify-between items-center">
                                <span className="text-gray-700 dark:text-gray-200">
                                    {s.from_username} pays{" "}
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        ${s.amount}
                                    </span>{" "}
                                    to {s.to_username}
                                </span>
                                <button
                                    onClick={() =>
                                        onMarkPaid(s.from_user_id, s.to_user_id, s.amount)
                                    }
                                    className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                >
                                    Mark Paid
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400">All settled up</p>
                )}
            </div>
        </div>
    );
}
