import API from "../config/Api";

/* ================= TỔNG QUAN ================= */
export const getStats = () => API.get("/stats");

/* ================= TOP ĐI TRỄ ================= */
export const getEmployeeRanking = () => API.get("/stats/employee-ranking");


export const getAttendanceChart = (month) =>
  API.get("/stats/chart", { params: { month } });

export const getSalaryChart = (year) =>
  API.get("/payroll/yearly-total", { params: { year } });