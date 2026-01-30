import backgroundImg from "/background.jpg";

export const DEFAULT_FACE = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export const Styles = {
  /* ====== LAYOUT ====== */
  container: {
    flex: 1,
    minHeight: "calc(100vh - 60px)",
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  overlay: {
    minHeight: "calc(100vh - 60px)",
    padding: 32,
    background: "rgba(2,6,23,0.88)",
    color: "#e5e7eb",
  },

  header: {
    marginBottom: 24,
  },

  title: {
    display: "flex",
    alignItems: "center",
    gap: 5,

    fontSize: 22,
    fontWeight: 800,
    letterSpacing: 1.2,

    color: "#ffffff",
    marginBottom: 18,
  },

  /* ====== ACTION BAR ====== */
  actions: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },

  rightActions: {
    marginLeft: "auto",
    display: "flex",
    gap: 10,
  },

  /* ====== INPUT & FILTER ====== */
  search: {
    width: 260,
    height: 44,
    padding: "0 14px",
    borderRadius: 12,
    background: "#020617",
    border: "1px solid #334155",
    color: "#fff",
    fontSize: 14,
    outline: "none",
  },

  filterSelect: {
    height: 44,
    padding: "0 14px",
    borderRadius: 12,
    background: "#020617",
    border: "1px solid #334155",
    color: "#e5e7eb",
    fontSize: 14,
    cursor: "pointer",
    outline: "none",
  },

  /* ====== BUTTONS ====== */
  btnPrimary: {
    background: "linear-gradient(135deg, #0891b2, #0ea5e9)",
    padding: "10px 20px",
    minHeight: 44,
    borderRadius: 14,
    border: "none",
    color: "white",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 15,
    fontWeight: 700,
    boxShadow: "0 6px 18px rgba(34,211,238,0.45)",
    transition: "all 0.2s ease",
  },

  btnExcel: {
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    padding: "10px 20px",
    minHeight: 44,
    borderRadius: 14,
    border: "none",
    color: "#ecfdf5",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 15,
    fontWeight: 700,
    boxShadow: "0 6px 18px rgba(34,197,94,0.45)",
  },

  btnPdf: {
    background: "linear-gradient(135deg, #dc2626, #ef4444)",
    padding: "10px 20px",
    minHeight: 44,
    borderRadius: 14,
    border: "none",
    color: "#fff",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 15,
    fontWeight: 700,
    boxShadow: "0 6px 18px rgba(239,68,68,0.45)",
  },

  /* ====== TABLE ====== */
  tableWrapper: {
    background: "#020617",
    borderRadius: 16,
    border: "1px solid #1e293b",
    overflow: "hidden",
  },

  tableScroll: {
    maxHeight: "75vh",
    overflowY: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    padding: 14,
    textAlign: "center",
    fontSize: 15,
    fontWeight: 700,
    color: "#67e8f9",
    background: "#020617",
    position: "sticky",
    top: 0,
    zIndex: 5,
    borderBottom: "1px solid #1e293b",
  },

  td: {
    padding: 14,
    textAlign: "center",
    fontSize: 15,
    borderBottom: "1px solid #1e293b",
  },

  faceImg: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #38f2f2",
  },

  actionIcons: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
  },

  iconBoxEdit: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "1px solid #22d3ee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#22d3ee",
    cursor: "pointer",
  },

  iconBoxDelete: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "1px solid #ef4444",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ef4444",
    cursor: "pointer",
  },

  

  /* ====== MODAL ====== */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },

  modal: {
    width: 520,
    background: "#020617",
    padding: 28,
    borderRadius: 18,
    border: "1px solid #1e293b",
  },

  modalTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: 800,
    color: "#38f2f2",
    marginBottom: 20,
  },

  faceBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },

  facePreview: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #38f2f2",
  },

  uploadBtn: {
    fontSize: 14,
    color: "#38f2f2",
    cursor: "pointer",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  label: {
    fontSize: 13,
    color: "#94a3b8",
  },

  formInput: {
    height: 44,
    padding: "0 14px",
    borderRadius: 12,
    background: "#020617",
    border: "1px solid #334155",
    color: "#e5e7eb",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 24,
  },
};

