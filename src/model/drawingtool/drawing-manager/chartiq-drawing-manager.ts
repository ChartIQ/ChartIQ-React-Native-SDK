import { lineTypePickerData } from '~/assets/icons/line-types/line-types';

import { DrawingTool } from '../../../enums/drawings/drawingtools';

import { DrawingManager } from './drawing-manager';

export type SupportedSettings = {
  supportingFillColor: boolean;
  supportingLineColor: boolean;
  supportingLineType: boolean;
  supportingSettings: boolean;
  supportingFont: boolean;
  supportingAxisLabel: boolean;
  supportingDeviations: boolean;
  supportingFibonacci: boolean;
  supportingElliottWave: boolean;
  supportingVolumeProfile: boolean;
};

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
    if (drawingTool === DrawingTool.NO_TOOL) {
      return false;
    }

    return true;
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
    if (drawingTool === DrawingTool.ELLIOTT_WAVE) {
      return true;
    }

    return false;
  }
  isSupportingVolumeProfile(drawingTool: DrawingTool): boolean {
    if (drawingTool === DrawingTool.VOLUME_PROFILE) {
      return true;
    }

    return false;
  }

  getAvailableDrawingTools(drawingTool: DrawingTool): SupportedSettings {
    const supportingFillColor = this.isSupportingFillColor(drawingTool);
    const supportingLineColor = this.isSupportingLineColor(drawingTool);
    const supportingLineType = this.isSupportingLineType(drawingTool);
    const supportingSettings = this.isSupportingSettings(drawingTool);
    const supportingFont = this.isSupportingFont(drawingTool);
    const supportingAxisLabel = this.isSupportingAxisLabel(drawingTool);
    const supportingDeviations = this.isSupportingDeviations(drawingTool);
    const supportingFibonacci = this.isSupportingFibonacci(drawingTool);
    const supportingElliottWave = this.isSupportingElliottWave(drawingTool);
    const supportingVolumeProfile = this.isSupportingVolumeProfile(drawingTool);

    return {
      supportingFillColor,
      supportingLineColor,
      supportingLineType,
      supportingSettings,
      supportingFont,
      supportingAxisLabel,
      supportingDeviations,
      supportingFibonacci,
      supportingElliottWave,
      supportingVolumeProfile,
    };
  }

  findLineTypeItemByPatternAndWidth = (pattern: string, width: number) => {
    return lineTypePickerData.find(
      (item) => item.value === pattern && item.lineWidth === width
    );
  };
}
