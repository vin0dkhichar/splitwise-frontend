import React, { useState } from 'react';

export default function CreateExpenseModal({ members, allUsers, onClose, onCreateExpense }) {
    const [expenseForm, setExpenseForm] = useState({
        description: "",
        amount: "",
        paid_by: "",
        expense_type: "equal",
        participant_ids: [],
        splits: {}
    });
    const [isLoading, setIsLoading] = useState(false);

    const getUserDetails = (userId) => {
        return allUsers.find(user => user.id === userId) || { username: `User ${userId}`, email: "Unknown" };
    };

    const handleParticipantToggle = (userId) => {
        setExpenseForm(prev => {
            const isSelected = prev.participant_ids.includes(userId);
            const participant_ids = isSelected
                ? prev.participant_ids.filter(id => id !== userId)
                : [...prev.participant_ids, userId];

            const splits = { ...prev.splits };
            if (!isSelected) splits[userId] = 0;
            else delete splits[userId];

            return { ...prev, participant_ids, splits };
        });
    };

    const handleSplitChange = (userId, value) => {
        setExpenseForm(prev => ({
            ...prev,
            splits: { ...prev.splits, [userId]: parseFloat(value) || 0 }
        }));
    };

    const handleSubmit = async () => {
        if (!expenseForm.description || !expenseForm.amount || !expenseForm.paid_by) {
            alert("Please fill in all required fields");
            return;
        }

        if (expenseForm.participant_ids.length === 0) {
            alert("Please select at least one participant");
            return;
        }

        if (expenseForm.expense_type === "exact") {
            const total = Object.values(expenseForm.splits).reduce((acc, val) => acc + val, 0);
            if (total !== parseFloat(expenseForm.amount)) {
                alert("Exact amounts do not sum up to total expense amount");
                return;
            }
        }

        if (expenseForm.expense_type === "percentage") {
            const totalPercent = Object.values(expenseForm.splits).reduce((acc, val) => acc + val, 0);
            if (totalPercent !== 100) {
                alert("Percentages must sum up to 100%");
                return;
            }
        }

        try {
            setIsLoading(true);

            let payload = {
                description: expenseForm.description,
                amount: parseFloat(expenseForm.amount),
                paid_by: parseInt(expenseForm.paid_by),
                expense_type: expenseForm.expense_type,
            };

            if (expenseForm.expense_type === "equal") {
                payload.participant_ids = expenseForm.participant_ids;
            } else if (expenseForm.expense_type === "exact") {
                payload.shares = expenseForm.participant_ids.map(id => ({
                    user_id: id,
                    share_amount: parseFloat(expenseForm.splits[id])
                }));
            } else if (expenseForm.expense_type === "percentage") {
                payload.shares = expenseForm.participant_ids.map(id => ({
                    user_id: id,
                    percentage: parseFloat(expenseForm.splits[id])
                }));
            }

            await onCreateExpense(payload);
            setExpenseForm({
                description: "",
                amount: "",
                paid_by: "",
                expense_type: "equal",
                participant_ids: [],
                splits: {}
            });
        } catch (error) {
            alert(`Failed to create expense: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold dark:text-white">Create Expense</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <span className="text-xl">×</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">Description *</label>
                        <input
                            type="text"
                            value={expenseForm.description}
                            onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="What was this expense for?"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">Amount (₹) *</label>
                        <input
                            type="number"
                            step="0.01"
                            value={expenseForm.amount}
                            onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="0.00"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Paid By */}
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">Paid by *</label>
                        <select
                            value={expenseForm.paid_by}
                            onChange={(e) => setExpenseForm(prev => ({ ...prev, paid_by: e.target.value }))}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            disabled={isLoading}
                        >
                            <option value="">Select who paid...</option>
                            {members.map(memberData => {
                                const userDetails = getUserDetails(memberData.user_id);
                                return (
                                    <option key={memberData.user_id} value={memberData.user_id}>
                                        {userDetails.username}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Split Type */}
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">Split Type</label>
                        <select
                            value={expenseForm.expense_type}
                            onChange={(e) => setExpenseForm(prev => ({
                                ...prev,
                                expense_type: e.target.value,
                                participant_ids: [],
                                splits: {}
                            }))}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            disabled={isLoading}
                        >
                            <option value="equal">Split Equally</option>
                            <option value="exact">Exact Amounts</option>
                            <option value="percentage">By Percentage</option>
                        </select>
                    </div>

                    {/* Participants and splits */}
                    {(expenseForm.expense_type === "equal" || expenseForm.expense_type === "exact" || expenseForm.expense_type === "percentage") && (
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-white">Select Participants *</label>
                            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide border dark:border-gray-600 rounded-lg p-3">
                                {members.map(memberData => {
                                    const userDetails = getUserDetails(memberData.user_id);
                                    const isSelected = expenseForm.participant_ids.includes(memberData.user_id);

                                    return (
                                        <div key={memberData.user_id} className="flex items-center justify-between">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleParticipantToggle(memberData.user_id)}
                                                    className="mr-3"
                                                    disabled={isLoading}
                                                />
                                                <span className="dark:text-white">{userDetails.username}</span>
                                            </label>

                                            {(expenseForm.expense_type !== "equal" && isSelected) && (
                                                <input
                                                    type="number"
                                                    value={expenseForm.splits[memberData.user_id] || ""}
                                                    onChange={e => handleSplitChange(memberData.user_id, e.target.value)}
                                                    className="w-24 p-1 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    placeholder={expenseForm.expense_type === "exact" ? "₹" : "%"}
                                                    disabled={isLoading}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? "Creating..." : "Create Expense"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
