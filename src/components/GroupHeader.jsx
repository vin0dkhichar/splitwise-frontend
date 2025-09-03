import React from 'react';

export default function GroupHeader({ group, groupId, onAddMember, onCreateExpense, onToggleSettlements, showSettlements }) {
    return (
        <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold dark:text-white">
                {group?.name || `Group ${groupId}`}
            </h1>

            <div className="flex gap-3">
                <button
                    onClick={onAddMember}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Add Member
                </button>
                <button
                    onClick={onCreateExpense}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    Create Expense
                </button>
                <button
                    onClick={onToggleSettlements}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                    {showSettlements ? "Hide Settlements" : "View Settlements"}
                </button>
            </div>
        </div>
    );
}
