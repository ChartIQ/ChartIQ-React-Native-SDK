import { DrawingItem } from './drawing-tools-selector.data';

export interface DrawingToolSelectorProps {
  onChange: (symbol: DrawingItem) => void;
  handleRestoreDrawingParams: (tool: DrawingItem) => Promise<void>;
}
