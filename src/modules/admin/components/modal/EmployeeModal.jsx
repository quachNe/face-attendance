import React, { useEffect, useRef, useState } from "react";
import {
    DEFAULT_FACE,
    stylesButton,
    stylesError,
    styleModel,
    datePickerStyles
} from "../../style/Styles";
import { Camera, Save, X } from "lucide-react";

const captureSteps = [
    "Nhìn thẳng vào camera",
    "Quay mặt sang TRÁI",
    "Quay mặt sang PHẢI",
];

const EmployeeModal = ({
    show,
    onClose,
    onSave,
    form,
    setForm,
    editId,
    shifts,
    error,
    setError,
}) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [showCamModal, setShowCamModal] = useState(false);
    const [camStream, setCamStream] = useState(null);

    const [facePreviews, setFacePreviews] = useState([]);
    const [faceFiles, setFaceFiles] = useState([]);

    const [animate, setAnimate] = useState(false);
    const [animateCam, setAnimateCam] = useState(false);
    const [shake, setShake] = useState(false);

    /* ================= ANIMATION ================= */

    useEffect(() => {
        if (show) setTimeout(() => setAnimate(true), 10);
        else setAnimate(false);
    }, [show]);

    useEffect(() => {
        if (showCamModal) setTimeout(() => setAnimateCam(true), 10);
        else setAnimateCam(false);
    }, [showCamModal]);

    /* ================= ESC ================= */

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                if (showCamModal) closeCameraModal();
                else if (show) handleClose();
            }
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [show, showCamModal]);

    /* ================= CAMERA ================= */

    const openCameraModal = async () => {
        try {
            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" },
                });

            setCamStream(stream);
            setShowCamModal(true);

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);
        } catch {
            alert("Không thể mở webcam");
        }
    };

    const closeCameraModal = () => {
        setAnimateCam(false);
        setTimeout(() => {
            if (camStream) {
                camStream.getTracks().forEach((t) =>
                t.stop()
                );
            }
            setCamStream(null);
            setShowCamModal(false);
        }, 250);
    };

    const captureFromCamera = () => {
        if (faceFiles.length >= 3) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            if (!blob) return;
            const file = new File( [blob], `face_${faceFiles.length}.jpg`, { type: "image/jpeg" });

            const previewUrl = URL.createObjectURL(blob);

            const newFiles = [...faceFiles, file];
            const newPreviews = [
                ...facePreviews,
                previewUrl,
            ];

            setFaceFiles(newFiles);
            setFacePreviews(newPreviews);

            setForm((prev) => ({
                ...prev,
                face_files: newFiles,
                face_image: newFiles.length === 3,
            }));

            if (newFiles.length === 3) {
                setTimeout(closeCameraModal, 600);
            }
        }, "image/jpeg");
    };

    const handleClose = () => {
        setAnimate(false);
        setTimeout(() => {
            onClose();
            setError("");
        }, 250);
    };

    if (!show) return null;

    return (
        <>  
            <style>{datePickerStyles}</style>
            <div
                style={styleModel.modalOverlay}
                onClick={handleClose}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        ...styleModel.modal,
                        width: 520,
                        transform: animate
                        ? "translateY(0)"
                        : "translateY(-40px)",
                        opacity: animate ? 1 : 0,
                        transition: "all 0.25s ease",
                        animation: shake
                        ? "shake 0.35s"
                        : "none",
                    }}
                >
                    <h2 style={styleModel.modalTitle}>
                        {editId ? "SỬA NHÂN VIÊN" : "THÊM NHÂN VIÊN"}
                    </h2>

                    {/* 3 FACE PREVIEW */}
                    <div style={styleModel.faceBox}>
                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                justifyContent: "center",
                            }}
                        >
                            {[0, 1, 2].map((i) => (
                                <div key={i}>
                                    <img
                                        src={
                                            facePreviews[i] ||
                                            DEFAULT_FACE
                                        }
                                        alt=""
                                        style={{
                                            width: 90,
                                            height: 90,
                                            borderRadius: 12,
                                            objectFit: "cover",
                                            border: facePreviews[i] ? "2px solid #0ca1a1" : "1px dashed #ccc",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={openCameraModal}
                            style={{
                                ...stylesButton.uploadBtn,
                                marginTop: 12,
                            }}
                        >
                            <Camera size={18} /> Chụp ảnh
                        </button>
                    </div>

                    {/* FORM giữ nguyên */}
                    <div style={styleModel.formGrid}>
                        {[["Họ tên", "name"], ["Ngày sinh", "dob", "date"], ["Email", "email", "email"],["SĐT", "phone", "tel"],].map(([label, key, type]) => (
                            <div
                                key={key}
                                style={
                                    styleModel.formGroup
                                }
                            >
                                <label
                                    style={styleModel.label}
                                >
                                    {label} <span style={{color:"red"}}>*</span>
                                </label>
                                <input
                                    type={type || "text"}
                                    value={
                                        form[key] || ""
                                    }
                                    className={type === "date" ? "custom-date-input" : ""}
                                    style={
                                        styleModel.formInput
                                    }
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            [key]:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>
                        ))}

                        <div
                        style={
                            styleModel.formGroup
                        }
                        >
                        <label
                            style={styleModel.label}
                        >
                            Vai trò <span style={{color:"red"}}>*</span>
                        </label>
                        <select
                            style={
                            styleModel.formInput
                            }
                            value={form.role}
                            onChange={(e) =>
                            setForm({
                                ...form,
                                role:
                                e.target.value,
                            })
                            }
                        >
                            <option value="employee">
                                Nhân Viên
                            </option>
                            <option value="admin">
                                Quản Trị Viên
                            </option>
                        </select>
                        </div>

                        <div
                        style={
                            styleModel.formGroup
                        }
                        >
                        <label
                            style={styleModel.label}
                        >
                            Ca làm việc <span style={{color:"red"}}>*</span>
                        </label>
                        <select
                            style={styleModel.formInput}
                            value={form.shift_id || ""}
                            onChange={(e) =>
                                setForm({
                                ...form,
                                shift_id: Number(e.target.value),
                                })
                            }
                            >
                            <option value="">-- Chọn ca làm việc --</option>

                            {shifts.map((s) => (
                                <option key={s.id} value={s.id}>
                                {s.name}
                                </option>
                            ))}
                            </select>

                        </div>
                    </div>

                    {error && (
                        <p
                            style={
                                stylesError.message
                            }
                        >
                            {error}
                        </p>
                    )}

                    <div
                        style={
                            stylesButton.actions
                        }
                    >
                        <button
                            style={
                                stylesButton.btnCancel
                            }
                            onClick={
                                handleClose
                            }
                        >
                            <X /> Hủy
                        </button>

                        <button
                            style={
                                stylesButton.btnSave
                            }
                            onClick={() => {
                                // if (
                                //     faceFiles.length !== 3
                                // ) {
                                //     setError("Vui lòng chụp đủ 3 ảnh");
                                //     setShake(true);
                                //     setTimeout( () =>
                                //         setShake(
                                //             false
                                //         ),
                                //         400
                                //     );
                                //     return;
                                // }
                                onSave();
                            }}
                        >
                            <Save /> Lưu
                        </button>
                    </div>
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

            {showCamModal && (
                <div
                    style={
                        styleModel.modalOverlay
                    }
                    onClick={
                        closeCameraModal
                    }
                >
                    <div
                        onClick={(e) =>e.stopPropagation()}
                        style={{
                            ...styleModel.modal,
                            width: 380,
                            transform: animateCam ? "translateY(0)" : "translateY(-40px)",
                            opacity: animateCam ? 1 : 0,
                            transition: "all 0.25s ease",
                        }}
                    >
                        <h3
                            style={{
                                textAlign:
                                "center",
                            }}
                        >
                            {
                                captureSteps[faceFiles.length]
                            }
                        </h3>

                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            style={{
                                width: "100%",
                                borderRadius: 12,
                            }}
                        />

                        <div
                            style={{
                                marginTop: 12,
                                textAlign:
                                "center",
                            }}
                        >
                            {faceFiles.length}/3 ảnh
                        </div>

                        <div
                            style={{
                                marginTop: 12,
                                display: "flex",
                                justifyContent:
                                "center",
                                gap: 12,
                            }}
                        >
                            <button
                                onClick={
                                closeCameraModal
                                }
                                style={
                                stylesButton.btnCancel
                                }
                            >
                                <X /> Hủy
                            </button>

                            <button
                                onClick={
                                captureFromCamera
                                }
                                style={
                                stylesButton.btnSave
                                }
                            >
                                <Camera /> Chụp
                            </button>
                        </div>

                        <canvas
                            ref={canvasRef}
                            hidden
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default EmployeeModal;