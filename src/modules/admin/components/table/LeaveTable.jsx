import React from "react";
import { Eye } from "lucide-react";
import { styleTable, stylesButton, tooltipStyle } from "../../style/Styles";
import Tooltip from "./Tooltip";

const LeaveTable = ({
  loading,
  leaves,
  selectedId,
  setSelectedId,
  hoverIcon,
  setHoverIcon,
  handleOpenModal,
  statusMap,
  leaveTypeMap,
  formatDateTimeVN,
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
                  "Nhân viên",
                  "Loại nghỉ",
                  "Ngày gửi",
                  "Trạng thái",
                  "Thao tác",
                ].map((column) => (
                  <th key={column} style={styleTable.th}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      ...styleTable.td,
                      ...styleTable.notData,
                    }}
                  >
                    Không có dữ liệu....
                  </td>
                </tr>
              ) : (
                !loading &&
                leaves.map((l, i) => (
                  <tr
                    key={l.id}
                    onClick={() => setSelectedId(l.id)}
                    style={{
                      background: selectedId === l.id ? "#0ca1a120" : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <td style={styleTable.td}>{i + 1}</td>
                    <td style={styleTable.td}>{l.user_name}</td>
                    <td style={styleTable.td}>
                      {leaveTypeMap[l.leave_type]}
                    </td>
                    <td style={styleTable.td}>
                      {formatDateTimeVN(l.created_at)}
                    </td>

                    <td style={styleTable.td}>
                      <span
                        style={{
                          background: statusMap[l.status]?.color,
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 600,
                          display: "inline-block",
                          minWidth: 100,
                          textAlign: "center",
                        }}
                      >
                        {statusMap[l.status]?.text}
                      </span>
                    </td>

                    <td style={styleTable.td}>
                      <div style={stylesButton.actionIcons}>
                        <Tooltip text="Chi tiết" >
                          <div
                            style={{
                              ...stylesButton.iconBase,
                              ...stylesButton.iconBoxEdit,
                              ...(hoverIcon.id === l.id &&
                                hoverIcon.type === "edit" &&
                                stylesButton.iconBoxEditHover),
                            }}
                            onMouseEnter={() =>
                              setHoverIcon({
                                id: l.id,
                                type: "edit",
                              })
                            }
                            onMouseLeave={() =>
                              setHoverIcon({
                                id: null,
                                type: null,
                              })
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(l);
                            }}
                          >
                            <Eye size={15} />
                          </div>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveTable;