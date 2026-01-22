import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";

const Scan = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());
  const [success, setSuccess] = useState(false);

  // ⏱ cập nhật thời gian mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user",
  };

  const handleScan = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log("Face image:", imageSrc);

    // DEMO: giả lập nhận diện thành công
    setSuccess(true);
  };

  return (
    <div style={{ height: "100vh", background: "#000" }}>
      {/* HEADER */}
      <div
        style={{
          height: 60,
          background: "#111",
          color: "#0ff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
          fontSize: 16,
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

        <button onClick={() => navigate("/login")}>Admin Login</button>
      </div>

      {/* BODY */}
      <div
        style={{
          height: "calc(100vh - 60px)",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518770660439-4636190af475')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {/* KHUNG QUÉT */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 400,
              height: 400,
              border: "4px solid #00ffff",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <button
            onClick={handleScan}
            style={{ marginTop: 16, padding: "8px 20px" }}
          >
            Quét khuôn mặt
          </button>
        </div>

        {/* THẺ THÔNG TIN */}
        {success && (
          <div
            style={{
              width: 260,
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              padding: 16,
              borderRadius: 12,
              border: "1px solid #00ffcc",
            }}
          >
            <h3 style={{ color: "#00ffcc" }}>✔ SUCCESS</h3>

            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="avatar"
              style={{
                width: "100%",
                borderRadius: 8,
                marginBottom: 8,
              }}
            />

            <p><b>Nguyễn Văn A</b></p>
            <p>Phòng: IT</p>
            <p>Check-in: {time.toLocaleTimeString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scan;
