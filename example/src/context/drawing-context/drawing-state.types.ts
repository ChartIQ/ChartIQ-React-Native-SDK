import { DrawingSettings, DrawingTool, SupportedSettings } from 'react-native-chart-iq';

import { LineTypeItem } from '~/assets/icons/line-types/line-types';

export interface DrawingState {
  name: DrawingTool;
  title: string;
  drawingSettings: DrawingSettings;
  supportedSettings: SupportedSettings;
  currentLineType: LineTypeItem;
}
