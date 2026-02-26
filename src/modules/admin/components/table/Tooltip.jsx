import React, { useState } from "react";
import { tooltipStyle } from "../../style/Styles";

const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      style={tooltipStyle.wrapper}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
        <div style={tooltipStyle.tooltip}>
          {text}
          <div style={tooltipStyle.arrow} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;