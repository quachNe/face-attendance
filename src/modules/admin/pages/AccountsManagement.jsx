import React, { useEffect, useState } from "react";
import { Styles, stylesForm, stylesButton} from "../style/Styles";
import { UserCog, RotateCcw} from "lucide-react";
import { getEmployees, updateEmployee, resetPasswordByAdmin} from "../../../services/EmployeeService";
import { toast } from "react-toastify";
import AccountTable from "../components/table/AccountTable";

const AccountsManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [hoverIcon, setHoverIcon] = useState({ id: null, type: null });
    const [selectedId, setSelectedId] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const handleResetFilter = () => {
        setSearch("");
        setFilterRole("all");
        setFilterStatus("all");
    };
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

            await  fetchAccounts();
        } catch (error) {
            toast.error("Cập nhật trạng thái thất bại");
            console.error(error);
        }
    };

    const handleResetPassword = async (account) => {
        try {
            await resetPasswordByAdmin(account.id);
            setAccounts(prev =>
                prev.map(a =>
                    a.id === account.id
                        ? { ...a, change_password_request: false }
                        : a
                )
            );
            toast.success("Đã reset mật khẩu cho nhân viên");
        } catch (error) {
            toast.error("Reset mật khẩu thất bại");
            console.error(error);
        }
    };
    // ================= FILTER =================
    const filteredAccounts = accounts.filter((a) => {
        const keyword = search.toLowerCase().trim();

        const matchSearch = keyword || a.name?.toLowerCase().includes(keyword) || a.username?.toLowerCase().includes(keyword);

        const matchStatus = filterStatus === "all" || (filterStatus === "active" && a.is_active) || (filterStatus === "locked" && !a.is_active);
        const matchRole = filterRole === "all" || a.role === filterRole;
        return matchSearch && matchStatus && matchRole;
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
                    <UserCog /> QUẢN LÝ TÀI KHOẢN
                </h1>

                <form autoComplete="off">
                    <div style={Styles.actions}>
                        <input
                            placeholder="Tìm theo tên, tên đăng nhập..."
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
                            <option value="active">Còn hoạt động</option>
                            <option value="locked">Ngưng hoạt động</option>
                        </select>

                        <select
                            style={stylesForm.filterSelect}
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="all">Tất cả chức vụ</option>
                            <option value="ADMIN">Quản trị viên</option>
                            <option value="EMPLOYEE">Nhân viên</option>
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

            {/* TABLE */}
            <AccountTable
                loading={loading}
                accounts={filteredAccounts}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                hoverIcon={hoverIcon}
                setHoverIcon={setHoverIcon}
                onToggleLock={handleToggleLock}
                onResetPassword={handleResetPassword}
            />
        </>
    );
};

export default AccountsManagement;