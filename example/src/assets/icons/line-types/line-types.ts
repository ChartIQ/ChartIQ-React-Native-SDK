import React from 'react';
import { SvgProps } from 'react-native-svg';

import lineTypes from '.';

export type LineTypeItem = {
  name: string;
  Icon: React.FC<SvgProps>;
  value: string;
  lineWidth: number;
};

export const lineTypePickerData: LineTypeItem[] = [
  {
    name: 'solid',
    Icon: lineTypes.solid,
    value: 'solid',
    lineWidth: 1,
  },
  {
    name: 'solidBold',
    Icon: lineTypes.solidBold,
    value: 'solid',
    lineWidth: 2,
  },
  {
    name: 'solidBoldest',
    Icon: lineTypes.solidBoldest,
    value: 'solid',
    lineWidth: 3,
  },
  {
    name: 'dotted',
    Icon: lineTypes.dotted,
    value: 'dotted',
    lineWidth: 1,
  },
  {
    name: 'dottedBold',
    Icon: lineTypes.dottedBold,
    value: 'dotted',
    lineWidth: 2,
  },
  {
    name: 'dash',
    Icon: lineTypes.dash,
    value: 'dashed',
    lineWidth: 1,
  },
  {
    name: 'dashBold',
    Icon: lineTypes.dashBold,
    value: 'dashed',
    lineWidth: 2,
  },
];

export const findLineTypeItemByPatternAndWidth = (pattern: string, width: number) => {
  return lineTypePickerData.find((item) => item.value === pattern && item.lineWidth === width);
};
