import React, { useEffect, useRef, useState } from "react";
import { styleModel } from "../../style/Styles";
import { X, Camera, RefreshCw } from "lucide-react";

const CameraModal = ({ show, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [animate, setAnimate] = useState(false);

  /* ========= OPEN CAMERA ========= */

  useEffect(() => {
    if (!show) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setTimeout(() => setAnimate(true), 10);
      } catch (err) {
        alert("Không thể mở camera");
        console.error(err);
      }
    };

    startCamera();

    return stopCamera;
  }, [show]);

  /* ========= STOP CAMERA ========= */

  const stopCamera = () => {
    setAnimate(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  /* ========= CLOSE ========= */

  const handleClose = () => {
    stopCamera();
    setTimeout(onClose, 200);
  };

  /* ========= CAPTURE ========= */

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const img = canvas.toDataURL("image/jpeg", 0.9);

    stopCamera();
    onCapture(img);
  };

  /* ========= RETAKE ========= */

  const handleRetake = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  if (!show) return null;

  return (
    <div style={styleModel.modalOverlay} onClick={handleClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          ...styleModel.modal,
          width: 520,
          textAlign: "center",
          transform: animate ? "scale(1)" : "scale(.9)",
          opacity: animate ? 1 : 0,
          transition: "all .2s",
        }}
      >
        {/* CLOSE */}
        <button style={styles.closeBtn} onClick={handleClose}>
          <X size={20} />
        </button>

        <h2 style={styleModel.modalTitle}>Chụp khuôn mặt</h2>

        {/* VIDEO */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={styles.video}
        />

        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* ACTIONS */}
        <div style={styles.actions}>
          <button style={styles.retakeBtn} onClick={handleRetake}>
            <RefreshCw size={18} /> Làm lại
          </button>

          <button style={styles.captureBtn} onClick={handleCapture}>
            <Camera size={18} /> Chụp ảnh
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;

/* ================= STYLES ================= */

const styles = {
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },

  video: {
    width: "100%",
    borderRadius: 12,
    background: "#000",
    marginBottom: 16,
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
  },

  captureBtn: {
    padding: "12px 18px",
    background: "#0ea5e9",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },

  retakeBtn: {
    padding: "12px 18px",
    background: "#334155",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    cursor: "pointer",
  },
};