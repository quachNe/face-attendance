import React, { useEffect, useState } from "react";
import { styleModel, stylesButton, stylesError, datePickerStyles} from "../../style/Styles";
import { Save, X, RotateCcw } from "lucide-react";

const ShiftModal = ({
    show,
    onClose,
    onReset,
    onSave,
    editId,
    form,
    setForm,
    error,
}) => {
    const [animate, setAnimate] = useState(false);
    const [shake, setShake] = useState(false);

    /* ================= ESC CLOSE ================= */
    useEffect(() => {
        const handleEsc = (e) => {
        if (e.key === "Escape" && show) {
            handleClose();
        }
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [show]);

    /* ================= OPEN ANIMATION ================= */
    useEffect(() => {
        if (show) {
        setTimeout(() => setAnimate(true), 10);
        }
    }, [show]);

    /* ================= CLOSE ================= */
    const handleClose = () => {
        setAnimate(false);
        setTimeout(() => {
            onClose();
        }, 250);
    };

    /* ================= SHAKE WHEN ERROR ================= */
    useEffect(() => {
        if (error) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        }
    }, [error]);

    if (!show) return null;

    return (
        <>
            <style>{datePickerStyles}</style>
            <div
                style={styleModel.modalOverlay}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        ...styleModel.modal,
                        width: 450,
                        padding: "30px 24px",
                        transform: animate
                            ? "translateY(0)"
                            : "translateY(-40px)",
                        opacity: animate ? 1 : 0,
                        transition: "all 0.25s ease",
                        animation: shake ? "shake 0.35s" : "none",
                    }}
                >   
                {/* NÚT X */}
                    <button
                        onClick={handleClose}
                        style={styleModel.btnClose }
                    >
                        <X size={20}/>
                    </button>
                    <h2 style={styleModel.modalTitle}>
                        {editId
                            ? "SỬA CA LÀM VIỆC"
                            : "THÊM CA LÀM VIỆC"}
                    </h2>

                    <div style={styleModel.formGridShift}>
                        <div style={styleModel.formGroupShift}>
                            <label style={styleModel.label}>
                                Tên Ca <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="text"
                                style={styleModel.formInput}
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                            />
                        </div>

                        <div style={styleModel.formGroupShift}>
                            <label style={styleModel.label}>
                                Giờ Bắt Đầu <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="time"
                                className="custom-date-input"
                                style={styleModel.formInput}
                                value={form.start_time}
                                onChange={(e) =>
                                    setForm({
                                    ...form,
                                    start_time: e.target.value,
                                })}
                            />
                        </div>

                        <div style={styleModel.formGroupShift}>
                            <label style={styleModel.label}>
                                Giờ Kết Thúc <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="time"
                                className="custom-date-input"
                                style={styleModel.formInput}
                                value={form.end_time}
                                onChange={(e) =>
                                    setForm({
                                    ...form,
                                    end_time: e.target.value,
                                })}
                            />
                        </div>
                    </div>

                    {error && (
                        <p style={stylesError.message}>{error}</p>
                    )}

                    <div style={stylesButton.actions}>
                        <button
                            style={stylesButton.btnCancel}
                            onClick={onReset}
                        >
                            <RotateCcw /> Làm mới
                        </button>

                        <button
                            style={stylesButton.btnSave}
                            onClick={onSave}
                        >
                            <Save /> Lưu
                        </button>
                    </div>

                    <style>
                        {`
                            @keyframes shake {
                            0% { transform: translateX(0); }
                            25% { transform: translateX(-6px); }
                            50% { transform: translateX(6px); }
                            75% { transform: translateX(-4px); }
                            100% { transform: translateX(0); }
                            }
                        `}
                    </style>
                </div>
            </div>
        </>
    );
};
export default ShiftModal;