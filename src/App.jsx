import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import SettlementsPage from "./pages/SettlementsPage";
import GroupCreate from "./components/GroupCreate";
import GroupDetail from "./components/GroupDetail";
import Layout from "./pages/Layout";


export default function App() {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-300">Loading...</p>
            </div>
        );
    }
    if (!user) {
        return <AuthPage />;
    }

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/settlements" element={<SettlementsPage />} />
                <Route path="/groups/create" element={<GroupCreate />} />
                <Route path="/groups/:id" element={<GroupDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
