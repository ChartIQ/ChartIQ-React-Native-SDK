import { ImageProps } from 'react-native';

export type ActiveImageType = 'fillView' | 'drawings' | 'crosshair';

export interface ActiveImageProps extends Omit<ImageProps, 'source'> {
  active: boolean;
  type: ActiveImageType;
}
