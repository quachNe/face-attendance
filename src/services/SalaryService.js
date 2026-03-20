import API from "../config/Api";

// GET all salaries
export const getEmployeePayroll = (month, year) =>
    API.get("/payroll/employee-summary", {
        params: { month, year }
    });

export const payPayroll = (id) => {
  API.put(`/payroll/pay/${id}`);
};


export const getSalaryOnlyEmployee = (month, year) => {
  const params = {};

  if (month) params.month = month;
  if (year) params.year = year;

  return API.get("/payroll", { params });
};