import React from 'react';
import { ChartType, AggregationType } from 'react-native-chart-iq-wrapper';
import { SvgProps } from 'react-native-svg';

import icons from '../../assets/icons';

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
  {
    label: 'Hekin Ashi',
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
] satisfies ChartStyleSelectorData[];
