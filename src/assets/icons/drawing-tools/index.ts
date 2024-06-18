import { DrawingTool } from '@chartiq/react-native-chartiq';

import Annotation from './annotation.svg';
import Arrow from './arrow.svg';
import AverageLine from './average-line.svg';
import Callout from './callout.svg';
import Channel from './channel.svg';
import Check from './check.svg';
import ContinuosLine from './continuous-line.svg';
import Cross from './cross.svg';
import CrossLine from './crossline.svg';
import Doodle from './doodle.svg';
import ElliotWave from './elliott-wave.svg';
import Ellipse from './ellipse.svg';
import FibonacciArc from './fib-arc.svg';
import FibonacciFan from './fib-fan.svg';
import FibonacciProjection from './fib-projection.svg';
import FibonacciRetracement from './fib-retracement.svg';
import FibonacciTimezone from './fib-time_zone.svg';
import Focus from './focus.svg';
import GannFan from './gann-fan.svg';
import Gartley from './gartley.svg';
import Heart from './heart.svg';
import HorizontalLine from './horizontal-line.svg';
import Line from './line.svg';
import Measure from './measure.svg';
import MeasurementLine from './measurement-line.svg';
import Pitchfork from './pitchfork.svg';
import QuadrantLines from './quadrant-lines.svg';
import Ray from './ray.svg';
import Rectangle from './rectangle.svg';
import RegressionLine from './regression-line.svg';
import Segment from './segment.svg';
import SpeedResistanceArc from './speed-resistance_arc.svg';
import SpeedResistanceLine from './speed-resistance_line.svg';
import Star from './star.svg';
import TimeCycle from './time-cycle.svg';
import TrioneLevel from './tirone-levels.svg';
import TrendLine from './trend-line.svg';
import VerticalLine from './vertical-line.svg';
import VolumeProfile from './volume-profile.svg';

const drawingTools = {
  [DrawingTool.ANNOTATION]: Annotation,
  [DrawingTool.ARROW]: Arrow,
  [DrawingTool.AVERAGE_LINE]: AverageLine,
  [DrawingTool.CALLOUT]: Callout,
  [DrawingTool.CHANNEL]: Channel,
  [DrawingTool.CHECK]: Check,
  [DrawingTool.CONTINUOUS_LINE]: ContinuosLine,
  [DrawingTool.CROSS]: Cross,
  [DrawingTool.CROSSLINE]: CrossLine,
  [DrawingTool.DOODLE]: Doodle,
  [DrawingTool.ELLIOTT_WAVE]: ElliotWave,
  [DrawingTool.ELLIPSE]: Ellipse,
  [DrawingTool.FIB_ARC]: FibonacciArc,
  [DrawingTool.FIB_FAN]: FibonacciFan,
  [DrawingTool.FIB_RETRACEMENT]: FibonacciRetracement,
  [DrawingTool.FIB_TIME_ZONE]: FibonacciTimezone,
  [DrawingTool.FOCUS]: Focus,
  [DrawingTool.GANN_FAN]: GannFan,
  [DrawingTool.GARTLEY]: Gartley,
  [DrawingTool.HEART]: Heart,
  [DrawingTool.HORIZONTAL_LINE]: HorizontalLine,
  [DrawingTool.MEASURE]: Measure,
  [DrawingTool.PITCHFORK]: Pitchfork,
  [DrawingTool.QUADRANT_LINES]: QuadrantLines,
  [DrawingTool.RAY]: Ray,
  [DrawingTool.RECTANGLE]: Rectangle,
  [DrawingTool.REGRESSION_LINE]: RegressionLine,
  [DrawingTool.SEGMENT]: Segment,
  [DrawingTool.SPEED_RESISTANCE_ARC]: SpeedResistanceArc,
  [DrawingTool.SPEED_RESISTANCE_LINE]: SpeedResistanceLine,
  [DrawingTool.STAR]: Star,
  [DrawingTool.TIME_CYCLE]: TimeCycle,
  [DrawingTool.TIRONE_LEVELS]: TrioneLevel,
  [DrawingTool.TREND_LINE]: TrendLine,
  [DrawingTool.VERTICAL_LINE]: VerticalLine,
  [DrawingTool.VOLUME_PROFILE]: VolumeProfile,
  [DrawingTool.FIB_PROJECTION]: FibonacciProjection,
  [DrawingTool.LINE]: Line,
  [DrawingTool.NO_TOOL]: Measure,
  [DrawingTool.MEASUREMENT_LINE]: MeasurementLine,
};

export default drawingTools;
