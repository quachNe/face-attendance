import API from "../config/Api";

// GET lấy danh sách đơn nghỉ phép (đối với nhân viên chỉ lấy những đơn thuộc về nhân viên đó)
// đối với admin thì lấy danh sách tất cả các đơn nghỉ phép
export const getLeave = (scope = "self") =>
    API.get("/leaves", {
        params: { scope }
    });

// POST tạo đơn nghỉ phép
export const createLeave = (payload) =>  API.post("/leaves", payload);

// UPDATE trạng thái đơn nghỉ phép (chức năng duyệt đơn cho quản trị viên)
export const updateLeave = (id, payload) =>  API.put(`/leaves/${id}`, payload);