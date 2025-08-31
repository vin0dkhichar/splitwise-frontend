import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetch("http://localhost:8000/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Not authenticated");
                    return res.json();
                })
                .then((data) => {
                    setUser(data);
                    setLoading(false);
                })
                .catch(() => {
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem("token");
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const res = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
        });

        if (!res.ok) throw new Error("Invalid credentials");

        const data = await res.json();
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);

        const meRes = await fetch("http://localhost:8000/auth/me", {
            headers: { Authorization: `Bearer ${data.access_token}` },
        });
        const me = await meRes.json();
        setUser(me);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
