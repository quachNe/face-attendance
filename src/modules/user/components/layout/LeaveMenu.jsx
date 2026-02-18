import React from "react";
import { useAuth } from "../../../../context/AuthContext";
import { CalendarDays, FileText } from "lucide-react";

export default function LeaveMenu({ active, setActive, onLoginClick }) {
    const { user } = useAuth();

    const handleOnclick = (menu) => {
        if (user === null) {
            onLoginClick();
            return;
        }
        setActive(menu);
    };
    return (
        <div style={styles.menuCard}>
        
            <div
                style={{
                ...styles.menuItem,
                background: active === "request" ? "#e7f0ff" : "transparent",
                }}
                onClick={() => handleOnclick("request")}
            >
                <CalendarDays size={20} />
                <span>Gửi đơn xin nghỉ phép</span>
            </div>

            <div
                style={{
                ...styles.menuItem,
                background: active === "status" ? "#e7f0ff" : "transparent",
                }}
                onClick={() => handleOnclick("status")} 
            >
                <FileText size={20} />
                <span>Xem trạng thái xét duyệt</span>
            </div>  
        </div>
    );
}

const styles = {
    menuCard: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
    },

    menuItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "10px",
        transition: "0.2s",
        fontWeight: "500",
    },
};