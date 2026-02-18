export const Styles = {
    title: {
        margin: 0,
        fontSize: "24px",
        fontWeight: "600",
        textAlign: "center",
        color: "#0f172a",
    },

    required: {
        color: "red",
    },

    label: {
        fontSize: "14px",
        fontWeight: "500",
        color: "#334155",
    },

    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
    },

    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "10px",
    },

    input: {
        width: "100%",
        padding: "11px 14px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        fontSize: "14px",
        outline: "none",
    },

    disabled: {
        width: "100%",
        padding: "11px 14px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        background: "#f1f5f9",
        fontSize: "14px",
    },

    closeBtn: {
        position: "absolute",
        top: "12px",
        right: "12px",
        width: "34px",
        height: "34px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        background: "#f1f5f9",
        color: "#475569",
        transition: "all 0.2s ease",
    },

    cancelBtn: {
        padding: "9px 18px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        background: "#f8fafc",
        cursor: "pointer",
    },

    saveBtn: {
        padding: "9px 18px",
        borderRadius: "8px",
        border: "none",
        background: "linear-gradient(90deg,#1e3a8a,#0f4c81)",
        color: "white",
        cursor: "pointer",
    },

    message: {
        color: "red", 
        fontSize: 14, 
        fontWeight: "bold", 
        marginTop: 20, 
        textAlign: "center", 
        marginBottom:20
    },

    content: {
        position: "relative",
        background: "#fff",
        padding: "35px 30px",
        borderRadius: "18px",
        width: "430px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        transition: "all 0.2s ease",
    },
}