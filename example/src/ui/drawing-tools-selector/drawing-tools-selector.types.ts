import { DrawingItem } from './drawing-tools-selector.data';

export interface DrawingToolSelectorProps {
  onChange: (symbol: DrawingItem) => void;
}
