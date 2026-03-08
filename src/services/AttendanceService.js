import API from "../config/Api";

// GET attendance logs
export const getLogs = (params) =>
  API.get("/logs", { params });


// CHECK IN CHECK OUT
export const checkInFace = (image) =>
  API.post("/checkin", { image });