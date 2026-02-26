import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  styleTable,
  stylesButton,
  tooltipStyle,
} from "../../style/Styles";
import Tooltip from "./Tooltip";

const ShiftTable = ({
  loading,
  shifts,
  selectedId,
  setSelectedId,
  hoverIcon,
  setHoverIcon,
  openEditModal,
//   handleDelete,
}) => {
  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <div style={styleTable.loadingOverlay}>
          <div style={styleTable.spinner}></div>
        </div>
      )}

      <div style={styleTable.tableWrapper}>
        <div style={styleTable.tableScroll}>
          <table style={styleTable.table}>
            <thead>
              <tr>
                {["#", "Tên Ca", "Giờ Bắt Đầu", "Giờ Kết Thúc", "Thao Tác"].map(
                  (h) => (
                    <th key={h} style={styleTable.th}>
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {shifts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
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
                shifts.map((s, i) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    style={{
                      background:
                        selectedId === s.id
                          ? "#0ca1a120"
                          : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <td style={styleTable.td}>{i + 1}</td>
                    <td style={styleTable.td}>{s.name}</td>
                    <td style={styleTable.td}>
                      {s.start_time || "—"}
                    </td>
                    <td style={styleTable.td}>
                      {s.end_time || "—"}
                    </td>

                    <td style={styleTable.td}>
                      <div style={stylesButton.actionIcons}>
                        {/* EDIT */}
                        <Tooltip text="Chỉnh sửa">
                          <div
                            style={{
                              ...stylesButton.iconBase,
                              ...stylesButton.iconBoxEdit,
                              ...(hoverIcon.id === s.id &&
                                hoverIcon.type === "edit" &&
                                stylesButton.iconBoxEditHover),
                            }}
                            onMouseEnter={() =>
                              setHoverIcon({
                                id: s.id,
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
                              openEditModal(s);
                            }}
                          >
                            <Pencil size={15} />
                          </div>
                        </Tooltip>

                        {/* DELETE */}
                        <Tooltip text="Xóa">
                          <div
                            style={{
                              ...stylesButton.iconBase,
                              ...stylesButton.iconBoxDelete,
                              ...(hoverIcon.id === s.id &&
                                hoverIcon.type === "delete" &&
                                stylesButton.iconBoxDeleteHover),
                            }}
                            onMouseEnter={() =>
                              setHoverIcon({
                                id: s.id,
                                type: "delete",
                              })
                            }
                            onMouseLeave={() =>
                              setHoverIcon({
                                id: null,
                                type: null,
                              })
                            }
                            // onClick={(e) => {
                            //   e.stopPropagation();
                            //   handleDelete(s.id);
                            // }}
                          >
                            <Trash2 size={15} />
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

export default ShiftTable;