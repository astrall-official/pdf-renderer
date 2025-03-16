import React from "react";
import { LinearGradient, Svg, Defs, Stop, Rect } from "@react-pdf/renderer";

const component = ({ rtl = false, ...props }) => {
  // Create transform style for rotation when rtl is true
  const transform = rtl ? "rotate(180)" : undefined;
  // Set transform origin to center of SVG
  const transformOrigin = rtl ? "center center" : undefined;

  return (
      <Svg
        viewBox="0 0 100 0.2"
        width="100"
        style={{ transform, transformOrigin }}
        {...props}
      >
        <Defs>
          <LinearGradient
            id="myLinearGradient"
          >
            <Stop offset="0%" stopColor="black" />
            <Stop offset="70%" stopColor="black" />
            <Stop offset="100%" stopColor="white" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100"
          height="1"
          stroke="none"
          fill="url('#myLinearGradient')"
        />
      </Svg>
  );
};

export default component;
