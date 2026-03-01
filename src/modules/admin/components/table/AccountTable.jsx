import React from "react";
import { Lock, Unlock } from "lucide-react";
import { styleTable, stylesButton } from "../../style/Styles";
import Tooltip from "./Tooltip";

const AccountTable = ({
    loading,
    accounts,
    selectedId,
    setSelectedId,
    hoverIcon,
    setHoverIcon,
    onToggleLock,
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
                                {["#","Tên nhân viên","Tên tài khoản","Vai trò","Trạng thái","Thao tác",].map((h) => (
                                    <th key={h} style={styleTable.th}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {accounts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        style={{
                                            ...styleTable.td,
                                            ...styleTable.notData,
                                        }}
                                    >
                                        Không có dữ liệu...
                                    </td>
                                </tr>
                            ) : (
                                !loading && accounts.map((acc, i) => (
                                    <tr
                                        key={acc.id}
                                        onClick={() => setSelectedId(acc.id)}
                                        style={{
                                            background: selectedId === acc.id ? "#0ca1a120" : "transparent",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <td style={styleTable.td}>{i + 1}</td>
                                        <td style={styleTable.td}>{acc.name}</td>
                                        <td style={styleTable.td}>{acc.username}</td>
                                        <td style={styleTable.td}>{acc.role}</td>

                                    <td
                                        style={{
                                            ...styleTable.td,
                                            fontWeight: 600,
                                            color: acc.is_active ? "#16a34a" : "#dc2626",
                                        }}
                                    >
                                        {acc.is_active ? "Hoạt động" : "Tạm khóa"}
                                    </td>

                                    <td style={styleTable.td}>
                                        <div style={stylesButton.actionIcons}>
                                            <Tooltip
                                                text={acc.is_active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                            >
                                            <div
                                                style={{
                                                    ...stylesButton.iconBase,
                                                    ...stylesButton.iconBoxEdit,
                                                    border: `1px solid ${acc.is_active ? "#dc2626" : "#16a34a"}`,
                                                    ...(hoverIcon.id === acc.id &&
                                                        hoverIcon.type === "lock" && {
                                                            backgroundColor: acc.is_active
                                                            ? "#fee2e2"
                                                            : "#dcfce7",
                                                            border: `1px solid ${
                                                            acc.is_active ? "#dc2626" : "#16a34a"
                                                            }`,
                                                        }
                                                    ),
                                                }}
                                                onMouseEnter={() =>setHoverIcon({id: acc.id,type: "lock",})}
                                                onMouseLeave={() =>setHoverIcon({id: null,type: null,})}
                                                onClick={(e) => {e.stopPropagation();onToggleLock(acc);}}
                                                >
                                                    {acc.is_active ? (
                                                        <Lock size={15} color="#dc2626" />
                                                    ) : (
                                                        <Unlock size={15} color="#16a34a" />
                                                    )}
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

export default AccountTable;