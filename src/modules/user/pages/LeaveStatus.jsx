import React, { useState, useMemo, useEffect } from "react";
import { Eye, Trash2 } from "lucide-react";
import LeaveDetailModal from "../components/modal/LeaveDetailModal.jsx"
import { getLeave } from "../../../services/LeaveService.js";
import { useAuth } from "../../../context/AuthContext.jsx";

const leaveTypeMap = {
  annual_leave: "Nghỉ phép hằng năm",
  sick_leave: "Nghỉ phép bệnh",
  personal_leave: "Nghỉ phép cá nhân",
};

const statusMap = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const formatDateTimeVN = (dateString) => {
  if (!dateString) return "-";

  // ép thành UTC
  const utcString = dateString.replace(" ", "T") + "Z";

  return new Date(utcString).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
};


const LeaveStatus = () => {
  const { user } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // ================= FETCH DATA =================
  const fetchLeave = async () => {
    try {
      setLoading(true);
      const { data } = await getLeave(user.id);
      setLeaves(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nghỉ phép:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchLeave();
    }
  }, [user]);

  // ================= FILTER =================
  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const leaveTypeText = leaveTypeMap[leave.leave_type] || "";

      const matchesSearch =
        leaveTypeText.toLowerCase().includes(search.toLowerCase()) ||
        leave.reason?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || leave.status === statusFilter;

      const matchesType =
        typeFilter === "all" || leave.leave_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [leaves, search, statusFilter, typeFilter]);

  const handleDelete = (id) => {
    alert("Xóa đơn nghỉ ID: " + id);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return { background: "#dcfce7", color: "#166534" };
      case "rejected":
        return { background: "#fee2e2", color: "#991b1b" };
      default:
        return { background: "#fef3c7", color: "#92400e" };
    }
  };

  return (
    <>
      <div style={styles.card}>
        {/* FILTER BAR */}
        <div style={styles.filterBar}>
          <input
            type="text"
            placeholder="Tìm theo loại nghỉ hoặc lý do..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">Tất cả loại nghỉ</option>
            <option value="annual_leave">Nghỉ phép hằng năm</option>
            <option value="sick_leave">Nghỉ phép bệnh</option>
            <option value="personal_leave">Nghỉ phép cá nhân</option>
          </select>
        </div>

        {/* TABLE */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>STT</th>
                <th style={styles.th}>Loại nghỉ</th>
                <th style={styles.th}>Ngày gửi</th>
                <th style={styles.th}>Từ ngày</th>
                <th style={styles.th}>Đến ngày</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={{ ...styles.th, textAlign: "center" }}>
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ ...styles.td, textAlign: "center" }}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ ...styles.td, textAlign: "center" }}>
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave, index) => (
                  <tr key={leave.id} style={styles.tr}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>
                      {leaveTypeMap[leave.leave_type]}
                    </td>
                    <td style={styles.td}>
                      {formatDateTimeVN(leave.created_at)}
                    </td>
                    <td style={styles.td}>{leave.start_date}</td>
                    <td style={styles.td}>{leave.end_date}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.status,
                          ...getStatusStyle(leave.status),
                        }}
                      >
                        {statusMap[leave.status]}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <Eye
                        size={18}
                        style={styles.eye}
                        onClick={() => setSelectedLeave(leave)}
                      />
                      <Trash2
                        size={18}
                        style={styles.delete}
                        onClick={() => handleDelete(leave.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLeave && (
        <LeaveDetailModal
          leave={selectedLeave}
          onClose={() => setSelectedLeave(null)}
        />
      )}
    </>
  );
};

export default LeaveStatus;

const styles = {
  filterBar: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  search: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    width: "250px",
  },

  select: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },

  tableWrapper: {
    maxHeight: "calc(100vh - 370px)",
    overflowY: "auto",
    borderRadius: "12px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    padding: "12px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "600",
    color: "white",
    background: "#1b3e88",
    borderBottom: "1px solid #e2e8f0",
  },

  tr: { transition: "background 0.15s ease" },

  td: {
    padding: "14px 12px",
    fontSize: "14px",
    color: "#334155",
    borderBottom: "1px solid #e5e7eb",
  },

  status: {
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  eye: {
    cursor: "pointer",
    color: "#2563eb",
    marginRight: "12px",
  },

  delete: {
    cursor: "pointer",
    color: "#ef4444",
  },
};