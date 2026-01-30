import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import backgroundImg from "/background.jpg";

const Scan = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  // ⏱ cập nhật thời gian
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const videoConstraints = {
    width: 420,
    height: 420,
    facingMode: "user",
  };

  // 👉 QUÉT KHUÔN MẶT
  const handleScan = () => {
    if (loading || success) return;

    setLoading(true);

    // Giả lập thời gian AI xử lý
    setTimeout(() => {
      const imageSrc = webcamRef.current.getScreenshot();

      setCapturedImage(imageSrc);
      setSuccess(true);
      setLoading(false);

      // SAU KHI ĐIỂM DANH XONG → RESET
      setTimeout(() => {
        setSuccess(false);
        setCapturedImage(null);
      }, 4000); // hiển thị kết quả 4 giây

    }, 1500);
  };

  return (
    <div style={{ height: "100vh", fontFamily: "Segoe UI, sans-serif" }}>
      {/* HEADER */}
      <div
        style={{
          height: 60,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(10px)",
          color: "#00ffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 32px",
        }}
      >
        <div>
          {time.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}{" "}
          | {time.toLocaleTimeString()}
        </div>

        <button
          onClick={() => navigate("/login")}
          style={{
            background: "transparent",
            border: "1px solid #00ffff",
            color: "#00ffff",
            padding: "6px 18px",
            borderRadius: 20,
            cursor: "pointer",
          }}
        >
          Admin Login
        </button>
      </div>

      {/* BODY */}
      <div
        style={{
          height: "calc(100vh - 60px)",
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 70,
        }}
      >
        {/* OVERLAY */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
          }}
        />

        {/* KHU VỰC QUÉT */}
        <div style={{ zIndex: 1, textAlign: "center" }}>
          <h2 style={{ color: "#00ffff", marginBottom: 16 }}>
            Hệ Thống Điểm Danh Bằng Nhận Diện Khuôn Mặt
          </h2>

          <div
            style={{
              width: 440,
              height: 440,
              borderRadius: "50%",
              padding: 6,
              background:
                "linear-gradient(135deg, #00ffff, #00ff99, #0066ff)",
              boxShadow: "0 0 45px rgba(0,255,255,0.6)",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                background: "#000",
              }}
            >
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Scan line */}
            {loading && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "#00ffff",
                  boxShadow: "0 0 10px #00ffff",
                  animation: "scan 1.2s linear infinite",
                }}
              />
            )}
          </div>

          <button
            onClick={handleScan}
            disabled={loading || success}
            style={{
              marginTop: 24,
              padding: "14px 40px",
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 30,
              border: "none",
              cursor: loading || success ? "not-allowed" : "pointer",
              background:
                loading || success
                  ? "#555"
                  : "linear-gradient(135deg, #00ffff, #00ff99)",
              color: "#000",
              boxShadow: "0 0 20px rgba(0,255,255,0.6)",
            }}
          >
            {loading
              ? "Đang nhận diện..."
              : success
              ? "Đã Điểm Danh"
              : "Quét Khuôn Mặt"}
          </button>
        </div>

        {/* THẺ KẾT QUẢ – TỰ BIẾN MẤT */}
        {success && (
          <div
            style={{
              zIndex: 1,
              width: 300,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(14px)",
              color: "#fff",
              padding: 22,
              borderRadius: 18,
              border: "1px solid rgba(0,255,255,0.6)",
              boxShadow: "0 0 30px rgba(0,255,255,0.35)",
            }}
          >
            <h3 style={{ color: "#00ffcc", marginBottom: 12 }}>
              Điểm Danh Thành Công
            </h3>

            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured Face"
                style={{
                  width: "100%",
                  borderRadius: 12,
                  marginBottom: 12,
                  border: "2px solid #00ffcc",
                }}
              />
            )}

            <p><b>Nguyễn Văn A</b></p>
            <p>Phòng ban: IT</p>
            <p>Thời gian: {time.toLocaleTimeString()}</p>
          </div>
        )}
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes scan {
            0% { top: 10%; }
            50% { top: 50%; }
            100% { top: 90%; }
          }
        `}
      </style>
    </div>
  );
};

export default Scan;
