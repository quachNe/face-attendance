import backgroundImg from "/background.jpg";

// USING AS DEFAULT FACE IMAGE
export const DEFAULT_FACE = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// USING IN MAIN LAYOUT
export const Styles = {
  // LAYOUT CONTAINER
  container: {
    flex: 1,
    minHeight: "calc(100vh - 60px)",
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  // OVERLAY
  overlay: {
    minHeight: "calc(100vh - 60px)",
    padding: 32,
    background: "rgba(2,6,23,0.88)",
    color: "#e5e7eb",
  },
  
  /* ====== HEADER ====== */
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

};

// USING IN MODALS
export const styleModel = {
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
    color: "#ffffff",
    marginBottom: 20,
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
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: 600,
  },

  formInput: {
    width: "100%",
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

  formGridShift: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  formGroupShift :{
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  inputWrapper: {
    position: "relative",
  },

  eyeIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#94a3b8",
  },

  faceImg: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #38f2f2",
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
  },
};

// USING IN BUTTONS
export const stylesButton = {
  actions: {
    display: "flex",
    gap: 12,
    marginTop: 30,
  },
  
  btnCancel: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    border: "1px solid #334155",
    background: "#dc2626",
    color: "#e5e7eb",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  btnSave: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    border: "none",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    color: "white",
    background: "linear-gradient(135deg,#22d3ee,#06b6d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0 12px 30px rgba(34,211,238,0.5)",
  },

  btnCancelHover: {
    transform: "translateY(-1px)",
  },

  btnSaveHover: {
    transform: "translateY(-1px)",
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

  btnAdd: {
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

  // BUTTON IN TABLE
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

  iconBoxBase: {
    transition: "all 0.2s ease",
  },

  iconBoxEditHover: {
    backgroundColor: "#22d3ee",
    color: "#fff",
    transform: "scale(1.08)",
  },

  iconBoxDeleteHover: {
    backgroundColor: "#ef4444",
    color: "#fff",
    transform: "scale(1.08)",
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

  uploadBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 500,
    color: "#ffffff",
    cursor: "pointer",
    userSelect: "none",
  },
};

// USING IN ERROR MESSAGES
export const stylesError = {
  message: {
    color: "red", 
    fontSize: 14, 
    fontWeight: "bold", 
    marginTop: 20, 
    textAlign: "center", 
    marginBottom:20
  },
};

// USING IN FORMS AND TABLES
export const stylesForm = {
  searchInput: {
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
    padding: "0 15px",
    borderRadius: 12,
    background: "#020617",
    border: "1px solid #334155",
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
    outline: "none",
  },
};

// USING IN TABLES
export const styleTable = {
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

  spinner: {
    width: 42,
    height: 42,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #0ca1a1",
    borderRadius: "50%",
    animation: "spin 20s linear infinite",
    transform: "translateY(70px)", // 👈 đẩy xuống
  },

  loadingOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(255,255,255,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
};