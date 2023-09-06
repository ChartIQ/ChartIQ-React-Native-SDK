import React from 'react';
import { ChartType, AggregationType } from 'react-native-chartiq';
import { SvgProps } from 'react-native-svg';

import icons from '../../assets/icons';

export interface ChartStyleSelectorProps {
  onChange: (interval: ChartStyleSelectorData) => void;
}

export interface ChartStyleSelectorData {
  label: string;
  value: ChartType;
  icon: React.FC<SvgProps>;
  aggregationType?: AggregationType;
}

export const candle: ChartStyleSelectorData = {
  label: 'Candle',
  value: ChartType.CANDLE,
  icon: icons.candles,
};

export const chartStyleSelectorData: Readonly<ChartStyleSelectorData[]> = [
  candle,
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
  {
    label: 'Heikin Ashi',
    value: ChartType.None,
    aggregationType: AggregationType.HEIKINASHI,
    icon: icons.heikinAshi,
  },
  { label: 'Kagi', value: ChartType.None, aggregationType: AggregationType.KAGI, icon: icons.kagi },
  {
    label: 'Line Break',
    value: ChartType.None,
    aggregationType: AggregationType.LINEBREAK,
    icon: icons.lineBreak,
  },

  {
    label: 'Renko',
    value: ChartType.None,
    aggregationType: AggregationType.RENKO,
    icon: icons.renko,
  },
  {
    label: 'Range Bars',
    value: ChartType.None,
    aggregationType: AggregationType.RANGEBARS,
    icon: icons.rangeBars,
  },
  {
    label: 'Point & Figure',
    value: ChartType.None,
    aggregationType: AggregationType.PANDF,
    icon: icons.pointAndFigure,
  },
] as const;
