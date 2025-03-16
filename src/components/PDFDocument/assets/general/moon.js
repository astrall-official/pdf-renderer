import React from "react";
import { LinearGradient, Svg, Defs, Stop, Rect, Path } from "@react-pdf/renderer";

const component = ({ rtl = false, ...props }) => {
  const rotation = rtl ? "rotate(180)" : undefined;

  return (
      <Svg
        viewBox="48.238 32.155 282.64 415.298"
        width="282.64px"
        height="415.298px"
        style={{ transform: rotation }}
        {...props}
      >
        <Path
          d="M 255.887 447.453 C 141.206 447.453 48.238 354.485 48.238 239.804 C 48.238 125.123 141.206 32.155 255.887 32.155 C 282.329 32.155 307.618 37.098 330.878 46.109 C 231.905 55.951 154.612 139.46 154.612 241.023 C 154.612 340.86 229.301 423.251 325.851 435.372 C 303.991 443.193 280.436 447.453 255.887 447.453 Z"
          id="object-0"
        />
      </Svg>
  );
};

export default component;
