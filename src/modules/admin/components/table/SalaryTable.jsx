import React from "react";
import { styleTable, stylesButton } from "../../style/Styles";
import Tooltip from "./Tooltip";
import { Eye } from "lucide-react";
const SalaryTable = ({
    loading,
    salaries,
    selectedId,
    setSelectedId,
    hoverIcon,
    setHoverIcon,
    onViewSalary
}) => {

    const formatCurrency = (value) => {
        if (!value) return "0 ₫";
        return value.toLocaleString("vi-VN") + " ₫";
    };

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
                                {[
                                "#",
                                "Tên nhân viên",
                                "Mã nhân viên",
                                "Chức vụ",
                                "Lương cơ bản",
                                "Ngày đi làm",
                                "Vắng phép",
                                "Vắng không phép",
                                "Phút trễ",
                                "Phút về sớm",
                                "Phút OT",
                                "Thao tác"
                                ].map((h) => (
                                <th key={h} style={styleTable.th}>
                                    {h}
                                </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {salaries.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={11}
                                        style={{
                                            ...styleTable.td,
                                            ...styleTable.notData,
                                        }}
                                    >
                                        Không có dữ liệu...
                                    </td>
                                </tr>
                            ) : (
                                !loading && salaries.map((salary, i) => (
                                    <tr
                                        key={salary.id || i}
                                        onClick={() => setSelectedId(salary.id)}
                                        style={{
                                        background: selectedId === salary.id ? "#0ca1a120" : "transparent",
                                        cursor: "pointer",
                                        }}
                                    >
                                        <td style={styleTable.td}>{i + 1}</td>
                                        <td style={styleTable.td}>{salary.name}</td>
                                        <td style={styleTable.td}>{salary.employee_code}</td>
                                        <td
                                            style={{
                                                ...styleTable.td,
                                                fontWeight: 600,
                                                color:salary.role === "ADMIN" ? "#dc2626" : "#16a34a",
                                            }}
                                        >
                                            {salary.role === "ADMIN" ? "Quản trị viên" : "Nhân viên"}
                                        </td>
                                        <td style={styleTable.td}>{formatCurrency(salary.base_salary)}</td>
                                        <td style={styleTable.td}>{salary.total_working_days}</td>
                                        <td style={styleTable.td}>{salary.leave_days}</td>
                                        <td style={styleTable.td}>{salary.absent_days}</td>
                                        <td style={{ ...styleTable.td, color: "#f59e0b" }}>{salary.total_late_minutes}</td>
                                        <td style={{ ...styleTable.td, color: "#f97316" }}>{salary.total_early_minutes}</td>
                                        <td style={{ ...styleTable.td, color: "#9333ea" }}>{salary.total_overtime_minutes}</td>
                                        {/* NÚT XEM CHI TIẾT */}
                                        <td style={styleTable.td}>
                                            <div style={stylesButton.actionIcons}>
                                                <Tooltip text="Chi tiết" >
                                                <div
                                                    style={{
                                                        ...stylesButton.iconBase,
                                                        ...stylesButton.iconBoxEdit,
                                                        ...(hoverIcon.id === salary.id &&
                                                            hoverIcon.type === "edit" &&
                                                            stylesButton.iconBoxEditHover),
                                                    }}
                                                    onMouseEnter={() =>
                                                        setHoverIcon({
                                                            id: salary.id,
                                                            type: "edit",
                                                        })
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoverIcon({
                                                            id: null,
                                                            type: null,
                                                        })
                                                    }
                                                    onClick={() => onViewSalary(salary)}
                                                >
                                                    <Eye size={15} />
                                                </div>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalaryTable;