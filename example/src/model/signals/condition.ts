import { MarkerOption } from './marker-option';
import { SignalOperator } from './signal-operator';

export interface Condition {
  leftIndicator: string;
  rightIndicator: string | null;
  signalOperator: SignalOperator;
  markerOption: MarkerOption;
}
