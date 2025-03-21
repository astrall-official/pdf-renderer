import React from "react";
import { LinearGradient, Svg, Defs, Stop, Rect, Path } from "@react-pdf/renderer";

const component = ({ ...props }) => {
  return (
      <Svg
        width="800px"
        height="800px"
        viewBox="0 0 64 64"
        preserveAspectRatio="xMidYMid meet"
        {...props}
      >
        <Path
          d="M37.834 34.414L62 32l-24.166-2.417l15.38-18.797l-18.798 15.381L32 2l-2.417 24.167l-18.797-15.381l15.38 18.797L2 32l24.166 2.414l-15.38 18.799l18.797-15.379L32 62l2.416-24.166l18.798 15.379z"
          fill="#000000"
        ></Path>
      </Svg>
  );
};

export default component;
