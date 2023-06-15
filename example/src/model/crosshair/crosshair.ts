import { SharedValue } from 'react-native-reanimated';

export interface CrosshairState {
  close: string;
  high: string;
  low: string;
  open: string;
  volume: string;
  price: string;
}

export interface CrosshairSharedValues {
  Open: SharedValue<string>;
  High: SharedValue<string>;
  Low: SharedValue<string>;
  Close: SharedValue<string>;
  Vol: SharedValue<string>;
  Price: SharedValue<string>;
}

export const defaultCrosshairState: CrosshairState = {
  close: '0',
  high: '0',
  low: '0',
  open: '0',
  volume: '0',
  price: '0',
};
