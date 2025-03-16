import React from "react";
import { LinearGradient, Svg, Defs, Stop, Rect, Path , G} from "@react-pdf/renderer";

const component = ({ ...props }) => {
  return (
      <Svg viewBox="0 0 100 0.2" width="500" {...props}>
        <Defs>
          <LinearGradient id="myLinearGradient">
            <stop offset="0%" stopColor="white" />
            <stop offset="10%" stopColor="black" />
            <stop offset="90%" stopColor="black" />
            <stop offset="100%" stopColor="white" />
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
