import React, { useEffect, useState } from "react";
import { Styles, stylesForm, stylesButton} from "../style/Styles";
import { CalendarCheck, RotateCcw} from "lucide-react";
import { getLeave, updateLeave } from "../../../services/LeaveService";
import { toast } from "react-toastify";
import LeaveModal from "../components/modal/LeaveModal";
import LeaveTable from "../components/table/LeaveTable";
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
    const [filterLeaveType, setFilterLeaveType] = useState("all");
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
            comment: response,
        };

        const res = await updateLeave(leaveId, payload);

        if (res.data.success) {
            toast.success(
                newStatus === "APPROVED"
                    ? "Đã duyệt đơn nghỉ"
                    : "Đã từ chối đơn nghỉ"
            );
            setShowModal(false);
            fetchLeaves();
        } else {
            toast.error(res.data.message || "Cập nhật thất bại");
        }

    } catch (error) {
        toast.error("Cập nhật trạng thái thất bại");
        console.error(error);
    }
};

    const handleResetFilter = () => {
        setSearch("");
        setFilterStatus("all");
        setFilterLeaveType("all");
    };
    const filteredLeaves = leaves.filter((l) => {
        const keyword = search.toLowerCase().trim();

        const matchSearch = !keyword || l.user_name?.toLowerCase().includes(keyword);

        const matchStatus = filterStatus === "all" || l.status === filterStatus;
        const matchLeaveType = filterLeaveType === "all" || l.leave_type === filterLeaveType;

        return matchSearch && matchStatus && matchLeaveType ;
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
                    <CalendarCheck /> QUẢN LÝ NGHỈ PHÉP
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
                            <option value="all">Tất cả trạng thái</option>
                            <option value="pending">Chờ duyệt</option>
                            <option value="approved">Đã duyệt</option>
                            <option value="rejected">Từ chối</option>
                        </select>

                        <select
                            style={stylesForm.filterSelect}
                            value={filterLeaveType}
                            onChange={(e) => setFilterLeaveType(e.target.value)}
                        >
                            <option value="all">Tất cả loại nghỉ</option>
                            <option value="annual_leave">Nghỉ phép hàng năm</option>
                            <option value="sick_leave">Nghỉ phép bệnh</option>
                            <option value="personal_leave">Nghỉ phép cá nhân</option>
                        </select>

                        <button
                            type="button"
                            style={stylesButton.btnReset}
                            onClick={handleResetFilter}
                        >
                            <RotateCcw size={16} />
                        </button>
                    </div>
                </form>
            </div>

            {/* ================= TABLE ================= */}
            <LeaveTable
                loading={loading}
                leaves={filteredLeaves}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                hoverIcon={hoverIcon}
                setHoverIcon={setHoverIcon}
                handleOpenModal={handleOpenModal}
                statusMap={statusMap}
                leaveTypeMap={leaveTypeMap}
                formatDateTimeVN={formatDateTimeVN}
            />
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