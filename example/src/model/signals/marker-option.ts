export enum SignalMarkerType {
  MARKER = 'marker',
  PAINTBAR = 'paintbar',
}

export enum SignalShape {
  CIRCLE = 'circle',
  SQUARE = 'square',
  DIAMOND = 'diamond',
}

export enum SignalSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum SignalPosition {
  ABOVE_CANDLE = 'above_candle',
  BELOW_CANDLE = 'below_candle',
  ON_CANDLE = 'on_candle',
}

export interface MarkerOption {
  type: SignalMarkerType;
  color: string | null;
  signalShape: SignalShape;
  signalSize: SignalSize;
  label: string;
  signalPosition: SignalPosition;
}
