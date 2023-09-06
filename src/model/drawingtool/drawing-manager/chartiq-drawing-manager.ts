import { DrawingTool } from '../../../enums/drawings/drawingtools';
import { SupportedSettings } from '../../../interfaces';

import { DrawingManager } from './drawing-manager';

export class ChartIQDrawingManager implements DrawingManager {
  isSupportingFillColor(drawingTool: DrawingTool): boolean {
    switch (drawingTool) {
      case DrawingTool.ARROW:
      case DrawingTool.CHANNEL:
      case DrawingTool.CALLOUT:
      case DrawingTool.CHECK:
      case DrawingTool.CROSS:
      case DrawingTool.ELLIPSE:
      case DrawingTool.FIB_ARC:
      case DrawingTool.FIB_FAN:
      case DrawingTool.FIB_PROJECTION:
      case DrawingTool.FIB_RETRACEMENT:
      case DrawingTool.FIB_TIME_ZONE:
      case DrawingTool.FOCUS:
      case DrawingTool.GANN_FAN:
      case DrawingTool.GARTLEY:
      case DrawingTool.HEART:
      case DrawingTool.QUADRANT_LINES:
      case DrawingTool.RECTANGLE:
      case DrawingTool.SPEED_RESISTANCE_ARC:
      case DrawingTool.SPEED_RESISTANCE_LINE:
      case DrawingTool.STAR:
      case DrawingTool.TIME_CYCLE:
      case DrawingTool.TIRONE_LEVELS:
      case DrawingTool.TREND_LINE:
        return true;
      default:
        return false;
    }
  }
  isSupportingLineColor(drawingTool: DrawingTool): boolean {
    return drawingTool !== DrawingTool.NO_TOOL;
  }
  isSupportingLineType(drawingTool: DrawingTool): boolean {
    switch (drawingTool) {
      case DrawingTool.ANNOTATION:
      case DrawingTool.NO_TOOL:
        return false;
      default:
        return true;
    }
  }
  isSupportingSettings(drawingTool: DrawingTool): boolean {
    switch (drawingTool) {
      case DrawingTool.NO_TOOL:
      case DrawingTool.MEASURE:
        return false;
      default:
        return true;
    }
  }
  isSupportingFont(drawingTool: DrawingTool): boolean {
    switch (drawingTool) {
      case DrawingTool.ANNOTATION:
      case DrawingTool.CALLOUT:
      case DrawingTool.ELLIOTT_WAVE:
      case DrawingTool.TREND_LINE:
        return true;
      default:
        return false;
    }
  }
  isSupportingAxisLabel(drawingTool: DrawingTool): boolean {
    switch (drawingTool) {
      case DrawingTool.AVERAGE_LINE:
      case DrawingTool.CROSSLINE:
      case DrawingTool.HORIZONTAL_LINE:
      case DrawingTool.VERTICAL_LINE:
        return true;
      default:
        return false;
    }
  }
  isSupportingDeviations(drawingTool: DrawingTool): boolean {
    switch (drawingTool) {
      case DrawingTool.AVERAGE_LINE:
      case DrawingTool.REGRESSION_LINE:
        return true;
      default:
        return false;
    }
  }
  isSupportingFibonacci(drawingTool: DrawingTool): boolean {
    switch (drawingTool) {
      case DrawingTool.FIB_ARC:
      case DrawingTool.FIB_FAN:
      case DrawingTool.FIB_PROJECTION:
      case DrawingTool.FIB_RETRACEMENT:
        return true;
      default:
        return false;
    }
  }
  isSupportingElliottWave(drawingTool: DrawingTool): boolean {
    return drawingTool === DrawingTool.ELLIOTT_WAVE;
  }
  isSupportingVolumeProfile(drawingTool: DrawingTool): boolean {
    return drawingTool === DrawingTool.VOLUME_PROFILE;
  }

  getAvailableDrawingTools(drawingTool: DrawingTool): SupportedSettings {
    return {
      supportingFillColor: this.isSupportingFillColor(drawingTool),
      supportingLineColor: this.isSupportingLineColor(drawingTool),
      supportingLineType: this.isSupportingLineType(drawingTool),
      supportingSettings: this.isSupportingSettings(drawingTool),
      supportingFont: this.isSupportingFont(drawingTool),
      supportingAxisLabel: this.isSupportingAxisLabel(drawingTool),
      supportingDeviations: this.isSupportingDeviations(drawingTool),
      supportingFibonacci: this.isSupportingFibonacci(drawingTool),
      supportingElliottWave: this.isSupportingElliottWave(drawingTool),
      supportingVolumeProfile: this.isSupportingVolumeProfile(drawingTool),
    };
  }
}
