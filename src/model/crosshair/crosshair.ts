export interface CrosshairState {
  close: string;
  high: string;
  low: string;
  open: string;
  volume: string;
  price: string;
}

export const defaultCrosshairState: CrosshairState = {
  close: '0',
  high: '0',
  low: '0',
  open: '0',
  volume: '0',
  price: '0',
};
