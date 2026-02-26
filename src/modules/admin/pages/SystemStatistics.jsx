import React from "react";
import { Styles, DEFAULT_FACE } from "../style/Styles";
import { BarChart3 } from "lucide-react";
import StatisticalChart from "../components/layout/StatisticalChart";
import StatisticalFeaturedEmployee from "../components/layout/StatisticalFeaturedEmployee";
import StatisticalCard from "../components/layout/StatisticalCard";

/* ================= MAIN COMPONENT ================= */
const SystemStatistics = () => {
  return (
    <>
      {/* ================= HEADER ================= */}

      <div style={Styles.header}>
        <h1
          style={{
            ...Styles.title,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <BarChart3 /> THỐNG KÊ HỆ THỐNG
        </h1>
      </div>

      <div style={systemStyle.scrollContainer}>
        <StatisticalCard />
        <StatisticalFeaturedEmployee />
        <StatisticalChart />
      </div>
    </>
  );
};

export default SystemStatistics;
const systemStyle = {
  scrollContainer: {
    maxHeight: "calc(100vh - 140px)", // trừ header + padding
    overflow: "auto",

    /* Firefox */
    scrollbarWidth: "thin",
    scrollbarColor: "#0ca1a1 transparent",
  },
};
