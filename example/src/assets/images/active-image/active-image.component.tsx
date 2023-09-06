import React from 'react';
import { Image } from 'react-native';

import { useTheme } from '~/theme';

import CrosshairImageSource from '../crosshair';
import DrawingsImageSource from '../drawings';
import FullViewImageSource from '../full-view';

import { ActiveImageProps } from './active-image.types';

const sources = {
  fillView: FullViewImageSource,
  drawings: DrawingsImageSource,
  crosshair: CrosshairImageSource,
};

const ActiveImage: React.FC<ActiveImageProps> = ({ active, type, ...props }) => {
  const { isDark } = useTheme();

  const source =
    sources?.[type]?.[isDark ? 'dark' : 'light']?.[active ? 'active' : 'inactive'] ?? {};

  return <Image {...props} source={source} />;
};

export default ActiveImage;
