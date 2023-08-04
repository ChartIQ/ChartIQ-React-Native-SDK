import {
  SignalMarkerType,
  SignalPosition,
  SignalShape,
  SignalSize,
} from '../enums';

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
