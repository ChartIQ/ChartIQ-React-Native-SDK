import { SignalOperator } from '../../enums';
import { MarkerOption, NullableMarkerOption } from '../marker-option';

export interface Condition {
  leftIndicator: string;
  rightIndicator: string | null;
  signalOperator: SignalOperator;
  markerOption: MarkerOption;
}

export interface NullableCondition {
  leftIndicator?: string | null;
  rightIndicator?: string | null;
  signalOperator?: SignalOperator | null;
  markerOption?: NullableMarkerOption | null;
}
