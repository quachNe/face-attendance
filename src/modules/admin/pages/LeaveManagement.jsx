import React, { useEffect, useState } from "react";
import { Styles, stylesForm, styleTable, stylesButton } from "../style/Styles";
import { CalendarCheck, Eye  } from "lucide-react";
import { getLeave } from "../../../services/LeaveService";
import { toast } from "react-toastify";

const LeaveManagement = () => {
    const leaveTypeMap = {
        annual_leave: "Nghỉ phép hằng năm",
        sick_leave: "Nghỉ phép bệnh",
        personal_leave: "Nghỉ phép cá nhân",
    };

    const formatDateTimeVN = (dateString) => {
        if (!dateString) return "-";

        // ép thành UTC
        const utcString = dateString.replace(" ", "T") + "Z";

        return new Date(utcString).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
        });
    };
    
    const [leaves, setLeaves] = useState([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [hoverIcon, setHoverIcon] = useState({
        id: null,
        type: null,
    });

    const [selectedId, setSelectedId] = useState(null);
    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const { data } = await getLeave("all");
            setLeaves(data);
        } catch (err) {
            toast.error("Lỗi tải danh sách nghỉ phép");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const filteredLeaves = leaves.filter((l) => {
        const keyword = search.toLowerCase().trim();

        const matchSearch = !keyword || l.user_name?.toLowerCase().includes(keyword);

        const matchStatus = filterStatus === "all" || l.status === filterStatus;

        return matchSearch && matchStatus;
    });

    return (
        <>
            {/* HEADER */}
            <div style={Styles.header}>
                <h1
                    style={{
                        ...Styles.title,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <CalendarCheck /> QUẢN LÝ ĐƠN XIN NGHỈ PHÉP
                </h1>

                <div style={Styles.actions}>
                    <input
                        placeholder="Tìm theo tên nhân viên"
                        style={stylesForm.searchInput}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        style={stylesForm.filterSelect}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Từ chối</option>
                    </select>
                </div>
            </div>

            {/* TABLE */}
            {/* ================= TABLE ================= */}
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
                                ].map((h) => (
                                <th key={h} style={styleTable.th}>
                                    {h}
                                </th>
                                ))}
                            </tr>
                            </thead>

                            <tbody>
                                {!loading && filteredLeaves.map((l, i) => (
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
                                            {l.status === "pending" && "Chờ duyệt"}
                                            {l.status === "approved" && "Đã duyệt"}
                                            {l.status === "rejected" && "Từ chối"}
                                        </td>
                                        <td style={styleTable.td}>
                                            <div style={stylesButton.actionIcons}>
                                                <div
                                                    style={{
                                                        ...stylesButton.iconBase,
                                                        ...stylesButton.iconBoxEdit,
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenModal(l);
                                                    }}
                                                >
                                                    <Eye size={15} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeaveManagement;