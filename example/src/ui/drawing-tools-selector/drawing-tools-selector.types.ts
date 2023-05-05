import { DrawingItem } from './drawing-tools-selector.data';

export interface DrawingToolSelectorProps {
  onChange: (symbol: DrawingItem) => void;
}

export interface DrawingToolSelectorMethods {
  open: () => void;
  close: () => void;
}
