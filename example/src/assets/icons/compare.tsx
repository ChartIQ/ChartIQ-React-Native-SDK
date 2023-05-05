import { useTheme } from '../../theme';
import React from 'react';
import { Path, Svg, G, Circle } from 'react-native-svg';

interface CompareProps {
  width?: number;
  height?: number;
  fill?: string;
}

const Compare: React.FC<CompareProps> = ({ fill, height = 32, width = 32 }) => {
  const { colors } = useTheme();
  return (
    <Svg width={width} height={height} viewBox={'0 0 32 32'}>
      <Path
        d="M23.343 23.863v-9.797h-4.31v9.797h-1.078V12.17h-4.31v11.692h-1.078V15.34h-4.31v8.522H7V25h17.636v-1.137h-1.293zm-11.853 0H9.335v-7.384h2.155v7.384zm5.388 0h-2.155V13.308h2.155v10.555zm5.388 0H20.11v-8.66h2.155v8.66z"
        fill={fill ?? colors.buttonText}
        fill-rule="nonzero"
      />
      <G transform="translate(9.5 7)" stroke={colors.buttonText}>
        <Circle cx="1" cy="4.5" r="1" />
        <Circle cx="6.3" cy="1" r="1" />
        <Circle cx="11.7" cy="3" r="1" />
        <Path d="m2 4 3.223-2.5M7.25 1 11 2.5" />
      </G>
    </Svg>
  );
};

export default Compare;
