import React, { useEffect, useState } from "react";
import { Styles, stylesForm, stylesButton } from "../style/Styles";
import { DollarSign, RotateCcw, FileSpreadsheet, Calculator, FileText} from "lucide-react";
import { getEmployeePayroll } from "../../../services/SalaryService";
import { toast } from "react-toastify";
import SalaryTable from "../components/table/SalaryTable";
import SalaryModal from "../components/modal/SalaryModal";

const SalaryManagement = () => {
    const [salaries, setSalaries] = useState([]);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);

    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [monthYear, setMonthYear] = useState(
        new Date().toISOString().slice(0, 7)
    );

    const [hoverIcon, setHoverIcon] = useState({
        id: null,
        type: null,
    });

    const openSalaryDetail = (salary) => {
        setSelectedSalary(salary);
        setShowModal(true);
    };
    // ================= LẤY THÁNG TRƯỚC =================
    const getPreviousMonthYear = () => {
        const now = new Date();

        let m = now.getMonth(); // 0-11
        let y = now.getFullYear();

        if (m === 0) {
            m = 12;
            y -= 1;
        }

        return { month: m, year: y };
    };

    // ================= RESET FILTER =================
    const handleResetFilter = () => {
        setSearch("");
        setFilterRole("all");
    };

    // ================= FETCH SALARY =================
    const fetchSalary = async (m, y) => {
        try {
            setLoading(true);

            const { data } = await getEmployeePayroll(m, y);

            console.log("API:", data);

            const payrolls = data || [];

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

    // ================= INIT =================
    useEffect(() => {
        fetchSalary(3, 2026);
    }, []);

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
                    <DollarSign /> QUẢN LÝ LƯƠNG NHÂN VIÊN
                </h1>
                <div style={Styles.actions}>
                    <form autoComplete="off">
                        <input
                            placeholder="Tìm theo tên hoặc mã nhân viên..."
                            style={stylesForm.searchInput}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                    <input
                        type="month"
                        style={{ ...stylesForm.filterSelect}}
                        value={monthYear}
                        onChange={(e) => setMonthYear(e.target.value)}
                        className={"custom-date-input"} 
                    />

                    <button
                        type="button"
                        style={stylesButton.btnReset}
                        onClick={handleResetFilter}
                    >
                        <RotateCcw size={16} />
                    </button>
                    
                    <div style={Styles.rightActions}>
                        {/* Tính lương */}
                        <button
                            type="button"
                            style={stylesButton.btnAdd}
                        >
                            <Calculator size={18} /> Tính lương
                        </button>

                        <button
                            style={stylesButton.btnPdf}
                            // onClick={exportPDF}
                        >
                            <FileText size={18}/> Xuất PDF
                        </button>

                        {/* Xuất Excel */}
                        <button
                            style={stylesButton.btnExcel}
                        >
                            <FileSpreadsheet  size={18}/> Xuất Excel
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

            <SalaryModal
                show={showModal}
                salary={selectedSalary}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};

export default SalaryManagement;