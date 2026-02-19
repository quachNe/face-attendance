import API from "../config/Api";

// Lấy danh sách đơn nghỉ phép
export const getLeave = (scope = "self") =>
    API.get("/leaves", {
        params: { scope }
    });

// Tạo đơn nghỉ phép
export const createLeave = (payload) => 
    API.post("/leaves", payload);

// Sửa đơn nghỉ phép
export const updateLeave = (id, payload) => 
    API.put(`/leaves/${id}`, payload);