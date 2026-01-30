import React, { useState } from "react";
import { Users2, ClipboardCheck, BarChart3, Clock } from "lucide-react";
import { stylesSidebar } from "./Styles";

const Sidebar = ({ setActivePage }) => {

  const [activeMenu, setActiveMenu] = useState("employee");
  const [hoverMenu, setHoverMenu] = useState(null);

  const handleClick = (key) => {
    setActiveMenu(key);
    setActivePage(key);
  };

  const renderMenu = (key, label, Icon) => {
    const isActive = activeMenu === key;
    const isHover = hoverMenu === key;

    return (
      <div
        key={key}
        onClick={() => handleClick(key)}
        onMouseEnter={() => setHoverMenu(key)}
        onMouseLeave={() => setHoverMenu(null)}
        style={{
          ...stylesSidebar.menuItem,
          ...(isActive && stylesSidebar.menuItemActive),
          ...(isHover && !isActive && stylesSidebar.menuItemHover),
        }}
      >
        {isActive && <div style={stylesSidebar.activeBar} />}

        <Icon size={20} color={isActive ? "#fff" : "#94a3b8"} />

        <span
          style={{
            ...stylesSidebar.menuText,
            ...(isActive && stylesSidebar.activeText),
          }}
        >
          {label}
        </span>
      </div>
    );
  };

  return (
    <aside style={stylesSidebar.sidebar}>
      {/* HEADER – CAO BẰNG NAVBAR */}
      <div style={stylesSidebar.header}>
        <div style={stylesSidebar.logoBox}>
          <div style={stylesSidebar.logoIcon}>N</div>
          <div>
            <div style={stylesSidebar.logo}>NANO TECH</div>
            <div style={stylesSidebar.logoSub}>Attendance System</div>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div style={stylesSidebar.menuList}>
        {renderMenu("employee", "Nhân viên", Users2)}
        {renderMenu("shift", "Ca làm việc", Clock)}
        {renderMenu("history", "Điểm danh", ClipboardCheck)}
        {renderMenu("stats", "Thống kê", BarChart3)}
      </div>

      <div style={{ flex: 1 }} />
    </aside>
  );
};
export default Sidebar;