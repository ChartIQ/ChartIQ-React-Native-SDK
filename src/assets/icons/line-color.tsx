import React from 'react';
import { G, Path, Rect, Svg, SvgProps } from 'react-native-svg';

interface LineColorProps extends SvgProps {
  iconColor?: string;
  selectedColor?: string;
}

const LineColor: React.FC<LineColorProps> = ({ iconColor, selectedColor }) => {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32">
      <G fill="none" fill-rule="evenodd">
        <Rect fill={selectedColor} x="4" y="22" width="24" height="4" rx="2" />
        <G fill={iconColor}>
          <Path
            d="M10.382 17.98a.38.38 0 0 1-.37-.474l.716-2.87a.382.382 0 0 1 .1-.177l8.05-8.05a1.398 1.398 0 0 1 1.976 0l.718.718c.545.544.545 1.43 0 1.975l-8.05 8.05a.378.378 0 0 1-.178.1l-2.87.715a.352.352 0 0 1-.092.012zm1.06-3.058-.537 2.153 2.152-.536 7.977-7.976a.636.636 0 0 0 0-.898l-.719-.718a.636.636 0 0 0-.898 0l-7.976 7.975zm1.84 2h.022-.022z"
            fill-rule="nonzero"
          />
          <Path
            d="M20.064 10.453a.378.378 0 0 1-.27-.112L17.64 8.186a.381.381 0 1 1 .538-.539l2.156 2.155a.381.381 0 0 1-.27.65z"
            fill-rule="nonzero"
          />
          <Path d="m19.867 6.294 1.805 1.807-1.802 1.672-1.807-1.902z" />
        </G>
      </G>
    </Svg>
  );
};

export default LineColor;
