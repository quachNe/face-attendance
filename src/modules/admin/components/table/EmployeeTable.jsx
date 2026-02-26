import React from "react";
import {
  ScanFace,
  CameraOff,
  Pencil,
  Trash2,
  Camera,
} from "lucide-react";
import { stylesButton, styleTable, tooltipStyle } from "../../style/Styles";
import Tooltip from "./Tooltip";

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
                {[
                  "#",
                  "Họ Và Tên",
                  "Ngày Sinh",
                  "Email",
                  "SĐT",
                  "Chức Vụ",
                  "Ca",
                  "Khuôn Mặt",
                  "Thao Tác",
                ].map((h) => (
                  <th key={h} style={styleTable.th}>
                    {h}
                  </th>
                ))}
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

                      <td style={styleTable.td}>
                        {u.role === "admin"
                          ? "Quản trị viên"
                          : "Nhân viên"}
                      </td>

                      <td style={styleTable.td}>
                        {u.shift_name || "—"}
                      </td>

                      {/* FACE STATUS */}
                      <td
                        style={{
                          ...styleTable.td,
                          color: u.face_image
                            ? "#22c55e"
                            : "#ef4444",
                        }}
                      >
                        {u.face_image ? (
                          <ScanFace size={18} />
                        ) : (
                          <CameraOff size={18} />
                        )}
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
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(u);
                              }}
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
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openCameraModal(u);
                              }}
                            >
                              <Camera size={15} />
                            </div>
                          </Tooltip>

                          {/* DELETE */}
                          <Tooltip text="Xóa">
                            <div
                              style={{
                                ...stylesButton.iconBoxDelete,
                                ...stylesButton.iconBoxBase,
                              }}
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
                          </Tooltip>
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