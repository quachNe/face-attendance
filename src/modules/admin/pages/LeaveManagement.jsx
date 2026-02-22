import React, { useEffect, useState } from "react";
import { Styles, stylesForm, styleTable, stylesButton, tooltipStyle} from "../style/Styles";
import { CalendarCheck, Eye  } from "lucide-react";
import { getLeave, updateLeave } from "../../../services/LeaveService";
import { toast } from "react-toastify";
import LeaveModal from "../components/modal/LeaveModal";

const LeaveManagement = () => {
    const statusMap = {
        pending: { text: "Chờ duyệt", color: "#f59e0b" }, // vàng
        approved: { text: "Đã duyệt", color: "#22c55e" }, // xanh
        rejected: { text: "Từ chối", color: "#ef4444" },  // đỏ
    };
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
    const [showModal, setShowModal] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [hoverIcon, setHoverIcon] = useState({
        id: null,
        type: null,
    });

    const [selectedId, setSelectedId] = useState(null);

    const handleOpenModal = (leave) => {
        setSelectedLeave(leave);
        setShowModal(true);
    };

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

    const handleUpdateStatus = async (leaveId, newStatus, response = "") => {
        try {
            const payload = {
            status: newStatus,
            response: response, // nếu backend có cột phản hồi
            };

            await updateLeave(leaveId, payload);

            toast.success(
            newStatus === "APPROVED"
                ? "Đã duyệt đơn nghỉ"
                : "Đã từ chối đơn nghỉ"
            );

            setShowModal(false);
            fetchLeaves(); // reload bảng
        } catch (error) {
            toast.error("Cập nhật trạng thái thất bại");
            console.error(error);
        }
    };

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
                <form autoComplete="off">
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
                </form>
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
                                                <div style={tooltipStyle.wrapper}>
                                                    <div
                                                        style={{
                                                            ...stylesButton.iconBase,
                                                            ...stylesButton.iconBoxEdit,
                                                            ...(hoverIcon.id === l.id &&
                                                                hoverIcon.type === "edit" && stylesButton.iconBoxEditHover),
                                                        }}
                                                        onMouseEnter={() => setHoverIcon({ id: l.id, type: "edit" })}
                                                        onMouseLeave={() => setHoverIcon({ id: null, type: null })}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenModal(l);
                                                        }}
                                                    >
                                                        <Eye size={15} />
                                                    </div>
                                                    {hoverIcon.id === l.id && hoverIcon.type === "edit" && (
                                                        <div style={tooltipStyle.tooltip}>
                                                            Chi tiết
                                                            <div style={tooltipStyle.arrow} />
                                                        </div>
                                                    )}
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
            <LeaveModal
                show={showModal}
                onClose={() => setShowModal(false)}
                leave={selectedLeave}
                onUpdateStatus={handleUpdateStatus}
            />
        </>
    );
};

export default LeaveManagement;