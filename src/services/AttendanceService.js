import API from "../config/Api";

// GET attendance logs
export const getLogs = (params) =>
  API.get("/logs", { params });
