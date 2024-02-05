import {
  Corrective,
  Decoration,
  DrawingSettings,
  DrawingTool,
  Impulse,
  SupportedSettings,
  Template,
} from 'react-native-chartiq';

import { LineTypeItem } from '~/assets/icons/line-types/line-types';

import lineTypes from '../../assets/icons/line-types';

import { DrawingAction } from './drawing-actions';
import { DrawingState } from './drawing-state.types';

export type Action = {
  type: DrawingAction;
  payload: DrawingState | DrawingSettings | DrawingTool | SupportedSettings | LineTypeItem | string;
};

export const drawingInitialState: DrawingState = {
  name: DrawingTool.NO_TOOL,
  title: '',
  drawingSettings: {
    color: 'auto',
    lineWidth: 1,
    fibs: [],
    fillColor: 'auto',
    font: {
      family: 'Arial',
      size: '12',
      style: 'normal',
      weight: 'normal',
    },
    pattern: 'solid',
    active1: false,
    active2: false,
    active3: false,
    axisLabel: false,
    color1: 'black',
    color2: 'black',
    color3: 'black',
    lineWidth1: 1,
    lineWidth2: 1,
    lineWidth3: 1,
    pattern1: 'solid',
    pattern2: 'solid',
    pattern3: 'solid',
    volumeProfile: {
      priceBuckets: 30,
    },
    waveParameters: {
      impulse: Impulse.ROMAN_CAPITAL,
      corrective: Corrective.ABC_CAPITAL,
      decoration: Decoration.ENCLOSED,
      template: Template.PRIMARY,
      showLines: true,
    },
    showCallout: false,
  },
  supportedSettings: {
    supportingAxisLabel: false,
    supportingDeviations: false,
    supportingElliottWave: false,
    supportingFibonacci: false,
    supportingFillColor: false,
    supportingFont: false,
    supportingLineColor: false,
    supportingLineType: false,
    supportingSettings: false,
    supportingVolumeProfile: false,
    supportCallout: false,
  },
  currentLineType: {
    name: 'solid',
    value: 'solid',
    lineWidth: 1,
    Icon: lineTypes.solid,
  },
};

export function drawingReducer(drawingState: DrawingState, action: Action) {
  switch (action.type) {
    case DrawingAction.SET_DRAWING_TOOL: {
      return {
        ...drawingState,
        ...(action.payload as DrawingState),
      };
    }
    case DrawingAction.SET_DRAWING_SETTINGS: {
      return {
        ...drawingState,
        drawingSettings: action.payload as DrawingSettings,
      };
    }
    case DrawingAction.SET_DRAWING_TITLE: {
      return {
        ...drawingState,
        title: action.payload as string,
      };
    }
    case DrawingAction.SET_DRAWING_SUPPORTED_SETTINGS: {
      return {
        ...drawingState,
        supportedSettings: action.payload as SupportedSettings,
      };
    }
    case DrawingAction.SET_DRAWING_LINE_TYPE_ITEM: {
      return {
        ...drawingState,
        currentLineType: action.payload as LineTypeItem,
      };
    }
    default: {
      return drawingState;
    }
  }
}
