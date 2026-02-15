import React, { createContext, useContext, useState } from "react";
import { loginApi } from "../services/EmployeeService";

// Tạo ra một context mới
const AuthContext = createContext();

// Hook để lấy dữ liệu từ AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // STATE LƯU USER VÀO LOCALSTORGE
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // XỬ LÝ LOGIN
    const login = async (username, password) => {
        try {
            const res = await loginApi({
                username: username.trim(),
                password: password.replace(/\n/g, "").trim(),
            });

            const data = res.data;

            if (data.success) {
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
            return {
                success: false,
                message:
                    error.response?.data?.message || "Network error",
            };
        }
    };

    // XỬ LÝ LOGOUT
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