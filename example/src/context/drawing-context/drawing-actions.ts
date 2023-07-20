import { DrawingSettings, SupportedSettings } from 'react-native-chart-iq';

import { LineTypeItem } from '~/assets/icons/line-types/line-types';

import { DrawingState } from './drawing-state.types';

export enum DrawingAction {
  SET_DRAWING_TOOL = 'SET_DRAWING_TOOL',
  SET_DRAWING_SETTINGS = 'SET_DRAWING_SETTINGS',
  SET_DRAWING_TITLE = 'SET_DRAWING_TITLE',
  SET_DRAWING_SUPPORTED_SETTINGS = 'SET_DRAWING_SUPPORTED_SETTINGS',
  SET_DRAWING_LINE_TYPE_ITEM = 'SET_DRAWING_LINE_TYPE_ITEM',
}

const setDrawingTool = (drawingState: DrawingState) => ({
  type: DrawingAction.SET_DRAWING_TOOL,
  payload: drawingState,
});

const setDrawingSettings = (drawingSettings: DrawingSettings) => {
  return {
    type: DrawingAction.SET_DRAWING_SETTINGS,
    payload: {
      ...drawingSettings,
      color: drawingSettings.color === 'auto' ? 'black' : drawingSettings.color,
      fillColor: drawingSettings.fillColor === 'auto' ? 'black' : drawingSettings.fillColor,
      pattern: drawingSettings.pattern ? 'solid' : drawingSettings.pattern,
    } as DrawingSettings,
  };
};

const setDrawingTitle = (title: string) => ({
  type: DrawingAction.SET_DRAWING_TITLE,
  payload: title,
});

const setDrawingSupportedSettings = (supportedSettings: SupportedSettings) => ({
  type: DrawingAction.SET_DRAWING_SUPPORTED_SETTINGS,
  payload: supportedSettings,
});

const setDrawingLineTypeItem = (lineTypeItem: LineTypeItem) => ({
  type: DrawingAction.SET_DRAWING_LINE_TYPE_ITEM,
  payload: lineTypeItem,
});

export const DrawingActions = {
  setDrawingTool,
  setDrawingSettings,
  setDrawingTitle,
  setDrawingSupportedSettings,
  setDrawingLineTypeItem,
};
