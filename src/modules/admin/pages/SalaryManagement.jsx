import React, { useEffect, useState } from "react";
import { Styles, stylesForm, stylesButton, datePickerStyles} from "../style/Styles";
import { DollarSign, RotateCcw, FileSpreadsheet, FileText } from "lucide-react";
import { getEmployeePayroll, payPayroll } from "../../../services/SalaryService";
import { toast } from "react-toastify";

import SalaryTable from "../components/table/SalaryTable";
import SalaryModal from "../components/modal/SalaryModal";
import { exportSalaryPDF } from "../../../utils/exportSalaryPdf";
import {exportSalaryExcel } from "../../../utils/exportSalaryExcel";

const SalaryManagement = () => {

    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    const [selectedId, setSelectedId] = useState(null);
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7);
    // mặc định tháng hiện tại
    const [monthYear, setMonthYear] = useState(
        new Date().toISOString().slice(0, 7)
    );

    const [hoverIcon, setHoverIcon] = useState({
        id: null,
        type: null
    });

    // ================= OPEN MODAL =================
    const openSalaryDetail = (salary) => {
        setSelectedSalary(salary);
        setShowModal(true);
    };

    // ================= RESET FILTER =================
    const handleResetFilter = () => {
        setSearch("");
        setFilterRole("all");
    };

    // ================= FETCH SALARY =================
    const fetchSalary = async (month, year) => {
        try {
            setLoading(true);

            const { data } = await getEmployeePayroll(month, year);

            const payrolls = data || [];

            // bỏ admin
            const filtered = payrolls.filter(
                (u) => u.employee_code !== "admin"
            );

            setSalaries(filtered);
        } catch (err) {
            console.error(err);
            toast.error("Không tải được dữ liệu lương");
        } finally {
            setLoading(false);
        }
    };

    const handleLockSalary = async () => {
        try {

            const unpaid = salaries.filter(s => !s.is_paid);

            if (unpaid.length === 0) {
                toast.info("Tất cả nhân viên đã được thanh toán");
                return;
            }

            await Promise.all(
                unpaid.map((salary) => payPayroll(salary.id))
            );

            toast.success("Chốt lương thành công");

            const [year, month] = monthYear.split("-").map(Number);
            fetchSalary(month, year);

        } catch (err) {
            console.error(err);
            toast.error("Chốt lương thất bại");
        }
    };

    // ================= LOAD DATA =================
    useEffect(() => {

        if (!monthYear) return;

        const [year, month] = monthYear.split("-").map(Number);

        fetchSalary(month, year);

    }, [monthYear]);

    // ================= FILTER =================
    const filteredSalaries = salaries.filter((s) => {

        const keyword = search.toLowerCase().trim();

        const matchSearch =
            !keyword ||
            s.name?.toLowerCase().includes(keyword) ||
            s.employee_code?.toLowerCase().includes(keyword);

        const matchRole =
            filterRole === "all" || s.role === filterRole;

        return matchSearch && matchRole;
    });

    // ================= EXPORT PDF =================
    const handleExportPDF = () => {
        const [year, month] = monthYear.split("-").map(Number);
        exportSalaryPDF(month, year);
    };

    // ================= EXPORT EXCEL =================
    const handleExportExcel = () => {
        const [year, month] = monthYear.split("-").map(Number);
        exportSalaryExcel(month, year);
    };

    const dayOfMonth = today.getDate();

    // đầu tháng (1 → 5)
    const isBeginningOfMonth = dayOfMonth <= 5;

    // tháng trước
    const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const lockMonth = previousMonthDate.getMonth() + 1;
    const lockYear = previousMonthDate.getFullYear();

    const lockMonthYear = `${lockYear}-${String(lockMonth).padStart(2, "0")}`;

    // kiểm tra đã chốt chưa
    const isLocked = salaries.length > 0 && salaries.every(s => s.is_paid);

    // hiển thị nút
    const showLockButton = isBeginningOfMonth && !isLocked;
    return (
        <>
        
            {/* HEADER */}
            <style>{datePickerStyles}</style>
            <div style={Styles.header}>

                <h1
                    style={{
                        ...Styles.title,
                        display: "flex",
                        alignItems: "center",
                        gap: 10
                    }}
                >
                    <DollarSign /> QUẢN LÝ LƯƠNG NHÂN VIÊN
                </h1>

                <div style={Styles.actions}>

                    {/* SEARCH */}
                    <form autoComplete="off">
                        <input
                            placeholder="Tìm theo tên hoặc mã nhân viên..."
                            style={stylesForm.searchInput}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>

                    {/* MONTH FILTER */}
                    <input
                        type="month"
                        style={stylesForm.filterSelect}
                        value={monthYear}
                        onChange={(e) => setMonthYear(e.target.value)}
                        className={"custom-date-input"}
                        max={currentMonth}
                    />

                    {/* RESET */}
                    <button
                        type="button"
                        style={stylesButton.btnReset}
                        onClick={handleResetFilter}
                    >
                        <RotateCcw size={16} />
                    </button>

                    <div style={Styles.rightActions}>
                        {/* EXPORT PDF */}
                        {showLockButton && 
                            <button 
                                style={stylesButton.btnAdd}
                                onClick={handleLockSalary}
                            >
                                <DollarSign size={18} />
                                Chốt Lương ({lockMonthYear})
                            </button>
                        }
                        {/* EXPORT PDF */}
                        <button
                            style={stylesButton.btnPdf}
                            onClick={handleExportPDF}
                        >
                            <FileText size={18}/> Xuất bảng lương PDF
                        </button>

                        {/* EXPORT EXCEL */}
                        <button 
                            style={stylesButton.btnExcel}
                            onClick={handleExportExcel}
                        >
                            <FileSpreadsheet size={18} />
                            Xuất Excel
                        </button>

                    </div>
                </div>
            </div>

            {/* TABLE */}
            <SalaryTable
                loading={loading}
                salaries={filteredSalaries}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                hoverIcon={hoverIcon}
                setHoverIcon={setHoverIcon}
                onViewSalary={openSalaryDetail}
            />

            {/* MODAL */}
            <SalaryModal
                show={showModal}
                salary={selectedSalary}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};

export default SalaryManagement;