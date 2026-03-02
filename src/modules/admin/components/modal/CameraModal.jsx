import React, { useEffect, useRef, useState } from "react";
import { X, Camera } from "lucide-react";
import {
  analyzeFaceSetup,
  finishFaceSetup,
} from "../../../../services/EmployeeService";
import { toast } from "react-toastify";
import { styleModel } from "../../style/Styles";

const OUTPUT_SIZE = 512;

const CameraModal = ({ show, onClose, userId, onSuccess  }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const embeddingsRef = useRef([]);

  const [step, setStep] = useState("center");
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const guides = {
    center: "Nhìn thẳng vào camera",
    left: "Quay sang TRÁI",
    right: "Quay sang PHẢI",
  };

  const stepIndex = { center: 1, left: 2, right: 3 };

  /* ================= ESC CLOSE ================= */

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && show && handleClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [show]);

  /* ================= ANIMATE ================= */

  useEffect(() => {
    if (show) {
      setTimeout(() => setAnimate(true), 10);
    }
  }, [show]);

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
        handleClose();
      }
    };

    start();

    return () => {
      stopCamera();
      resetAll();
    };
  }, [show]);

  const handleClose = () => {
    setAnimate(false);
    stopCamera();
    resetAll();
    setTimeout(onClose, 250);
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

      if (!data.success) {
        alert(data.message || "Hãy quay đúng hướng theo hướng dẫn");
        return;
      }

      embeddingsRef.current.push(data.embedding);

      if (step === "center") return setStep("left");
      if (step === "left") return setStep("right");

      stopCamera();

      const finishRes = await finishFaceSetup({
        user_id: userId,
        embeddings: embeddingsRef.current,
      });

      toast.success(
        finishRes.data.success
          ? "Đăng ký khuôn mặt thành công"
          : finishRes.data.message || "Đăng ký thất bại"
      );
      if (finishRes.data.success) {
        onSuccess && onSuccess();
      }
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Lỗi hệ thống hoặc mất kết nối");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div style={styleModel.modalOverlay}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          ...styleModel.modal,
          ...styles.modal,
          transform: animate ? "translateY(0)" : "translateY(-40px)",
          opacity: animate ? 1 : 0,
          transition: "all .25s",
        }}
      >
        <button style={styleModel.btnClose} onClick={handleClose}>
          <X size={18} />
        </button>

        <h2 style={styleModel.modalTitle}>Đăng Ký Khuôn Mặt</h2>

        <div style={styles.stepText}>
          Bước {stepIndex[step]}/3
        </div>

        <div style={styles.guide}>
          {guides[step]}
        </div>

        <div style={styles.circleWrapper}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={styles.circleVideo}
          />
        </div>

        <button
          style={styles.captureBtn}
          onClick={captureImage}
          disabled={loading}
        >
          <Camera size={18} />
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
  modal: {
    width: 420,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    textAlign: "center",
  },

  stepText: {
    fontSize: 16,
    color: "#22c55e",
    fontWeight: 600,
    marginBottom: 6,
  },

  guide: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 22,
  },

  circleWrapper: {
    width: 280,
    height: 280,
    borderRadius: "50%",
    overflow: "hidden",
    background: "#000",
    border: "3px solid #22c55e",
    boxShadow: "0 0 25px rgba(34,197,94,.35)",
    marginBottom: 26,
  },

  circleVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scaleX(-1)",
  },

  captureBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: "12px 30px",
    borderRadius: 30,
    border: "none",
    background: "#22c55e",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    minWidth: 170,
  },
};