import React from 'react';

export default function ExpensesList({ expenses, members, onCreateExpense, onEditExpense, onDeleteExpense }) {
    const getMemberName = (userId) => {
        const member = members.find(m => m.id === userId);
        return member ? member.username : `User ${userId}`;
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Expenses</h3>
            {expenses.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">No expenses yet.</p>
                    <button
                        onClick={onCreateExpense}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                        Create First Expense
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {expenses.map((exp) => (
                        <div
                            key={exp.expense.id}
                            className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm border dark:border-gray-600"
                        >
                            <div className="flex flex-wrap justify-between items-start mb-3">
                                <h4 className="font-semibold text-lg dark:text-white break-words">
                                    {exp.expense.description || "Untitled Expense"}
                                </h4>
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                    ₹{exp.expense.amount.toFixed(2)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                Paid by: {getMemberName(exp.expense.paid_by)}
                            </p>

                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded mb-3">
                                <p className="text-sm font-medium mb-2 dark:text-white">Split details:</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {exp.shares.map((share) => (
                                        <div key={share.user_id} className="text-sm">
                                            <span className="font-medium dark:text-white">
                                                {getMemberName(share.user_id)}:
                                            </span>
                                            <span className="text-gray-600 dark:text-gray-400 ml-1">
                                                ₹{share.share_amount.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => onEditExpense(exp.expense)} className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Edit</button>

                                <button
                                    onClick={() => onDeleteExpense(exp.expense.id)}
                                    className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
