import { LineTypeItem } from '~/assets/icons/line-types/line-types';
import { DrawingSettings, DrawingTool, SupportedSettings } from '~/model';

export interface DrawingState {
  name: DrawingTool;
  title: string;
  drawingSettings: DrawingSettings;
  supportedSettings: SupportedSettings;
  currentLineType: LineTypeItem;
}
