import React from 'react';
import { SvgProps } from 'react-native-svg';

import { DrawingTool } from '~/model';

import Icons from '../../assets/icons';

export enum DrawingToolTags {
  text = 'text',
  statistics = 'statistics',
  technicals = 'technicals',
  fibonacci = 'fibonacci',
  markings = 'markings',
  lines = 'lines',
  favorites = 'favorites',
  all = '',
}

export interface DrawingItem {
  Icon: React.FC<SvgProps>;
  title: string;
  tags: DrawingToolTags[];
  name: DrawingTool;
  favorite?: boolean;
}

export const filters = [
  { name: 'All', value: DrawingToolTags.all },
  { name: 'Favorites', value: DrawingToolTags.favorites },
  { name: 'Text', value: DrawingToolTags.text },
  { name: 'Statistic', value: DrawingToolTags.statistics },
  { name: 'Technicals', value: DrawingToolTags.technicals },
  { name: 'Markings', value: DrawingToolTags.markings },
  { name: 'Fibonacci', value: DrawingToolTags.fibonacci },
  { name: 'Lines', value: DrawingToolTags.lines },
];

export const specialTools: DrawingItem[] = [
  {
    Icon: Icons.drawingTools.measure,
    tags: [],
    title: 'Measure',
    name: DrawingTool.MEASURE,
  },
];

export const drawingTools = [
  {
    Icon: Icons.drawingTools.annotation,
    tags: [DrawingToolTags.text],
    title: 'Annotation',
    name: DrawingTool.ANNOTATION,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.arrow,
    tags: [DrawingToolTags.markings],
    title: 'Arrow',
    name: DrawingTool.ARROW,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.averageLine,
    tags: [DrawingToolTags.statistics],
    title: 'Average Line',
    name: DrawingTool.AVERAGE_LINE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.callout,
    tags: [DrawingToolTags.text],
    title: 'Callout',
    name: DrawingTool.CALLOUT,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.channel,
    tags: [DrawingToolTags.lines],
    title: 'Channel',
    name: DrawingTool.CHANNEL,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.check,
    tags: [DrawingToolTags.markings],
    title: 'Check',
    name: DrawingTool.CHECK,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.continuosLine,
    tags: [DrawingToolTags.lines],
    title: 'Continuos',
    name: DrawingTool.CONTINUOUS_LINE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.cross,
    tags: [DrawingToolTags.markings],
    title: 'Cross',
    name: DrawingTool.CROSS,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.crossLine,
    tags: [DrawingToolTags.lines],
    title: 'Cross Line',
    name: DrawingTool.CROSSLINE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.doodle,
    tags: [DrawingToolTags.lines],
    title: 'Doodle',
    name: DrawingTool.DOODLE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.elliotWave,
    tags: [DrawingToolTags.markings],
    title: 'Elliot Wave',
    name: DrawingTool.ELLIOTT_WAVE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.ellipse,
    tags: [DrawingToolTags.lines],
    title: 'Ellipse',
    name: DrawingTool.ELLIPSE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.fibonacciArc,
    tags: [DrawingToolTags.fibonacci],
    title: 'Fib Arc',
    name: DrawingTool.FIB_ARC,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.fibonacciFan,
    tags: [DrawingToolTags.fibonacci],
    title: 'Fib Fan',
    name: DrawingTool.FIB_FAN,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.fibProjection,
    tags: [DrawingToolTags.fibonacci],
    title: 'Fib Projection',
    name: DrawingTool.FIB_PROJECTION,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.fibonacciRetracement,
    tags: [DrawingToolTags.fibonacci],
    title: 'Fib Retracement',
    name: DrawingTool.FIB_RETRACEMENT,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.fibonacciTimezone,
    tags: [DrawingToolTags.fibonacci],
    title: 'Fib Timezone',
    name: DrawingTool.FIB_TIME_ZONE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.focus,
    tags: [DrawingToolTags.markings],
    title: 'Focus',
    name: DrawingTool.FOCUS,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.gannFan,
    tags: [DrawingToolTags.technicals],
    title: 'Gann Fan',
    name: DrawingTool.GANN_FAN,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.gartley,
    tags: [DrawingToolTags.technicals],
    title: 'Gartley',
    name: DrawingTool.GARTLEY,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.heart,
    tags: [DrawingToolTags.markings],
    title: 'Heart',
    name: DrawingTool.HEART,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.pitchfork,
    tags: [DrawingToolTags.technicals],
    title: 'Pitchfork',
    name: DrawingTool.PITCHFORK,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.quadrantLines,
    tags: [DrawingToolTags.statistics],
    title: 'Quadrant Lines',
    name: DrawingTool.QUADRANT_LINES,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.ray,
    tags: [DrawingToolTags.lines],
    title: 'Ray',
    name: DrawingTool.RAY,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.rectangle,
    tags: [DrawingToolTags.markings],
    title: 'Rectangle',
    name: DrawingTool.RECTANGLE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.regressionLine,
    tags: [DrawingToolTags.statistics],
    title: 'Regression Line',
    name: DrawingTool.REGRESSION_LINE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.segment,
    tags: [DrawingToolTags.lines],
    title: 'Segment',
    name: DrawingTool.SEGMENT,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.speedResistanceArc,
    tags: [DrawingToolTags.technicals],
    title: 'Speed Resistance Arc',
    name: DrawingTool.SPEED_RESISTANCE_ARC,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.speedResistanceLine,
    tags: [DrawingToolTags.technicals],
    title: 'Speed Resistance Line',
    name: DrawingTool.SPEED_RESISTANCE_LINE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.star,
    tags: [DrawingToolTags.markings],
    title: 'Star',
    name: DrawingTool.STAR,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.timeCycle,
    tags: [DrawingToolTags.technicals],
    title: 'Time Cycle',
    name: DrawingTool.TIME_CYCLE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.trioneLevel,
    tags: [DrawingToolTags.statistics],
    title: 'Tirone Level',
    name: DrawingTool.TIRONE_LEVELS,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.trendLine,
    tags: [DrawingToolTags.text],
    title: 'Trend Line',
    name: DrawingTool.TREND_LINE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.horizontalLine,
    tags: [DrawingToolTags.lines],
    title: 'Horizontal',
    name: DrawingTool.HORIZONTAL_LINE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.verticalLine,
    tags: [DrawingToolTags.lines],
    title: 'Vertical',
    name: DrawingTool.VERTICAL_LINE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.line,
    tags: [DrawingToolTags.lines],
    title: 'Line',
    name: DrawingTool.LINE,
  } as DrawingItem,
  {
    Icon: Icons.drawingTools.volumeProfile,
    tags: [DrawingToolTags.statistics],
    title: 'Volume Profile',
    name: DrawingTool.VOLUME_PROFILE,
  } as DrawingItem,
] as const;
