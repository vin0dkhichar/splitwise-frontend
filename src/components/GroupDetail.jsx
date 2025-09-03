import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GroupHeader from "./GroupHeader";
import MembersList from "./MembersList";
import ExpensesList from "./ExpensesList";
import AddMemberModal from "./AddMemberModal";
import CreateExpenseModal from "./CreateExpenseModal";
import GroupSettlements from "./GroupSettlements";
import { API_BASE } from "../config";

export default function GroupDetail() {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showCreateExpense, setShowCreateExpense] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [settlements, setSettlements] = useState(null);
    const [showSettlements, setShowSettlements] = useState(false);

    useEffect(() => {
        if (id && token) {
            loadGroupData();
        }
    }, [id, token]);

    const loadGroupData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                loadGroup(),
                loadExpenses(),
                loadMembers(),
                loadAllUsers()
            ]);
        } catch (error) {
            console.error("Failed to load group data:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadGroup = async () => {
        try {
            const response = await fetch(`${API_BASE}/groups/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setGroup(data);
            }
        } catch (error) {
            console.error("Failed to load group:", error);
        }
    };

    const loadExpenses = async () => {
        try {
            const response = await fetch(`${API_BASE}/expenses/group/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setExpenses(data);
            }
        } catch (error) {
            console.error("Failed to load expenses:", error);
        }
    };

    const loadMembers = async () => {
        try {
            const response = await fetch(`${API_BASE}/groups/${id}/members`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setMembers(data);
            }
        } catch (error) {
            console.error("Failed to load members:", error);
        }
    };

    const loadAllUsers = async () => {
        try {
            const response = await fetch(`${API_BASE}/users/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setAllUsers(data);
            }
        } catch (error) {
            console.error("Failed to load users:", error);
        }
    };

    const handleAddMember = async (userId) => {
        try {
            const response = await fetch(`${API_BASE}/groups/${id}/members?user_id=${userId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                await loadMembers();
                setShowAddMember(false);
                return true;
            } else {
                const error = await response.json();
                throw new Error(error.detail || "Failed to add member");
            }
        } catch (error) {
            console.error("Failed to add member:", error);
            throw error;
        }
    };

    const handleRemoveMember = async (userId) => {
        try {
            const response = await fetch(`${API_BASE}/groups/${id}/members/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                await loadMembers();
                return true;
            } else {
                const error = await response.json();
                throw new Error(error.detail || "Failed to remove member");
            }
        } catch (error) {
            console.error("Failed to remove member:", error);
            throw error;
        }
    };

    const handleCreateExpense = async (expenseData) => {
        try {
            const payload = {
                ...expenseData,
                amount: parseFloat(expenseData.amount),
                paid_by: parseInt(expenseData.paid_by),
                group_id: parseInt(id)
            };

            console.log("Creating expense:", payload);
            const response = await fetch(`${API_BASE}/expenses/create/${expenseData.expense_type}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await loadExpenses();
                setShowCreateExpense(false);
                return true;
            } else {
                const error = await response.json();
                throw new Error(error.detail || "Failed to create expense");
            }
        } catch (error) {
            console.error("Failed to create expense:", error);
            throw error;
        }
    };

    const handleEditExpense = (expenseItem) => {
        const fullExpenseData = expenses.find(e => e.expense.id === expenseItem.id);

        const expenseForEdit = {
            id: expenseItem.id,
            description: expenseItem.description,
            amount: expenseItem.amount,
            paid_by: expenseItem.paid_by,
            expense_type: expenseItem.expense_type,
            shares: fullExpenseData?.shares || []
        };

        setEditingExpense(expenseForEdit);
        setShowCreateExpense(true);
    };

    const handleUpdateExpense = async (payload) => {
        if (!editingExpense) return;

        try {
            const finalPayload = {
                ...payload,
                group_id: parseInt(id),
            };

            console.log("Updating expense with payload:", finalPayload);

            const response = await fetch(`${API_BASE}/expenses/${editingExpense.id}/update/${finalPayload.expense_type}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(finalPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                throw new Error(errorData.detail || `Server error: ${response.status}`);
            }

            await loadExpenses();
            setShowCreateExpense(false);
            setEditingExpense(null);
        } catch (error) {
            console.error("Failed to update expense:", error);
            throw error;
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        try {
            const response = await fetch(`${API_BASE}/expenses/${expenseId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || "Failed to delete expense");
            }

            setExpenses(prev => prev.filter(e => e.expense.id !== expenseId));
        } catch (error) {
            console.error("Failed to delete expense:", error);
            alert(`Failed to delete expense: ${error.message}`);
        }
    };

    const handleToggleSettlements = async () => {
        if (showSettlements) {
            setShowSettlements(false);
        } else {
            await loadGroupSettlements();
            setShowSettlements(true);
        }
    };

    const loadGroupSettlements = async () => {
        try {
            const res = await fetch(`${API_BASE}/settlements/groups/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setSettlements(data);
                setShowSettlements(true);
            }
        } catch (err) {
            console.error("Failed to fetch settlements:", err);
        }
    };

    const handleMarkPaid = async (fromUserId, toUserId, amount) => {

        try {
            const res = await fetch(`${API_BASE}/settlements/groups/${id}/mark-paid`, {
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

            loadGroupSettlements();
        } catch (err) {
            console.error("Error marking paid:", err);
            alert(`Error: ${err.message}`);
        }
    };

    const handleCloseModal = () => {
        setShowCreateExpense(false);
        setEditingExpense(null);
    };

    const availableUsers = (allUsers || []).filter(user =>
        !(members || []).some(member => member.user_id === user.id)
    );

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-6 max-w-6xl mx-auto">
                <GroupHeader
                    group={group}
                    groupId={id}
                    onAddMember={() => setShowAddMember(true)}
                    onCreateExpense={() => setShowCreateExpense(true)}
                    onViewSettlements={loadGroupSettlements}
                    onToggleSettlements={handleToggleSettlements}
                />

                {showSettlements && settlements && (
                    <GroupSettlements
                        settlements={settlements}
                        onMarkPaid={handleMarkPaid}
                    />
                )}

                <MembersList
                    members={members}
                    allUsers={allUsers}
                    onRemoveMember={handleRemoveMember}
                />

                <ExpensesList
                    expenses={[...expenses].reverse()}
                    members={allUsers}
                    onCreateExpense={() => setShowCreateExpense(true)}
                    onDeleteExpense={handleDeleteExpense}
                    onEditExpense={handleEditExpense}
                />

                {showAddMember && (
                    <AddMemberModal
                        availableUsers={availableUsers}
                        onClose={() => setShowAddMember(false)}
                        onAddMember={handleAddMember}
                    />
                )}

                {showCreateExpense && (
                    <CreateExpenseModal
                        members={members}
                        allUsers={allUsers}
                        onClose={handleCloseModal}
                        onCreateExpense={handleCreateExpense}
                        onSubmit={editingExpense ? handleUpdateExpense : null}
                        expenseData={editingExpense}
                    />
                )}
            </div>
        </div>
    );
}