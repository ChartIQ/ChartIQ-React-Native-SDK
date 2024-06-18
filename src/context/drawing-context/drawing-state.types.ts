import { DrawingSettings, DrawingTool, SupportedSettings } from '@chartiq/react-native-chartiq';

import { LineTypeItem } from '../../assets/icons/line-types/line-types';

export interface DrawingState {
  name: DrawingTool;
  title: string;
  drawingSettings: DrawingSettings;
  supportedSettings: SupportedSettings;
  currentLineType: LineTypeItem;
}
