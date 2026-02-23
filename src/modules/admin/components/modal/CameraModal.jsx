import React, { useEffect, useRef, useState } from "react";
import { X, Camera } from "lucide-react";
import {
  analyzeFaceSetup,
  finishFaceSetup,
} from "../../../../services/EmployeeService";

const OUTPUT_SIZE = 512;

const CameraModal = ({ show, onClose, userId }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const embeddingsRef = useRef([]);

  const [step, setStep] = useState("center");
  const [loading, setLoading] = useState(false);

  const guides = {
    center: "Nhìn thẳng",
    left: "Quay sang TRÁI",
    right: "Quay sang PHẢI",
  };

  const stepIndex = { center: 1, left: 2, right: 3 };

  /* ================= RESET ================= */

  const resetAll = () => {
    embeddingsRef.current = [];
    setStep("center");
    setLoading(false);

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  /* ================= STOP CAMERA ================= */

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  /* ================= OPEN CAMERA ================= */

  useEffect(() => {
    if (!show) return;

    resetAll();

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        await new Promise((r) => {
          videoRef.current.onloadedmetadata = r;
        });

        await videoRef.current.play();
      } catch {
        alert("Không truy cập được camera");
        onClose();
      }
    };

    start();

    return () => {
      stopCamera();
      resetAll();
    };
  }, [show]);

  const handleClose = () => {
    stopCamera();
    resetAll();
    onClose();
  };

  /* ================= CAPTURE ================= */

  const captureImage = async () => {
    if (loading) return;

    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    // ⭐ CROP CHÍNH GIỮA VIDEO THẬT (QUAN TRỌNG NHẤT)
    const size = Math.min(vw, vh) * 0.8;

    const sx = (vw - size) / 2;
    const sy = (vh - size) / 2;

    ctx.drawImage(video, sx, sy, size, size, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    const img = canvas.toDataURL("image/jpeg", 0.95);

    try {
      setLoading(true);

      let data;

      try {
        const res = await analyzeFaceSetup({
          image: img,
          current_step: step,
        });

        data = res.data;
      } catch (err) {
        if (err.response?.data) data = err.response.data;
        else throw err;
      }

      /* ===== FAIL ===== */

      if (!data.success) {
        alert(data.message || "Hãy quay đúng hướng theo hướng dẫn");
        return;
      }

      /* ===== OK ===== */

      embeddingsRef.current.push(data.embedding);

      if (step === "center") return setStep("left");
      if (step === "left") return setStep("right");

      /* ===== FINISH ===== */

      stopCamera();

      const finishRes = await finishFaceSetup({
        user_id: userId,
        embeddings: embeddingsRef.current,
      });

      alert(
        finishRes.data.success
          ? "Đăng ký khuôn mặt thành công ✔"
          : finishRes.data.message || "Đăng ký thất bại"
      );

      onClose();

    } catch (err) {
      console.error(err);
      alert("Lỗi hệ thống hoặc mất kết nối ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.close} onClick={handleClose}>
          <X size={22} />
        </button>

        <h2>
          Bước {stepIndex[step]}/3 — {guides[step]}
        </h2>

        <div style={styles.videoWrap}>
          {/* Mirror chỉ để người dùng nhìn */}
          <video ref={videoRef} autoPlay playsInline style={styles.video} />
          <div style={styles.mask} />
          <div style={styles.frame} />
        </div>

        <button
          style={styles.captureBtn}
          onClick={captureImage}
          disabled={loading}
        >
          <Camera size={20} />
          {loading ? " Đang xử lý..." : " Chụp"}
        </button>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default CameraModal;

/* ================= STYLES ================= */

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  modal: {
    width: 520,
    background: "#0f172a",
    borderRadius: 20,
    padding: 24,
    color: "#fff",
    textAlign: "center",
    position: "relative",
  },

  close: {
    position: "absolute",
    top: 12,
    right: 12,
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },

  videoWrap: {
    position: "relative",
    aspectRatio: "4/3",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scaleX(-1)", // mirror UI ONLY
  },

  mask: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at center, transparent 150px, rgba(0,0,0,.75) 170px)",
  },

  frame: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 300,
    height: 300,
    borderRadius: "50%",
    border: "3px solid #22c55e",
    transform: "translate(-50%, -50%)",
  },

  captureBtn: {
    marginTop: 12,
    padding: "12px 24px",
    borderRadius: 12,
    border: "none",
    background: "#22c55e",
    color: "#000",
    fontWeight: 700,
    cursor: "pointer",
  },
};