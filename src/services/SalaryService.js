import API from "../config/Api";

// GET all salaries
export const getEmployeePayroll = (month, year) =>
    API.get("/payroll/employee-summary", {
        params: { month, year }
    });