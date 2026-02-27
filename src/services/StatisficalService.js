import API from "../config/Api";

/* ================= TỔNG QUAN ================= */
export const getStats = () => API.get("/stats");

/* ================= TOP ĐI TRỄ ================= */
export const getTopLate = () => API.get("/stats/top-late");