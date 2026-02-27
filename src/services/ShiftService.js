import API from "../config/Api";

// GET all shifts
export const getShifts = () => API.get("/shifts");

// GET shift by id
export const getShiftById = (id) => API.get(`/shifts/${id}`);

// CREATE shift
export const createShift = (payload) => API.post("/shifts", payload);

// UPDATE shift
export const updateShift = (id, payload) => API.put(`/shifts/${id}`, payload);

// DELETE shift
export const deleteShift = (id) => API.delete(`/shifts/${id}`);