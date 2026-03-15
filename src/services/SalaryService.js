import API from "../config/Api";

// GET all salaries
export const getEmployeePayroll = (month, year) =>
    API.get("/payroll/employee-summary", {
        params: { month, year }
    });

export const payPayroll = (id) => {
  API.put(`/payroll/pay/${id}`);
};