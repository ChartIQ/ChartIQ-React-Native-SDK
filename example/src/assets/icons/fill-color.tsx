import React from 'react';
import { Path, Svg } from 'react-native-svg';

interface FillColorProps {
  iconColor?: string;
  selectedColor?: string;
}

const FillColor: React.FC<FillColorProps> = ({ iconColor, selectedColor }) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24">
      <Path fill="none" d="M0 0h24v24H0V0z" />
      <Path
        fill={iconColor}
        d="M16.56 8.94L8.32.7C7.93.31 7.3.31 6.91.7c-.39.39-.39 1.02 0 1.41l1.68 1.68-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"
      />
      <Path
        fill={selectedColor}
        fill-opacity=".36"
        d="M2 20h20c1.1 0 2 .9 2 2s-.9 2-2 2H2c-1.1 0-2-.9-2-2s.9-2 2-2z"
      />
    </Svg>
  );
};

export default FillColor;
