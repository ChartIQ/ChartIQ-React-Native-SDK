import { DrawingSettings } from 'react-native-chartiq';

import icons from '~/assets/icons';
import {
  LineTypeItem,
  findLineTypeItemByPatternAndWidth,
} from '~/assets/icons/line-types/line-types';

export type STDDeviations = '1' | '2' | '3';

export type STDDeviationItem = {
  name: STDDeviations;
  showLine: boolean;
  lineType: LineTypeItem;
  lineColor: string;
};

export const defaultLineType = {
  Icon: icons.lineTypes.solid,
  lineWidth: 1,
  name: 'solid',
  value: 'solid',
};

export const createSTDDeviationSettings = (drawingSettings: DrawingSettings) =>
  [
    {
      name: '1' as STDDeviations,
      showLine: drawingSettings.active1,
      lineType:
        findLineTypeItemByPatternAndWidth(drawingSettings.pattern1, drawingSettings.lineWidth1) ??
        defaultLineType,
      lineColor: drawingSettings.color1,
    },
    {
      name: '2' as STDDeviations,
      showLine: drawingSettings.active2,
      lineType:
        findLineTypeItemByPatternAndWidth(drawingSettings.pattern2, drawingSettings.lineWidth2) ??
        defaultLineType,
      lineColor: drawingSettings.color2,
    },
    {
      name: '3' as STDDeviations,
      showLine: drawingSettings.active3,
      lineType:
        findLineTypeItemByPatternAndWidth(drawingSettings.pattern2, drawingSettings.lineWidth2) ??
        defaultLineType,
      lineColor: drawingSettings.color3,
    },
  ] satisfies STDDeviationItem[];
