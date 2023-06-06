import React from 'react';
import { SvgProps } from 'react-native-svg';

import { ChartType } from '~/model/chart-type';

import icons from '../../assets/icons';

export enum AggregationType {
  HEIKINASHI = 'Heikin Ashi',
  KAGI = 'Kagi',
  LINEBREAK = 'Line Break',
  RENKO = 'Renko',
  RANGEBARS = 'Range Bars',
  PANDF = 'Point & Figure',
}

export type ChartStyleItem = {
  label: string;
  value: ChartType;
  icon: React.FC<SvgProps>;
  aggregationType?: AggregationType;
};

export interface ChartStyleSelectorProps {
  onChange: (interval: ChartStyleItem) => void;
}

interface ChartStyleSelectorData {
  label: string;
  value: ChartType;
  icon: React.FC<SvgProps>;
  aggregationType?: AggregationType;
}

export const chartStyleSelectorData: ChartStyleSelectorData[] = [
  { label: 'Candle', value: ChartType.CANDLE, icon: icons.candles },
  { label: 'Bar', value: ChartType.BAR, icon: icons.bar },
  { label: 'Colored Bar', value: ChartType.COLORED_BAR, icon: icons.coloredBar },
  { label: 'Line', value: ChartType.LINE, icon: icons.line },
  { label: 'Vertex Line', value: ChartType.VERTEX_LINE, icon: icons.vertexLine },
  { label: 'Step', value: ChartType.STEP, icon: icons.step },
  { label: 'Mountain', value: ChartType.MOUNTAIN, icon: icons.mountain },
  { label: 'Baseline', value: ChartType.BASELINE, icon: icons.baseLine },
  { label: 'Hollow Candle', value: ChartType.HOLLOW_CANDLE, icon: icons.hollowCandle },
  { label: 'Volume Candle', value: ChartType.VOLUME_CANDLE, icon: icons.volumeCandle },
  {
    label: 'Colored HLC Bar',
    value: ChartType.COLORED_HLC,
    icon: icons.coloredHlcBar,
  },
  { label: 'Scatterplot', value: ChartType.SCATTERPLOT, icon: icons.scatterplot },
  { label: 'Histogram', value: ChartType.HISTOGRAM, icon: icons.histogram },

  { label: 'Kagi', value: ChartType.KAGI, aggregationType: AggregationType.KAGI, icon: icons.kagi },
  {
    label: 'Renko',
    value: ChartType.RENKO,
    aggregationType: AggregationType.RENKO,
    icon: icons.renko,
  },
  {
    label: 'Range Bars',
    value: ChartType.RANGE_BARS,
    aggregationType: AggregationType.RANGEBARS,
    icon: icons.rangeBars,
  },
  {
    label: 'Point & Figure',
    value: ChartType.PNDF,
    aggregationType: AggregationType.PANDF,
    icon: icons.pointAndFigure,
  },
] satisfies ChartStyleSelectorData[];
