export const Styles = {
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

    title: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "600",
        textAlign: "center",
        color: "#0f172a",
    },
}


export const ButtonStyles = {
    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "10px",
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
}