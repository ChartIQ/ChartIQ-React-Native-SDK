/**
 * Needs to determine the type of chart to be displayed.
 * @example
 * ```typescript
  ChartIQ.setChartType(ChartType.CANDLE);
 * ```
 */
export enum ChartType {
  CANDLE = 'Candle',
  BAR = 'Bar',
  COLORED_BAR = 'Colored Bar',
  LINE = 'Line',
  VERTEX_LINE = 'Vertex Line',
  STEP = 'Step',
  MOUNTAIN = 'Mountain',
  BASELINE = 'Baseline',
  HOLLOW_CANDLE = 'Hollow Candle',
  VOLUME_CANDLE = 'Volume Candle',
  COLORED_HLC = 'Colored HLC Bar',
  SCATTERPLOT = 'Scatterplot',
  HISTOGRAM = 'Histogram',

  KAGI = 'Kagi',
  RENKO = 'Renko',
  RANGE_BARS = 'Range Bars',
  PNDF = 'Point & Figure',
  None = 'None',
}

/**
 * Needs to determine the type of chart aggregation to be displayed.
 * @example
 * ```typescript
 * ChartIQ.setAggregationType(AggregationType.HEIKINASHI);
 * ```
 */
export enum AggregationType {
  HEIKINASHI = 'Heikin Ashi',
  KAGI = 'Kagi',
  LINEBREAK = 'Line Break',
  RENKO = 'Renko',
  RANGEBARS = 'Range Bars',
  PANDF = 'Point & Figure',
}
