
import React, { useState } from 'react';

export default function MembersList({ members, allUsers, onRemoveMember }) {
    const [showMembers, setShowMembers] = useState(false);

    const handleRemoveClick = async (userId) => {
        try {
            await onRemoveMember(userId);
        } catch (error) {
            alert(error.message);
        }
    };

    const getUserDetails = (userId) => {
        return allUsers.find(user => user.id === userId) || { username: `User ${userId}`, email: "Unknown" };
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold dark:text-white">
                    Members ({members.length})
                </h3>
                <button
                    onClick={() => setShowMembers(prev => !prev)}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    {showMembers ? "Hide" : "Show"}
                </button>
            </div>

            {showMembers && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {members.map((memberData) => {
                        const userDetails = getUserDetails(memberData.user_id);
                        return (
                            <div
                                key={memberData.id}
                                className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border dark:border-gray-600"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium dark:text-white">{userDetails.username}</p>
                                        {memberData.role === 'admin' && (
                                            <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{userDetails.email}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        Joined: {new Date(memberData.joined_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleRemoveClick(memberData.user_id)}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                    title="Remove member"
                                >
                                    <span className="text-sm">Remove</span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
