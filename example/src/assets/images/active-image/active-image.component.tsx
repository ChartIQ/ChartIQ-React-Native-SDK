import React from 'react';
import { Image } from 'react-native';

import FullView from '~/assets/icons/full-view';
import { useTheme } from '~/theme';

import CrosshairImageSource from '../crosshair';
import DrawingsImageSource from '../drawings';

import { ActiveImageProps } from './active-image.types';

const sources = {
  drawings: DrawingsImageSource,
  crosshair: CrosshairImageSource,
};

const ActiveImage: React.FC<ActiveImageProps> = ({ active, type, ...props }) => {
  const { isDark } = useTheme();

  if (type === 'fillView') {
    return <FullView active={active} />;
  }

  const source =
    sources?.[type]?.[isDark ? 'dark' : 'light']?.[active ? 'active' : 'inactive'] ?? {};

  return <Image {...props} source={source} />;
};

export default ActiveImage;
