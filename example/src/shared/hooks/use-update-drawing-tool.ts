import { useContext, useRef } from 'react';
import { ChartIQDrawingManager, DrawingSettings, DrawingTool } from 'react-native-chart-iq-wrapper';

import { LineTypeItem } from '~/assets/icons/line-types/line-types';
import { DrawingItem } from '~/ui/drawing-tools-selector/drawing-tools-selector.data';

import { DrawingActions } from '../../context/drawing-context/drawing-actions';
import {
  DrawingContext,
  DrawingDispatchContext,
} from '../../context/drawing-context/drawing.context';

export const useUpdateDrawingTool = () => {
  const drawingToolManager = useRef(new ChartIQDrawingManager());
  const { drawingSettings, currentLineType } = useContext(DrawingContext);
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

  const updateDrawingTool = (
    drawingTool: DrawingItem,
    params: DrawingSettings,
    line?: LineTypeItem,
  ) => {
    const settings = drawingToolManager.current.getAvailableDrawingTools(drawingTool.name);
    let lineItem =
      drawingToolManager.current.findLineTypeItemByPatternAndWidth(
        line?.value ?? '',
        line?.lineWidth ?? 1,
      ) ?? currentLineType;

    dispatch(
      DrawingActions.setDrawingTool({
        ...drawingSettings,
        currentLineType: lineItem,
        drawingSettings: params,
        name: drawingTool.name,
        supportedSettings: settings,
        title: drawingTool.title,
      }),
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

  const updateLineTypeItem = (lineTypeItem: LineTypeItem) => {
    dispatch(DrawingActions.setDrawingLineTypeItem(lineTypeItem));
    updateLineType(lineTypeItem.value);
    updateLineWidth(lineTypeItem.lineWidth);
  };

  return {
    updateSupportedSettings,
    updateLineColor,
    updateFillColor,
    updateLineType,
    updateDrawingSettings,
    updateLineWidth,
    updateLineTypeItem,
    updateDrawingTool,
  };
};
