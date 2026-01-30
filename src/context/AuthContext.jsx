import React, { createContext, useContext, useState } from "react";

// Tạo ra một context mới
const AuthContext = createContext();

// Hook để lấy dữ liệu từ AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (username, password) => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username.trim(),
                password: password.replace(/\n/g, "").trim(),
            }),
            });

            const data = await res.json();
            console.log(data);

            if (res.ok && data.success) {
            // ✅ backend trả trực tiếp
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            return { success: true };
            } else {
            return {
                success: false,
                message: data.message || "Tên đăng nhập hoặc mật khẩu không đúng",
            };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: "Network error" };
        }
    };


    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        sessionStorage.removeItem("lowStockNotificationShown");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};