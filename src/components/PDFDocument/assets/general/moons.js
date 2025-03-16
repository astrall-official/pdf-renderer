import React from "react";
import { LinearGradient, Svg, Defs, Stop, Rect, Path , G} from "@react-pdf/renderer";

const component = ({ ...props }) => {
  return (
      <Svg version="1.1" viewBox="0 0 2048 350" width="600" {...props}>
        <G fill="#000" transform="translate(0,-400)">
          <Path
            transform="translate(1015,450)"
            d="m0 0h18l19 3 18 6 17 9 12 9 10 9 9 10 10 16 7 15 5 19 2 13v17l-3 19-5 16-8 16-8 12-12 14-15 12-16 9-15 6-21 5h-30l-19-4-16-6-14-8-12-9-10-9-10-12-11-18-6-15-4-18-1-7v-22l3-17 5-16 8-16 9-13 11-12 10-9 16-10 12-6 16-5z"
          />
          <Path
            transform="translate(635,450)"
            d="m0 0h19l19 3 15 5 16 8 11 7 14 12 11 13 8 13 7 15 5 16 2 12v28l-3 16-6 17-6 12-12 17-14 14-11 8-14 8-15 6-15 4-7 1h-30l-21-5-15-6-16-9-11-9 1-2 15-5 14-8 11-9 10-11 8-14 5-13 3-12 1-17-2-16-4-13-8-16-8-11-10-10-14-9-15-7-7-3 3-3 16-11 16-8 15-5z"
          />
          <Path
            transform="translate(1398,450)"
            d="m0 0h18l14 2 15 4 18 8 15 10 7 6-2 2-10 3-17 9-10 8-10 10-8 13-7 16-3 13-1 17 2 16 6 18 8 14 8 10 7 7 15 10 16 7 5 2-2 4-18 12-18 8-19 5-6 1h-29l-19-4-16-6-16-9-14-11-11-11-10-14-9-17-6-20-2-10v-29l3-16 7-19 8-15 10-13 15-15 18-12 18-8 21-5z"
          />
          <Path
            transform="translate(308,450)"
            d="m0 0h17l15 2 17 5 13 6 11 6 13 10 12 12 11 15 8 16 6 18 3 18v20l-2 14-6 20-10 19-8 11-12 13-17 13-23 11-19 5-19 2-17-1-19-4-15-6-12-6-1-2 24-1 17-4 15-6 16-10 12-11 11-15 7-14 5-15 2-12v-22l-4-18-6-16-8-13-9-11-10-9-14-9-13-6-19-5-6-1h-19l1-3 19-9 17-5z"
          />
          <Path
            transform="translate(1724,450)"
            d="m0 0h16l16 2 16 5 16 7 5 3v2h-18l-20 4-14 5-14 8-11 9-8 8-10 14-7 15-4 12-2 11v24l3 16 6 16 8 14 13 15 14 11 16 8 14 5 21 3h13v2l-19 9-16 5-21 3-20-1-19-4-16-6-16-9-11-9-10-9-9-11-11-18-7-18-3-13-1-8v-24l3-17 6-18 8-15 8-11 9-10 7-7 15-11 16-8 10-4 18-4z"
          />
          <Path
            transform="translate(1219,547)"
            d="m0 0 2 2 3 8 8 7 7 3v2l-9 4-7 8-3 8-2-1-4-9-9-8-7-3 10-5 7-8z"
          />
          <Path
            transform="translate(1518,547)"
            d="m0 0 2 1 3 8 5 6 10 5v2l-8 4-6 5-4 8-1 3-2-1-4-9-1-3-4-2-10-6 3-2 8-4 6-7z"
          />
          <Path
            transform="translate(834,547)"
            d="m0 0 2 1 2 7 8 8 8 4v2l-10 5-6 7-2 7h-2l-5-10-7-6-8-4 2-2 8-4 8-9z"
          />
          <Path
            transform="translate(1773,547)"
            d="m0 0h2l3 8 3 3v2l4 2 4 3 5 2v2l-7 3-8 7-4 9h-2l-4-9-5-5-6-4-4-2 2-2 8-4 7-8z"
          />
          <Path
            transform="translate(278,547)"
            d="m0 0 3 1 3 8 4 5 12 6-2 2-8 4-7 8-3 7-3-3-4-8-8-6-6-3 2-2 8-4 7-8z"
          />
          <Path
            transform="translate(538,547)"
            d="m0 0 3 1 3 8 8 8 8 4-4 2-6 4h-2l-2 4-4 6-2 5-2-3-4-8-7-6-6-3v-2l9-5 6-7z"
          />
          <Path transform="translate(1696,564)" d="m0 0 5 1 1 4-2 2-6-1 1-5z" />
          <Path transform="translate(1441,564)" d="m0 0 5 2-1 5-4 1-3-3 1-4z" />
          <Path transform="translate(348,564)" d="m0 0 5 1 1 4-5 3-3-3 1-4z" />
          <Path transform="translate(1728,564)" d="m0 0 5 1 1 4-2 2h-5v-6z" />
          <Path transform="translate(1473,564)" d="m0 0 5 2-1 5-3 1-3-2v-5z" />
          <Path transform="translate(872,564)" d="m0 0 4 1 1 4-4 3-4-3 1-4z" />
          <Path transform="translate(610,564)" d="m0 0 4 2-1 5-4 1-2-2 1-5z" />
          <Path transform="translate(1173,564)" d="m0 0 5 1 1 4-2 2-5-1-1-3z" />
          <Path transform="translate(789,564)" d="m0 0 5 1 1 3-3 3-5-1 1-5z" />
          <Path transform="translate(316,564)" d="m0 0 4 1 1 4-3 3-4-2 1-5z" />
          <Path transform="translate(1256,564)" d="m0 0 4 2 1 3-3 3-4-2 1-5z" />
          <Path transform="translate(1555,565)" d="m0 0 5 1-1 5-3 1-3-2 1-4z" />
          <Path transform="translate(461,565)" d="m0 0h5l1 4-2 2-5-1z" />
          <Path transform="translate(577,564)" d="m0 0 4 2-1 5-5-1v-4z" />
          <Path transform="translate(1588,565)" d="m0 0h4l1 4-2 2-5-1v-4z" />
          <Path transform="translate(494,564)" d="m0 0 5 2-1 4-4 1-1-1v-5z" />
          <Path transform="translate(234,564)" d="m0 0 5 2-1 4-4 1-2-4z" />
          <Path transform="translate(201,564)" d="m0 0 5 1v4l-5 1-2-3z" />
          <Path transform="translate(1811,565)" d="m0 0 4 1 1 3-5 2-2-1 1-4z" />
        </G>
      </Svg>
  );
};

export default component;
