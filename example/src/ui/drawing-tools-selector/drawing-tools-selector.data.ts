import React from 'react';
import { SvgProps } from 'react-native-svg';

import Icons from '../../assets/icons';
import { DrawingTool } from '~/model';

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

export const drawingTools: DrawingItem[] = [
  {
    Icon: Icons.drawingTools.annotation,
    tags: [DrawingToolTags.text],
    title: 'Annotation',
    name: DrawingTool.ANNOTATION,
  },
  {
    Icon: Icons.drawingTools.arrow,
    tags: [DrawingToolTags.markings],
    title: 'Arrow',
    name: DrawingTool.ARROW,
  },
  {
    Icon: Icons.drawingTools.averageLine,
    tags: [DrawingToolTags.statistics],
    title: 'Average Line',
    name: DrawingTool.AVERAGE_LINE,
  },
  {
    Icon: Icons.drawingTools.callout,
    tags: [DrawingToolTags.text],
    title: 'Callout',
    name: DrawingTool.CALLOUT,
  },
  {
    Icon: Icons.drawingTools.channel,
    tags: [DrawingToolTags.lines],
    title: 'Channel',
    name: DrawingTool.CHANNEL,
  },
  {
    Icon: Icons.drawingTools.check,
    tags: [DrawingToolTags.markings],
    title: 'Check',
    name: DrawingTool.CHECK,
  },
  {
    Icon: Icons.drawingTools.continuosLine,
    tags: [DrawingToolTags.lines],
    title: 'Continuos',
    name: DrawingTool.CONTINUOUS_LINE,
  },
  {
    Icon: Icons.drawingTools.cross,
    tags: [DrawingToolTags.markings],
    title: 'Cross',
    name: DrawingTool.CROSS,
  },
  {
    Icon: Icons.drawingTools.crossLine,
    tags: [DrawingToolTags.lines],
    title: 'Cross Line',
    name: DrawingTool.CROSSLINE,
  },
  {
    Icon: Icons.drawingTools.doodle,
    tags: [DrawingToolTags.lines],
    title: 'Doodle',
    name: DrawingTool.DOODLE,
  },
  {
    Icon: Icons.drawingTools.elliotWave,
    tags: [DrawingToolTags.markings],
    title: 'Elliot Wave',
    name: DrawingTool.ELLIOTT_WAVE,
  },
  {
    Icon: Icons.drawingTools.ellipse,
    tags: [DrawingToolTags.lines],
    title: 'Ellipse',
    name: DrawingTool.ELLIPSE,
  },
  {
    Icon: Icons.drawingTools.fibonacciArc,
    tags: [DrawingToolTags.fibonacci],
    title: 'Fib Arc',
    name: DrawingTool.FIB_ARC,
  },
  {
    Icon: Icons.drawingTools.fibonacciFan,
    tags: [DrawingToolTags.fibonacci],
    title: 'Fib Fan',
    name: DrawingTool.FIB_FAN,
  },
  {
    Icon: Icons.drawingTools.fibonacciRetracement,
    tags: [DrawingToolTags.fibonacci],
    title: 'Fib Retracement',
    name: DrawingTool.FIB_RETRACEMENT,
  },
  {
    Icon: Icons.drawingTools.fibonacciTimezone,
    tags: [DrawingToolTags.fibonacci],
    title: 'Fib Timezone',
    name: DrawingTool.FIB_TIME_ZONE,
  },
  {
    Icon: Icons.drawingTools.focus,
    tags: [DrawingToolTags.markings],
    title: 'Focus',
    name: DrawingTool.FOCUS,
  },
  {
    Icon: Icons.drawingTools.gannFan,
    tags: [DrawingToolTags.technicals],
    title: 'Gann Fan',
    name: DrawingTool.GANN_FAN,
  },
  {
    Icon: Icons.drawingTools.gartley,
    tags: [DrawingToolTags.technicals],
    title: 'Gartley',
    name: DrawingTool.GARTLEY,
  },
  {
    Icon: Icons.drawingTools.heart,
    tags: [DrawingToolTags.markings],
    title: 'Heart',
    name: DrawingTool.HEART,
  },
  {
    Icon: Icons.drawingTools.pitchfork,
    tags: [DrawingToolTags.technicals],
    title: 'Pitchfork',
    name: DrawingTool.PITCHFORK,
  },
  {
    Icon: Icons.drawingTools.quadrantLines,
    tags: [DrawingToolTags.statistics],
    title: 'Quadrant Lines',
    name: DrawingTool.QUADRANT_LINES,
  },
  {
    Icon: Icons.drawingTools.ray,
    tags: [DrawingToolTags.lines],
    title: 'Ray',
    name: DrawingTool.RAY,
  },
  {
    Icon: Icons.drawingTools.rectangle,
    tags: [DrawingToolTags.markings],
    title: 'Rectangle',
    name: DrawingTool.RECTANGLE,
  },
  {
    Icon: Icons.drawingTools.regressionLine,
    tags: [DrawingToolTags.statistics],
    title: 'Regression Line',
    name: DrawingTool.REGRESSION_LINE,
  },
  {
    Icon: Icons.drawingTools.segment,
    tags: [DrawingToolTags.lines],
    title: 'Segment',
    name: DrawingTool.SEGMENT,
  },
  {
    Icon: Icons.drawingTools.speedResistanceArc,
    tags: [DrawingToolTags.technicals],
    title: 'Speed Resistance Arc',
    name: DrawingTool.SPEED_RESISTANCE_ARC,
  },
  {
    Icon: Icons.drawingTools.speedResistanceLine,
    tags: [DrawingToolTags.technicals],
    title: 'Speed Resistance Line',
    name: DrawingTool.SPEED_RESISTANCE_LINE,
  },
  {
    Icon: Icons.drawingTools.star,
    tags: [DrawingToolTags.markings],
    title: 'Star',
    name: DrawingTool.STAR,
  },
  {
    Icon: Icons.drawingTools.timeCycle,
    tags: [DrawingToolTags.technicals],
    title: 'Time Cycle',
    name: DrawingTool.TIME_CYCLE,
  },
  {
    Icon: Icons.drawingTools.trioneLevel,
    tags: [DrawingToolTags.statistics],
    title: 'Tirone Level',
    name: DrawingTool.TIRONE_LEVELS,
  },
  {
    Icon: Icons.drawingTools.trendLine,
    tags: [DrawingToolTags.text],
    title: 'Trend Line',
    name: DrawingTool.TREND_LINE,
  },
  {
    Icon: Icons.drawingTools.verticalLine,
    tags: [DrawingToolTags.lines],
    title: 'Vertical',
    name: DrawingTool.VERTICAL_LINE,
  },
  {
    Icon: Icons.drawingTools.volumeProfile,
    tags: [DrawingToolTags.statistics],
    title: 'Volume Profile',
    name: DrawingTool.VOLUME_PROFILE,
  },
];
