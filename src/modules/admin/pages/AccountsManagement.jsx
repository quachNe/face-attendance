import React, { useEffect, useState } from "react";
import { Styles, stylesForm } from "../style/Styles";
import { UserCog } from "lucide-react";
import { getEmployees, updateEmployee } from "../../../services/EmployeeService";
import { toast } from "react-toastify";
import AccountTable from "../components/table/AccountTable";

const AccountsManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [hoverIcon, setHoverIcon] = useState({ id: null, type: null });
    const [selectedId, setSelectedId] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // ================= FETCH =================
    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const { data } = await getEmployees();
            const userNotRootAdmin = data.filter(
                u => u.username !== "admin"
            );
            setAccounts(userNotRootAdmin);
        } catch (err) {
            toast.error("Lỗi tải danh sách tài khoản");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    // ================= TOGGLE LOCK =================
    const handleToggleLock = async (account) => {
        if (account.id === currentUser?.id) {
            toast.warning("Bạn không thể tự khóa tài khoản của mình");
            return;
        }
        try {
            await updateEmployee(account.id, {is_active: !account.is_active,});

            toast.success(account.is_active ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản");

            fetchAccounts();
        } catch (error) {
            toast.error("Cập nhật trạng thái thất bại");
            console.error(error);
        }
    };

    // ================= FILTER =================
    const filteredAccounts = accounts.filter((a) => {
        const keyword = search.toLowerCase().trim();

        const matchSearch = keyword || a.name?.toLowerCase().includes(keyword) || a.username?.toLowerCase().includes(keyword);

        const matchStatus = filterStatus === "all" || (filterStatus === "active" && a.is_active) || (filterStatus === "locked" && !a.is_active);

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
                    <UserCog /> QUẢN LÝ TÀI KHOẢN NHÂN VIÊN
                </h1>

                <form autoComplete="off">
                    <div style={Styles.actions}>
                        <input
                            placeholder="Tìm theo tên hoặc username"
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
                            <option value="active">Đang hoạt động</option>
                            <option value="locked">Đã khóa</option>
                        </select>
                    </div>
                </form>
            </div>

            {/* TABLE */}
            <AccountTable
                loading={loading}
                accounts={filteredAccounts}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                hoverIcon={hoverIcon}
                setHoverIcon={setHoverIcon}
                onToggleLock={handleToggleLock}
            />
        </>
    );
};

export default AccountsManagement;