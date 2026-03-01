import API from "../config/Api";

// Đăng nhập hệ thống
export const loginApi = (payload) =>
  API.post("/auth/login", payload);

// Lấy danh sách toàn bộ nhân viên
export const getEmployees = () =>
  API.get("/employees");

// Lấy thông tin chi tiết một nhân viên theo ID
export const getEmployeeById = (id) =>
  API.get(`/employees/${id}`);

// Tạo mới một nhân viên
export const createEmployee = (payload) =>
  API.post("/employees", payload);

// Cập nhật thông tin nhân viên theo ID
export const updateEmployee = (id, payload) =>
  API.put(`/employees/${id}`, payload);

// Xóa nhân viên theo ID
export const deleteEmployee = (id) =>
  API.delete(`/employees/${id}`);

// Cập nhật thông tin cá nhân (có thể bao gồm đổi mật khẩu)
export const updateProfile = (payload) =>
  API.put("/profile", payload);

// Phân tích ảnh khuôn mặt và trả về embedding
export const analyzeFaceSetup = (payload) =>
  API.post("/face-setup/analyze", payload);

// Gửi 3 embedding khuôn mặt và lưu vào database
export const finishFaceSetup = (payload) =>
  API.post("/face-setup/finish", payload);

// Admin cấp lại mật khẩu cho nhân viên theo ID
export const resetPasswordByAdmin = (id) => {
  API.put(`/reset-password/${id}`);
};

// User gửi yêu cầu cấp lại mật khẩu (quên mật khẩu)
export const requestPasswordReset = (payload) =>
  API.post("/reset-password-request", payload);

// Đổi mật khẩu (sau khi đăng nhập hoặc sau khi được cấp lại)
export const changePassword = (payload) =>
  API.put("/change-password", payload);