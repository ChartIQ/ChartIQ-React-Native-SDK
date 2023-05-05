import { ChartIQDrawingManager, DrawingSettings, DrawingTool } from '@chart-iq/chart-iq-sdk';
import { useContext, useRef } from 'react';

import { LineTypeItem } from '~/assets/icons/line-types/line-types';

import { DrawingActions } from '../../context/drawing-context/drawing-actions';
import {
  DrawingContext,
  DrawingDispatchContext,
} from '../../context/drawing-context/drawing.context';

export const useUpdateDrawingTool = () => {
  const drawingToolManager = useRef(new ChartIQDrawingManager());
  const { drawingSettings } = useContext(DrawingContext);
  const dispatch = useContext(DrawingDispatchContext);

  const updateDrawingSettings = (callback: (input: DrawingSettings) => DrawingSettings) => {
    dispatch(DrawingActions.setDrawingSettings(callback(drawingSettings)));
  };

  const updateSupportedSettings = (input: DrawingTool) => {
    dispatch(
      DrawingActions.setDrawingSupportedSettings(
        drawingToolManager.current.getAvailableDrawingTools(input),
      ),
    );
  };

  const updateLineColor = (color: string) => {
    dispatch(DrawingActions.setDrawingSettings({ ...drawingSettings, color }));
  };

  const updateFillColor = (fillColor: string) => {
    dispatch(DrawingActions.setDrawingSettings({ ...drawingSettings, fillColor }));
  };

  const updateLineType = (lineType: string) => {
    dispatch(DrawingActions.setDrawingSettings({ ...drawingSettings, pattern: lineType }));
  };
  const updateLineWidth = (lineWidth: number) => {
    dispatch(DrawingActions.setDrawingSettings({ ...drawingSettings, lineWidth }));
  };

  const updateLineTypeItem = (lineTypeItems: LineTypeItem) => {
    dispatch(DrawingActions.setDrawingLineTypeItem(lineTypeItems));
    updateLineType(lineTypeItems.value);
    updateLineWidth(lineTypeItems.lineWidth);
  };

  return {
    updateSupportedSettings,
    updateLineColor,
    updateFillColor,
    updateLineType,
    updateDrawingSettings,
    updateLineWidth,
    updateLineTypeItem,
  };
};
