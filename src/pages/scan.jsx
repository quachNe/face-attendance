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
  const [failed, setFailed] = useState(false);

  const [capturedImage, setCapturedImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [userInfo, setUserInfo] = useState({
    name: "",
    status: "",
    message: "",
  });

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

  // ================= QUÉT & GỌI API =================
  const handleScan = async () => {
    if (loading || success || failed) return;

    setLoading(true);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error("Không lấy được ảnh webcam");

      const res = await fetch("http://localhost:5000/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc }),
      });

      const data = await res.json();
      setLoading(false);

      // ===== NHẬN DIỆN THÀNH CÔNG =====
      if (data.success) {
        setUserInfo({
          name: data.name || "",
          status: data.status || "",
          message: data.message || "Điểm danh thành công!",
        });
        setCapturedImage(imageSrc);
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
          setCapturedImage(null);
        }, 4000);
      }
      // ===== KHÔNG NHẬN DIỆN =====
      else {
        setErrorMsg(data.message || "Không nhận diện được khuôn mặt!");
        setFailed(true);

        setTimeout(() => {
          setFailed(false);
          setErrorMsg("");
        }, 4000);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMsg("Lỗi kết nối máy chủ!");
      setFailed(true);

      setTimeout(() => {
        setFailed(false);
        setErrorMsg("");
      }, 4000);
    }
  };

  return (
    <div style={{ height: "100vh", fontFamily: "Segoe UI, sans-serif" }}>
      {/* ================= HEADER ================= */}
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

      {/* ================= BODY ================= */}
      <div
        style={{
          height: "calc(100vh - 60px)",
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
          }}
        />

        {/* ===== TÊN HỆ THỐNG ===== */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 1.5,
            color: "#00ffff",
            textShadow: "0 0 12px rgba(0,255,255,0.8)",
            whiteSpace: "nowrap",
          }}
        >
          HỆ THỐNG ĐIỂM DANH NHẬN DIỆN KHUÔN MẶT
        </div>

        {/* ================= SCAN AREA ================= */}
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 70,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* CAMERA */}
          <div style={{ textAlign: "center" }}>
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
              disabled={loading || success || failed}
              style={{
                marginTop: 24,
                padding: "14px 40px",
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 30,
                border: "none",
                cursor:
                  loading || success || failed ? "not-allowed" : "pointer",
                background:
                  loading || success || failed
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
                : failed
                ? "Không Nhận Diện Được"
                : "Quét Khuôn Mặt"}
            </button>
          </div>

          {/* ===== KẾT QUẢ THÀNH CÔNG ===== */}
          {success && (
            <div
              style={{
                width: 320,
                background: "rgba(0,255,200,0.12)",
                backdropFilter: "blur(14px)",
                color: "#fff",
                padding: 22,
                borderRadius: 18,
                border: "1px solid rgba(0,255,200,0.6)",
                boxShadow: "0 0 30px rgba(0,255,200,0.35)",
              }}
            >
              <h3 style={{ color: "#00ffcc" }}>
                ✅ {userInfo.message}
              </h3>

              {capturedImage && (
                <img
                  src={capturedImage}
                  alt="Captured"
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    margin: "12px 0",
                    border: "2px solid #00ffcc",
                  }}
                />
              )}

              <p><b>{userInfo.name}</b></p>
              <p>Trạng thái: {userInfo.status}</p>
              <p>Thời gian: {time.toLocaleTimeString()}</p>
            </div>
          )}

          {/* ===== KHÔNG NHẬN DIỆN ===== */}
          {failed && (
            <div
              style={{
                width: 320,
                background: "rgba(255,0,0,0.15)",
                backdropFilter: "blur(14px)",
                color: "#fff",
                padding: 24,
                borderRadius: 18,
                border: "1px solid rgba(255,0,0,0.6)",
                boxShadow: "0 0 30px rgba(255,0,0,0.35)",
                textAlign: "center",
              }}
            >
              <h3 style={{ color: "#ff6b6b", marginBottom: 12 }}>
                ❌ Không Nhận Diện Được
              </h3>
              <p>{errorMsg}</p>
              <p>
                Vui lòng liên hệ <b>Admin</b> để được hỗ trợ.
              </p>
            </div>
          )}
        </div>
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
