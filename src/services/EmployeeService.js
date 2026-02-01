import API from "../config/Api";

// GET
export const getEmployees = () =>
  API.get("/employees");

// GET by ID
export const getEmployeeById = (id) =>
  API.get(`/employees/${id}`);

// POST
export const createEmployee = (payload) =>
  API.post("/employees", payload);

// PUT
export const updateEmployee = (id, payload) =>
  API.put(`/employees/${id}`, payload);

// DELETE
export const deleteEmployee = (id) =>
  API.delete(`/employees/${id}`);