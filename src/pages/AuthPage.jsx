import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function AuthPage() {
    const [showRegister, setShowRegister] = useState(false);

    return showRegister ? (
        <RegisterForm onSwitch={() => setShowRegister(false)} />
    ) : (
        <LoginForm onSwitch={() => setShowRegister(true)} />
    );
}
