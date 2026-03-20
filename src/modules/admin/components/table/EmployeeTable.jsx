import React from "react";
import {
  ScanFace,
  CameraOff,
  Pencil,
  Trash2,
  Camera,
} from "lucide-react";
import { stylesButton, styleTable} from "../../style/Styles";
import Tooltip from "./Tooltip";
const formatCurrency = (value) => {
  if (!value) return "0 ₫";
  return value.toLocaleString("vi-VN") + " ₫";
};

const EmployeeTable = ({
  users,
  loading,
  selectedId,
  setSelectedId,
  hoverIcon,
  setHoverIcon,
  openEditModal,
  openCameraModal,
  setUsers,
}) => {
  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <div style={styleTable.loadingOverlay}>
          <div style={styleTable.spinner}></div>
        </div>
      )}

      <div style={styleTable.tableWrapper}>
        <div style={styleTable.tableScroll} className="custom-scroll">
          <table style={styleTable.table}>
            <thead>
              <tr>
                <th style={{...styleTable.th, width: "40px"}}>#</th>
                <th style={{...styleTable.th, width: "180px"}}>Họ và tên</th>
                <th style={{...styleTable.th, width: "110px"}}>Ngày sinh</th>
                <th style={{...styleTable.th, width: "200px"}}>Email</th>
                <th style={{...styleTable.th, width: "120px"}}>SĐT</th>
                <th style={{...styleTable.th, width: "120px"}}>Chức vụ</th>
                <th style={{...styleTable.th, width: "120px"}}>Ca</th>
                <th style={{...styleTable.th, width: "170px"}}>Lương cơ bản</th>
                <th style={{...styleTable.th, width: "100px"}}>Khuôn mặt</th>
                <th style={{...styleTable.th, width: "140px"}}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                users
                  .filter((u) => u && u.id)
                  .map((u, i) => (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedId(u.id)}
                      style={{
                        background:
                          selectedId === u.id
                            ? "#0ca1a120"
                            : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <td style={styleTable.td}>{i + 1}</td>
                      <td style={styleTable.td}>{u.name}</td>
                      <td style={styleTable.td}>{u.dob || "—"}</td>
                      <td style={styleTable.td}>{u.email || "—"}</td>
                      <td style={styleTable.td}>{u.phone || "—"}</td>

                      <td style={{
                        ...styleTable.td,
                        fontWeight: 600,
                        color: u.role === "admin" ? "#dc2626" : "#16a34a" ,
                      }} >
                        {u.role === "admin" ? "Quản trị viên" : "Nhân viên"}
                      </td>

                      <td style={styleTable.td}>{u.shift_name || "—"}</td>
                      <td style={styleTable.td}>{formatCurrency(u.base_salary)}</td>
                      {/* FACE STATUS */}
                      <td
                        style={{
                          ...styleTable.td,
                          color: u.face_image
                            ? "#22c55e"
                            : "#ef4444",
                        }}
                      >
                        {u.face_image ? (<ScanFace size={18} />) : (<CameraOff size={18} />)}
                      </td>

                      {/* ACTIONS */}
                      <td style={styleTable.td}>
                        <div style={stylesButton.actionIcons}>
                          {/* EDIT */}
                          <Tooltip text="Chỉnh sửa">
                            <div
                              style={{
                                ...stylesButton.iconBoxEdit,
                                ...stylesButton.iconBoxBase,
                                ...(hoverIcon.id === u.id &&
                                  hoverIcon.type === "edit" &&
                                  stylesButton.iconBoxEditHover),
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(u);
                              }}
                              onMouseEnter={() =>
                                setHoverIcon({ id: u.id, type: "edit" })
                              }
                              onMouseLeave={() =>
                                setHoverIcon({ id: null, type: null })
                              }
                            >
                              <Pencil size={15} />
                            </div>
                          </Tooltip>

                          {/* REGISTER FACE */}
                          <Tooltip text="Thêm khuôn mặt">
                            <div
                              style={{
                                ...stylesButton.iconBoxRegisterFace,
                                ...stylesButton.iconBoxBase,
                                ...(hoverIcon.id === u.id &&
                                  hoverIcon.type === "registerface" &&
                                  stylesButton.iconBoxRegisterFaceHover),
                              }}

                              onMouseEnter={() =>
                                setHoverIcon({ id: u.id, type: "registerface" })
                              }
                              onMouseLeave={() =>
                                setHoverIcon({ id: null, type: null })
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                openCameraModal(u);
                              }}
                            >
                              <Camera size={15} />
                            </div>
                          </Tooltip>

                          {/* DELETE */}
                          {/* <Tooltip text="Xóa">
                            <div
                              style={{
                                ...stylesButton.iconBoxDelete,
                                ...stylesButton.iconBoxBase,
                                ...(hoverIcon.id === u.id &&
                                  hoverIcon.type === "delete" &&
                                  stylesButton.iconBoxDeleteHover),
                              }}
                              onMouseEnter={() =>
                                setHoverIcon({ id: u.id, type: "delete" })
                              }
                              onMouseLeave={() =>
                                setHoverIcon({ id: null, type: null })
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                setUsers((prev) =>
                                  prev.filter(
                                    (item) => item?.id !== u.id
                                  )
                                );
                              }}
                            >
                              <Trash2 size={15} />
                            </div>
                          </Tooltip> */}
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;