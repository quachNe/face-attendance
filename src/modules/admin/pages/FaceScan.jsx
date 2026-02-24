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
  ShieldCheck,
} from "lucide-react";
import { checkInFace } from "../../../services/AttendanceService";

/* ================= STYLE ================= */
const styles = {
  page: {
    height: "100vh",
    fontFamily: "Inter, sans-serif",
    background: "#020617",
    overflow: "hidden",
  },

  header: {
    height: 64,
    background: "rgba(2,6,23,0.75)",
    borderBottom: "1px solid rgba(0,255,255,0.25)",
    backdropFilter: "blur(18px)",
    color: "#00ffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 36px",
    fontSize: 15,
    letterSpacing: 0.5,
  },

  adminBtn: {
    position: "fixed",
    top: 12,
    right: 12,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 18px",
    fontWeight: 600,
    color: "#00ffe1",
    background: "rgba(0,255,225,0.1)",
    border: "1px solid rgba(0,255,225,0.5)",
    borderRadius: 999,
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    boxShadow: "0 0 16px rgba(0,255,225,0.45)",
    transition: "0.25s",
  },

  body: {
    height: "calc(100vh - 64px)",
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at center, rgba(0,0,0,0.4), rgba(0,0,0,0.9))",
  },

  title: {
    position: "absolute",
    top: 90,
    left: "50%",
    transform: "translateX(-50%)",
    color: "#00ffff",
    fontSize: 34,
    fontWeight: 700,
    textShadow: "0 0 18px rgba(0,255,255,0.8)",
    zIndex: 2,
    letterSpacing: 1,
  },

  main: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 80,
    position: "relative",
    zIndex: 1,
  },

  cameraWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  cameraBorder: {
    width: 460,
    height: 460,
    borderRadius: "50%",
    padding: 10,
    background:
      "conic-gradient(#00ffff, #00ff99, #00bfff, #00ffff)",
    boxShadow:
      "0 0 60px rgba(0,255,255,0.7), inset 0 0 40px rgba(0,255,255,0.25)",
    position: "relative",
  },

  cameraInner: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    overflow: "hidden",
    background: "#000",
  },

  scanBtn: (disabled) => ({
    marginTop: 28,
    padding: "16px 54px",
    fontSize: 17,
    fontWeight: 700,
    borderRadius: 999,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled
      ? "#444"
      : "linear-gradient(135deg,#00c6ff,#0072ff)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: disabled
      ? "none"
      : "0 0 25px rgba(0,150,255,0.8)",
    transition: "0.25s",
  }),

  /* ===== RESULT CARD ===== */

  resultBox: {
    width: 360,
    padding: 26,
    borderRadius: 22,
    backdropFilter: "blur(18px)",
    background: "rgba(15,23,42,0.75)",
    boxShadow: "0 0 40px rgba(0,0,0,0.6)",
    color: "#fff",
  },

  successBox: {
    border: "1px solid rgba(0,255,200,0.6)",
    boxShadow: "0 0 35px rgba(0,255,200,0.45)",
  },

  failedBox: {
    border: "1px solid rgba(255,70,70,0.6)",
    boxShadow: "0 0 35px rgba(255,70,70,0.45)",
    textAlign: "center",
  },

  titleSuccess: {
    color: "#00ffd0",
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 22,
    fontWeight: 700,
  },

  titleFail: {
    color: "#ff6b6b",
    display: "flex",
    justifyContent: "center",
    gap: 12,
    fontSize: 22,
    fontWeight: 700,
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    fontSize: 16,
    opacity: 0.95,
  },

  capturedImg: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
    margin: "16px auto",
    display: "block",
    border: "3px solid #00ffcc",
    boxShadow: "0 0 25px rgba(0,255,200,0.8)",
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

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* =========================================================
     🔊 GIỌNG ĐỌC CHẬM — RÕ — CHUẨN KIOSK
  ========================================================= */
  const speakSuccess = (name, type) => {
    window.speechSynthesis.cancel();

    let text = "Điểm danh thành công.";

    if (type === "CHECK_IN") {
      text = `Xin chào ${name}. Bạn đã chấm công vào thành công. Chúc bạn một ngày làm việc hiệu quả.`;
    }

    if (type === "CHECK_OUT") {
      text = `Tạm biệt ${name}. Bạn đã chấm công ra về thành công. Hẹn gặp lại bạn.`;
    }

    const utter = new SpeechSynthesisUtterance(text);

    // 🔥 TỐI ƯU GIỌNG
    utter.lang = "vi-VN";
    utter.rate = 0.85;     // 👉 nói chậm
    utter.pitch = 1;       // cao độ tự nhiên
    utter.volume = 1;

    // 🔥 CHỌN GIỌNG VIỆT TỐT NHẤT
    const voices = speechSynthesis.getVoices();

    const vietnameseVoice =
      voices.find(v => v.lang === "vi-VN") ||
      voices.find(v => v.lang.includes("vi")) ||
      voices[0];

    if (vietnameseVoice) utter.voice = vietnameseVoice;

    speechSynthesis.speak(utter);
  };
  /* ========================================================= */

  const handleScan = async () => {
    if (loading) return;
    setLoading(true);
    setFailed(false);

    try {
      const imageSrc = webcamRef.current.getScreenshot();

      const { data } = await checkInFace(imageSrc);

      setLoading(false);

      if (data.success) {
        setCheckinTime(new Date());
        setUserInfo(data);
        setCapturedImage(imageSrc);
        setSuccess(true);

        speakSuccess(data.name, data.type);

        setTimeout(() => {
          setSuccess(false);
          setCapturedImage(null);
        }, 4500);

      } else {
        let msg =
          data.message ||
          "Không nhận diện được khuôn mặt\n\nVui lòng nhìn thẳng camera.";

        if (msg.toLowerCase().includes("spoof")) {
          msg =
            "Không thể xác thực khuôn mặt\n\nHệ thống phát hiện dấu hiệu giả mạo.\n\nVui lòng đứng trực tiếp trước camera.";
        }

        setErrorMsg(msg);
        setFailed(true);
        setTimeout(() => setFailed(false), 4000);
      }

    } catch (err) {
      setLoading(false);

      // ⭐️ ĐỌC LỖI TỪ SERVER (QUAN TRỌNG)
      if (err.response?.data) {
        let msg =
          err.response.data.message ||
          "Không nhận diện được khuôn mặt";

        if (msg.toLowerCase().includes("spoof")) {
          msg =
            "Không thể xác thực khuôn mặt\n\nHệ thống phát hiện dấu hiệu giả mạo.\n\nVui lòng đứng trực tiếp trước camera.";
        }

        setErrorMsg(msg);
      } else {
        setErrorMsg("Lỗi kết nối máy chủ!");
      }

      setFailed(true);
      setTimeout(() => setFailed(false), 4000);
    }
  };
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          {time.toLocaleDateString("vi-VN")} |{" "}
          {time.toLocaleTimeString()}
        </div>

        <button
          style={styles.adminBtn}
          onClick={() => navigate("/admin/login")}
        >
          <ShieldCheck size={18} />
          Admin Login
        </button>
      </div>

      {/* BODY */}
      <div style={styles.body}>
        <div style={styles.overlay} />
        <div style={styles.title}>
          HỆ THỐNG ĐIỂM DANH KHUÔN MẶT
        </div>

        <div style={styles.main}>
          {/* CAMERA */}
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
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleScan}
              disabled={loading}
              style={styles.scanBtn(loading)}
            >
              <ScanFace size={20} />
              {loading
                ? "Đang nhận diện..."
                : "Quét Khuôn Mặt"}
            </button>
          </div>

          {/* SUCCESS */}
          {success && (
            <div
              style={{
                ...styles.resultBox,
                ...styles.successBox,
              }}
            >
              <h3 style={styles.titleSuccess}>
                <CheckCircle2 /> {userInfo.message}
              </h3>

              {capturedImage && (
                <img
                  src={capturedImage}
                  style={styles.capturedImg}
                />
              )}

              <p style={styles.row}>
                <User /> <b>{userInfo.name}</b>
              </p>
              <p style={styles.row}>
                <UserCheck /> {userInfo.status}
              </p>
              <p style={styles.row}>
                <Clock />{" "}
                {checkinTime?.toLocaleTimeString("vi-VN")}
              </p>
            </div>
          )}

          {/* FAILED */}
          {failed && (
            <div
              style={{
                ...styles.resultBox,
                ...styles.failedBox,
              }}
            >
              <h3 style={styles.titleFail}>
                <XCircle />
                {errorMsg.includes("giả mạo")
                  ? " Phát hiện giả mạo"
                  : " Không nhận diện được"}
              </h3>

              <p style={{ whiteSpace: "pre-line" }}>
                {errorMsg}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scan;