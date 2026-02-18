import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import backgroundImg from "/background.jpg";
import {
  ScanFace,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  UserCheck,
  ShieldCheck ,
} from "lucide-react";

/* ================= STYLE ================= */
const styles = {
  page: {
    height: "100vh"
  },

  header: {
    height: 60,
    background: "linear-gradient(rgb(2, 6, 23) 0%, rgb(2, 6, 23) 100%)",
    borderBottom: "1px solid rgba(12,161,161,0.35)",
    backdropFilter: "blur(12px)",
    color: "#00ffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 32px",
  },

   adminBtn: {
    position: "fixed",
    top: 10,
    right: 5,

    display: "flex",
    alignItems: "center",
    gap: 8,

    padding: "10px 16px",
    fontSize: 15,
    fontWeight: 600,

    color: "#00ffcc",
    background: "rgba(0,255,204,0.12)",
    border: "1px solid rgba(0,255,204,0.6)",
    borderRadius: 999,

    cursor: "pointer",
    backdropFilter: "blur(10px)",
    boxShadow: "0 0 20px rgba(0,255,204,0.35)",

    transition: "all 0.25s ease",
  },

  body: {
    height: "calc(100vh - 60px)",
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
  },

  title: {
    position: "absolute",
    top: 100,
    left: "50%",
    transform: "translateX(-50%)",
    color: "#00ffff",
    fontSize: 30,
    fontWeight: 600,
    letterSpacing: 1.5,
    textShadow: "0 0 12px rgba(0,255,255,0.8)",
    zIndex: 2,
  },

  main: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 70,
    position: "relative",
    zIndex: 1,
  },

  cameraWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  cameraBorder: {
    width: 440,
    height: 440,
    borderRadius: "50%",
    padding: 8,
    background:
      "conic-gradient(#00ffff, #00ff99, #0066ff, #00ffff)",
    boxShadow: "0 0 45px rgba(0,255,255,0.6)",
    position: "relative",
  },

  cameraInner: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    overflow: "hidden",
    background: "#000",
  },

  scanLine: {
    position: "absolute",
    left: "10%",
    right: "10%",
    height: 2,
    background:
      "linear-gradient(90deg, transparent, #00ffff, transparent)",
    boxShadow: "0 0 12px #00ffff",
    animation: "scan 1.2s linear infinite",
  },

  scanBtn: (disabled) => ({
    marginTop: 25,
    padding: "14px 46px",
    fontSize: 16,
    fontWeight: 600,
    borderRadius: 999,
    border: "none",

    cursor: disabled ? "not-allowed" : "pointer",

    background: disabled
      ? "linear-gradient(135deg, #444, #666)"
      : "linear-gradient(135deg, #4facfe, #00f2fe)",

    color: disabled ? "#aaa" : "#ffffff",

    textShadow: disabled
      ? "none"
      : "0 0 6px rgba(255,255,255,0.6)",

    boxShadow: disabled
      ? "none"
      : "0 0 26px rgba(79,172,254,0.65)",

    display: "flex",
    alignItems: "center",
    gap: 10,

    transition: "all 0.3s ease",
  }),

  resultBox: {
    width: 340,
    backdropFilter: "blur(14px)",
    padding: 22,
    borderRadius: 18,
    color: "#fff",
  },

  successBox: {
    background: "rgba(0,255,200,0.12)",
    border: "1px solid rgba(0,255,200,0.6)",
    boxShadow: "0 0 30px rgba(0,255,200,0.35)",
  },

  failedBox: {
    background: "rgba(255,0,0,0.15)",
    border: "1px solid rgba(255,0,0,0.6)",
    boxShadow: "0 0 30px rgba(255,0,0,0.35)",
    textAlign: "center",
  },

  titleSuccess: {
    color: "#00ffcc",
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  titleFail: {
    color: "#ff6b6b",
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
    fontSize: 14,
  },

  capturedImg: {
    width: "100%",
    borderRadius: 14,
    margin: "12px 0",
    border: "2px solid #00ffcc",
  },
};
/* ========================================= */

const Scan = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [checkinTime, setCheckinTime] = useState(null);

  const [userInfo, setUserInfo] = useState({
    name: "",
    status: "",
    message: "",
  });

  /* CLOCK */
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* AI VOICE */
  const speakSuccess = (name, type) => {
    window.speechSynthesis.cancel();

    let text = "Điểm danh thành công.";

    if (type === "CHECK_IN") {
      text = `Xin chào ${name}. Bạn đã check in vào ca làm việc.`;
    }

    if (type === "CHECK_OUT") {
      text = `Tạm biệt ${name}. Bạn đã check out ra ca.`;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "vi-VN";
    utter.rate = 0.95;
    utter.pitch = 1.05;

    window.speechSynthesis.speak(utter);
  };



  /* SCAN */
  const handleScan = async () => {
    if (loading) return;

    setLoading(true);
    setFailed(false);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error("Không lấy được ảnh");

      const res = await fetch("http://localhost:5000/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        const fixedTime = new Date();
        setCheckinTime(fixedTime);

        setUserInfo({
          name: data.name || "",
          status: data.status || "",
          type: data.type || "", // CHECK_IN | CHECK_OUT
          message: data.message || "",
        });

        setCapturedImage(imageSrc);
        setSuccess(true);

        // Đọc giọng AI theo CHECK_IN / CHECK_OUT
        speakSuccess(data.name, data.type);

        setTimeout(() => {
          setSuccess(false);
          setCapturedImage(null);
        }, 4500);
      } else {
        setErrorMsg(data.message || "Không nhận diện được!");
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
    <div style={styles.page}>
      <div style={styles.header}>
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
          style={styles.adminBtn}
          onClick={() => navigate("/admin/login")}
        >
          <ShieldCheck size={18} />
          Admin Login
        </button>
      </div>

      <div style={styles.body}>
        <div style={styles.overlay} />
        <div style={styles.title}>HỆ THỐNG ĐIỂM DANH KHUÔN MẶT</div>

        <div style={styles.main}>
          <div style={styles.cameraWrap}>
            <div style={styles.cameraBorder}>
              <div style={styles.cameraInner}>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 420,
                    height: 420,
                    facingMode: "user",
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {loading && <div style={styles.scanLine} />}
            </div>

            <button
              onClick={handleScan}
              disabled={loading}
              style={styles.scanBtn(loading)}
            >
              <ScanFace size={20} />
              {loading ? "Đang nhận diện..." : "Quét Khuôn Mặt"}
            </button>
          </div>

          {success && (
            <div style={{ ...styles.resultBox, ...styles.successBox }}>
              <h3 style={styles.titleSuccess}>
                <CheckCircle2 /> {userInfo.message}
              </h3>

              {capturedImage && (
                <img src={capturedImage} style={styles.capturedImg} />
              )}

              <p style={styles.row}>
                <User /> <b>{userInfo.name}</b>
              </p>
              <p style={styles.row}>
                <UserCheck /> {userInfo.status}
              </p>
              <p style={styles.row}>
                <Clock />
                {checkinTime &&
                  checkinTime.toLocaleTimeString("vi-VN")}
              </p>
            </div>
          )}

          {failed && (
            <div style={{ ...styles.resultBox, ...styles.failedBox }}>
              <h3 style={styles.titleFail}>
                <XCircle /> Không nhận diện được
              </h3>
              <p>{errorMsg}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 15%; opacity: .3 }
          50% { top: 50%; opacity: 1 }
          100% { top: 85%; opacity: .3 }
        }
      `}</style>
    </div>
  );
};

export default Scan;
