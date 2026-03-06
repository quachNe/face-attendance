import React from "react";
import { styleTable } from "../../style/Styles";

const AttendanceTable = ({ loading, records, selectedId, setSelectedId}) => {
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
                                {["#", "Họ Và Tên", "Giờ Vào", "Giờ Ra", "Số Phút Trễ","Số Phút Về Sớm", "Số Phút Tăng Ca", "Ghi Chú"]
                                .map( (c) => (<th key={c} style={styleTable.th}> {c} </th>))}
                            </tr>
                        </thead>

                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        style={{
                                            ...styleTable.td,
                                            ...styleTable.notData,
                                        }}
                                    >
                                        Không có dữ liệu....
                                    </td>
                                </tr>
                            ) : (
                                !loading && records.map((r, i) => {
                                    const rowId = r.id ?? i;
                                    return (
                                        <tr
                                            key={rowId}
                                            onClick={() => setSelectedId(rowId)}
                                            style={{
                                                background: selectedId === rowId ? "#0ca1a120" : "transparent",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <td style={styleTable.td}>{i + 1}</td>
                                            <td style={styleTable.td}>{r.name}</td>
                                            <td style={styleTable.td}>{r.time}</td>
                                            <td style={styleTable.td}>{r.checkout}</td>
                                            <td style={styleTable.td}>{r.late_minutes}</td>
                                            <td style={styleTable.td}>{r.early_leave_minutes}</td>
                                            <td style={styleTable.td}>{r.overtime_minutes}</td>
                                            <td
                                                style={{
                                                    ...styleTable.td,
                                                    fontWeight: 600,
                                                    color: r.status === "PRESENT" ? "#22c55e" : 
                                                        r.status === "ABSENT" ? "#ef4444" : "#f59e0b",
                                                }}
                                                >
                                                {r.status === "PRESENT" ? "Có mặt" : r.status === "ABSENT"
                                                    ? "Vắng" : "Nghỉ phép"}
                                                </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceTable;