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
  CalendarClock,
  ShieldCheck,
  AlertTriangle,
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
    height: 60,
    background: "rgba(2,6,23,0.75)",
    borderBottom: "1px solid rgba(0,255,255,0.25)",
    backdropFilter: "blur(18px)",
    color: "#00ffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 15px",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  
  loginSwitch: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 18px",
    borderRadius: 999,
    border: "1px solid rgba(0,255,225,0.5)",
    background: "rgba(0,255,225,0.08)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 0 16px rgba(0,255,225,0.35)",
  },

  loginBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "transparent",
    border: "none",
    color: "#00ffe1",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },

  divider: {
    color: "#00ffe1",
    opacity: 0.7,
  },

  body: {
    height: "calc(100vh - 64px)",
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },

  overlayBg: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at center, rgba(0,0,0,0.5), rgba(0,0,0,0.9))",
  },

  title: {
    position: "absolute",
    top: 40,
    left: "50%",
    transform: "translateX(-50%)",
    color: "#a5f3fc",
    fontSize: 38,
    fontWeight: 700,
    zIndex: 2,
    letterSpacing: 1.2,
    whiteSpace: "nowrap",
    textAlign: "center",
    width: "100%",
  },

  cameraContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    gap: 40,
  },

  cameraWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  cameraBorder: {
    width: 400,
    height: 400,
    borderRadius: "50%",
    padding: 5,
    background: "#22c55e",
    boxShadow: "0 0 0px rgba(0,255,255,0.65), inset 0 0 50px rgba(0,255,255,0.3)",
  },

  cameraInner: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    overflow: "hidden",
    background: "#000",
  },

  scanBtn: (disabled) => ({
    padding: "16px 72px",
    marginTop: 32,
    fontSize: 18,
    fontWeight: 700,
    borderRadius: 999,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled
      ? "rgba(100,100,100,0.6)"
      : "linear-gradient(135deg, #00d4ff, #0077ff)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: disabled ? "none" : "0 0 30px rgba(0,180,255,0.7)",
    transition: "all 0.3s",
  }),

  resultOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(16px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    animation: "fadeIn 0.4s ease-out",
  },

  resultCard: {
    width: 400,
    padding: 32,
    borderRadius: 24,
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px solid rgba(0,255,220,0.4)",
    boxShadow: "0 0 60px rgba(0,0,0,0.7)",
    color: "#f0f9ff",
    textAlign: "center",
    animation: "popIn 0.5s ease-out",
  },

  successCard: {
    borderColor: "rgba(0,255,200,0.7)",
    boxShadow: "0 0 50px rgba(0,255,200,0.5)",
  },

  alreadyCard: {
    borderColor: "rgba(251,191,36,0.7)",
    boxShadow: "0 0 50px rgba(251,191,36,0.4)",
  },

  failCard: {
    borderColor: "rgba(255,90,90,0.7)",
    boxShadow: "0 0 50px rgba(255,90,90,0.45)",
  },

  resultIcon: {
    marginBottom: 13,
  },

  resultTitle: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    whiteSpace: "nowrap",
  },

  successTitle: { color: "#00ffc8" },
  alreadyTitle: { color: "#fbbf24" },
  failTitle: { color: "#ff6b6b" },

  resultInfo: {
    fontSize: 17,
    lineHeight: 1.6,
    margin: "5px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  capturedImg: {
    width: 140,
    height: 140,
    borderRadius: "50%",
    objectFit: "cover",
    margin: "20px auto",
    border: "4px solid #00ffcc",
    boxShadow: "0 0 30px rgba(0,255,200,0.6)",
  },

  countdown: {
    marginTop: 24,
    fontSize: 16,
    color: "#a5f3fc",
    opacity: 0.8,
  },
};

/* Global animations */
const globalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes popIn {
    0%   { transform: scale(0.85); opacity: 0; }
    60%  { transform: scale(1.04); }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const FaceScan = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scanTime, setScanTime] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    if (!result) return;

    setCountdown(5);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResult(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [result]);

  const speakSuccess = (name, type) => {
    window.speechSynthesis.cancel();
    let text =
      type === "CHECK_IN"
        ? `Xin chào ${name}. Chấm công vào làm thành công.`
        : `Tạm biệt ${name}. Chấm công ra về thành công.`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "vi-VN";
    utter.rate = 0.9;
    utter.pitch = 1.0;
    const voices = speechSynthesis.getVoices();
    const vnVoice = voices.find((v) => v.lang === "vi-VN") || voices[0];
    if (vnVoice) utter.voice = vnVoice;
    speechSynthesis.speak(utter);
  };

  const handleScan = async () => {
    if (loading) return;
    setLoading(true);
    setResult(null);

    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) throw new Error("Không lấy được ảnh");
      setCapturedImage(imageSrc); 
      const { data } = await checkInFace(imageSrc);

      if (data.success) {
        setScanTime(new Date());

        if (
          data.message?.includes("đã chấm công đủ") ||
          data.message?.includes("đã chấm công đủ rồi") ||
          data.message?.includes("đã check-out")
        ) {
          setResult({
            type: "already",
            message: data.message || "Bạn đã check-out rồi!",
          });
        } else {
          setResult({ type: "success", data });
          speakSuccess(data.name, data.type);
        }
      } else {
        let msg = data.message || "Không nhận diện được khuôn mặt";
        if (msg.toLowerCase().includes("spoof")) {
          msg = "Phát hiện dấu hiệu giả mạo.\nVui lòng đứng trực tiếp trước camera.";
        }
        setResult({ type: "error", message: msg });
      }
    } catch (err) {
      let msg = "Lỗi kết nối máy chủ";
      if (err.response?.data?.message) {
        msg = err.response.data.message;
        if (msg.toLowerCase().includes("spoof")) {
          msg = "Phát hiện dấu hiệu giả mạo.\nVui lòng đứng trực tiếp trước camera.";
        }
      }
      setResult({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <div>
              {time.toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              | {time.toLocaleTimeString("vi-VN")}
            </div>
          </div>
          <div style={styles.loginSwitch}>
            <button
              style={styles.loginBtn}
              onClick={() => navigate("/admin/login")}
            >
              <ShieldCheck size={16} /> Admin
            </button>

            <span style={styles.divider}>|</span>

            <button
              style={styles.loginBtn}
              onClick={() => navigate("/employee")}
            >
              <User size={16} /> User
            </button>
          </div>
        </div>

        <div style={styles.body}>
          <div style={styles.overlayBg} />
          <div style={styles.title}>HỆ THỐNG ĐIỂM DANH KHUÔN MẶT</div>

          <div style={styles.cameraContainer}>
            <div style={styles.cameraWrap}>
              <div style={styles.cameraBorder}>
                <div style={styles.cameraInner}>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 440,
                      height: 440,
                      facingMode: "user",
                    }}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>

              <button
                onClick={handleScan}
                disabled={loading || !!result}
                style={styles.scanBtn(loading || !!result)}
              >
                <ScanFace size={22} />
                {loading ? "Đang nhận diện..." : result ? "Hoàn tất" : "Quét Khuôn Mặt"}
              </button>
            </div>

            {/* RESULT OVERLAY */}
            {result && (
              <div style={styles.resultOverlay}>
                <div
                  style={{
                    ...styles.resultCard,
                    ...(result.type === "success"
                      ? styles.successCard
                      : result.type === "already"
                      ? styles.alreadyCard
                      : styles.failCard),
                  }}
                >
                  {result.type === "success" ? (
                    <>
                      <div style={{ ...styles.resultTitle, ...styles.successTitle }}>
                        <CheckCircle2 size={44} style={styles.resultIcon} />
                        {result.data.type === "CHECK_IN"
                          ? "Check in thành công"
                          : "Check out thành công"}
                      </div>
                    
                      <img
                        src={capturedImage}
                        alt="Captured face"
                        style={styles.capturedImg}
                      />

                      <p style={{ fontSize: 20, color: "#99f6e4", margin: "12px 0 24px" }}>
                        {result.data.type === "CHECK_IN" ? "Check in" : "Check out"} lúc{" "}
                        {scanTime?.toLocaleTimeString("vi-VN")}
                      </p>

                      <div style={styles.resultInfo}>
                        <User size={20} /> <b>{result.data.name}</b>
                      </div>

                      <div style={styles.resultInfo}>
                        <CalendarClock size={20} /> <b>{result.data.shift_name}</b>
                      </div>

                      {result.data.late_minutes > 0 && (
                        <div style={{ ...styles.resultInfo, color: "#fcd34d" }}>
                          <Clock size={20} /> Đi muộn: {result.data.late_minutes} phút
                        </div>
                      )}
                      {result.data.early_leave_minutes > 0 && (
                        <div style={{ ...styles.resultInfo, color: "#fb7185" }}>
                          <Clock size={20} /> Về sớm: {result.data.early_leave_minutes} phút
                        </div>
                      )}
                      {result.data.overtime_minutes > 0 && (
                        <div style={{ ...styles.resultInfo, color: "#6ee7b7" }}>
                          <Clock size={20} /> Tăng ca: {result.data.overtime_minutes} phút
                        </div>
                      )}
                    </>
                  ) : result.type === "already" ? (
                    <>
                      <div style={{ ...styles.resultTitle, ...styles.alreadyTitle }}>
                        <CheckCircle2 size={44} style={styles.resultIcon} />
                        Đã điểm danh
                      </div>
                      <p style={{ fontSize: 18, margin: "16px 0 8px", color: "#fde68a" }}>
                        {result.message || "Hôm nay bạn đã điểm danh rồi!"}
                      </p>
                    </>
                  ) : (
                    <>
                      <div style={{ ...styles.resultTitle, ...styles.failTitle }}>
                        <XCircle size={44} style={styles.resultIcon} />
                        {result.message?.includes("giả mạo") ? "Phát hiện giả mạo" : "Thất bại"}
                      </div>
                      <p style={{ whiteSpace: "pre-line", fontSize: 17, lineHeight: 1.5, marginTop: 12 }}>
                        {result.message}
                      </p>
                      {result.message?.includes("giả mạo") && (
                        <AlertTriangle size={48} color="#ff6b6b" style={{ margin: "24px 0" }} />
                      )}
                    </>
                  )}

                  <div style={styles.countdown}>
                    Tự động đóng sau {countdown} giây
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FaceScan;