export const stylesLogin = {
  wrapper: {
    height: "100vh",
    width: "100%",
    position: "relative",
    fontFamily: "Inter, Segoe UI, system-ui, sans-serif",
    overflow: "hidden",
  },

  background: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(2px) scale(1.05)",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(120deg, rgba(2,6,23,0.9), rgba(2,6,23,0.6))",
  },

  card: {
    position: "relative",
    zIndex: 2,
    width: 380,
    padding: "36px 32px",
    margin: "auto",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.85)",
    borderRadius: 26,
    boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
    backdropFilter: "blur(18px)",
    textAlign: "center",
  },

  logoBox: {
    marginBottom: 24,
  },

  title: {
    fontSize: 40,
    fontWeight: 800,
    letterSpacing: 4,
    background: "linear-gradient(135deg, #0ca1a1, #22d3ee)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },


  subtitle: {
    fontSize: 17,
    fontWeight: 600,
    color: "#64748b",
    letterSpacing: 1,
    marginTop: 1,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: "13px 16px",
    border: "1px solid #e5e7eb",
    transition: "all 0.2s ease",
  },

  icon: {
    marginRight: 12,
    fontSize: 16,
    opacity: 0.6,
  },

  input: {
    border: "none",
    outline: "none",
    fontSize: 14,
    width: "100%",
    color: "#020617",
    background: "transparent",
  },

  loginBtn: {
    marginTop: 12,
    padding: "14px",
    borderRadius: 999,
    border: "none",
    background:
      "linear-gradient(135deg, #0ca1a1 0%, #22d3ee 100%)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 14px 30px rgba(12,161,161,0.45)",
    transition: "all 0.25s ease",
  },

  backBtn: {
    marginTop: 10,
    background: "transparent",
    border: "none",
    color: "#64748b",
    fontSize: 14,
    cursor: "pointer",
    transition: "color 0.2s ease",
  },

  eye: {
    marginLeft: 10,
    cursor: "pointer",
    fontSize: 16,
    opacity: 0.6,
    userSelect: "none",
  },
};

export const stylesSidebar = {
  sidebar: {
    width: 280,
    height: "100vh",
    background: "linear-gradient(180deg, #020617 0%, #020617 100%)",
    backdropFilter: "blur(14px)",
    borderRight: "1px solid rgba(12,161,161,0.25)",
    display: "flex",
    flexDirection: "column",
  },

  /* HEADER */
  header: {
    height: 60, // BẰNG NAVBAR
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid rgba(12,161,161,0.25)",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  logoIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    background: "linear-gradient(135deg, #0ca1a1, #22d3ee)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    fontWeight: 900,
    color: "#020617",
    boxShadow: "0 0 22px rgba(34,211,238,0.55)",
  },

  logo: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: 2,
    color: "#ffffff",
    lineHeight: 1.5,
  },

  logoSub: {
    fontSize: 14,
    color: "#67e8f9",
    letterSpacing: 1.1,
  },

  /* MENU */
  menuList: {
    padding: "20px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  menuItem: {
    position: "relative",
    padding: "14px 18px",
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    gap: 15,
    cursor: "pointer",
    transition: "all 0.25s ease",
  },

  menuItemActive: {
    background: "linear-gradient(90deg, #0ca1a1, #089191)",
    boxShadow: "0 10px 26px rgba(12,161,161,0.4)",
  },

  menuItemHover: {
    background: "rgba(30,41,59,0.65)",
  },

  menuText: {
    fontSize: 15,
    fontWeight: 600,
    color: "#94a3b8",
  },

  activeText: {
    color: "#ffffff",
    fontWeight: 600,
  },

  activeBar: {
    position: "absolute",
    left: -8,
    width: 4,
    height: 26,
    background: "#22d3ee",
    borderRadius: "0 4px 4px 0",
    boxShadow: "0 0 14px #22d3ee",
  },
};