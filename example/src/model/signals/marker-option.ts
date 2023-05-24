export enum SignalMarkerType {
  MARKER = 'MARKER',
  PAINTBAR = 'PAINTBAR',
}

export enum SignalShape {
  CIRCLE = 'CIRCLE',
  SQUARE = 'SQUARE',
  DIAMOND = 'DIAMOND',
}

export enum SignalSize {
  SMALL = 'S',
  MEDIUM = 'M',
  LARGE = 'L',
}

export enum SignalPosition {
  ABOVE_CANDLE = 'ABOVE_CANDLE',
  BELOW_CANDLE = 'BELOW_CANDLE',
  ON_CANDLE = 'ON_CANDLE',
}

export interface MarkerOption {
  type: SignalMarkerType;
  color: string | null;
  signalShape: SignalShape;
  signalSize: SignalSize;
  label: string;
  signalPosition: SignalPosition;
}

export interface NullableMarkerOption {
  type?: SignalMarkerType | null;
  color?: string | null;
  signalShape?: SignalShape | null;
  signalSize?: SignalSize | null;
  label?: string | null;
  signalPosition?: SignalPosition | null;
}
