import {
  Orientation,
  OrientationChangeEvent,
  addOrientationChangeListener,
  getOrientationAsync,
  removeOrientationChangeListeners,
} from 'expo-screen-orientation';
import React, { useCallback, useEffect } from 'react';
import { NativeSyntheticEvent } from 'react-native';
import {
  ChartIQ,
  OnMeasureChangeEvent,
  QuoteFeedEvent,
  ChartIQDatafeedParams,
  ChartQuery,
  ChartSymbol,
  DrawingTool,
} from 'react-native-chart-iq';
import { useSharedValue } from 'react-native-reanimated';

import { fetchDataFeedAsync, handleRetry } from '~/api';
import { findLineTypeItemByPatternAndWidth } from '~/assets/icons/line-types/line-types';
import { colorPickerColors } from '~/constants';
import { useTheme } from '~/theme';
import { BottomSheetMethods } from '~/ui/bottom-sheet';
import {
  ChartStyleSelectorData,
  candle,
  chartStyleSelectorData,
} from '~/ui/chart-style-selector/chart-style-selector.data';
import { ColoredChartSymbol } from '~/ui/compare-symbol-selector/compare-symbol-selector.component';
import { DrawingToolManagerMethods } from '~/ui/drawing-tool-manager/drawing-tool-manager.component';
import { DrawingItem } from '~/ui/drawing-tools-selector/drawing-tools-selector.data';
import { IntervalItem, intervals } from '~/ui/interval-selector/interval-selector.component';

import { useUpdateDrawingTool } from './use-update-drawing-tool';

const handleRequest = async (input: Omit<ChartIQDatafeedParams, 'id'>, session: string) => {
  const params = {
    identifier: input.symbol,
    enddate: input.end,
    startdate: input.start,
    interval: input.interval,
    period: input.period.toString(),
    extended: 1,
    session,
  } as ChartQuery;

  return await fetchDataFeedAsync(params);
};

export const useChartIQ = (session: string) => {
  const [initialized, setChartInitialized] = React.useState(false);
  const { isDark } = useTheme();
  const [symbol, setSymbol] = React.useState<null | string>(null);
  const [interval, setInterval] = React.useState<IntervalItem | null>(null);
  const [chartStyle, setChartStyle] = React.useState<ChartStyleSelectorData>(candle);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const drawingDisableByTap = React.useRef(false);
  const [isLandscape, setIsLandscape] = React.useState(false);
  const [isFullscreen, setIsFullScreen] = React.useState(false);
  const [compareSymbols, setCompareSymbols] = React.useState<Map<string, ColoredChartSymbol>>(
    new Map(),
  );
  const measureValue = useSharedValue('');

  const drawingToolSelectorRef = React.useRef<BottomSheetMethods>(null);

  const { updateDrawingTool } = useUpdateDrawingTool();

  const compareSymbolSelectorRef = React.useRef<BottomSheetMethods>(null);
  const drawingManagerRef = React.useRef<DrawingToolManagerMethods>(null);

  const toggleCompareSymbolSelector = () => {
    ChartIQ.getActiveSeries().then((activeSeries) => {
      const map = new Map();
      activeSeries.forEach((item) => {
        map.set(item.symbolName, {
          color: item.color,
          symbol: item.symbolName,
          description: '',
          funds: [],
        } as ColoredChartSymbol);
      });

      setCompareSymbols(map);
    });

    compareSymbolSelectorRef.current?.present('');
  };

  const onPullInitialData = async ({
    nativeEvent: {
      quoteFeedParam: { id, ...params },
    },
  }: QuoteFeedEvent) => {
    try {
      const response = await handleRequest(params, session);
      ChartIQ.setInitialData(response, id);
    } catch (e) {
      handleRetry(() => {
        onPullInitialData({
          nativeEvent: {
            quoteFeedParam: { id, ...params },
          },
        });
      });
    }
  };

  const onPullUpdateData = async ({
    nativeEvent: {
      quoteFeedParam: { id, ...params },
    },
  }: QuoteFeedEvent) => {
    try {
      const response = await handleRequest(params, session);

      ChartIQ.setUpdateData(response, id);
    } catch (e) {
      handleRetry(() => {
        onPullUpdateData({
          nativeEvent: {
            quoteFeedParam: { id, ...params },
          },
        });
      });
    }
  };

  const onPullPagingData = async ({
    nativeEvent: {
      quoteFeedParam: { id, ...params },
    },
  }: QuoteFeedEvent) => {
    try {
      const response = await handleRequest(params, session);
      ChartIQ.setPagingData(response, id);
    } catch (e) {
      handleRetry(() => {
        onPullPagingData({
          nativeEvent: {
            quoteFeedParam: { id, ...params },
          },
        });
      });
    }
  };

  const handleSymbolChange = ({ symbol }: ChartSymbol) => {
    setSymbol(symbol);
  };

  const handleIntervalChange = (input: IntervalItem) => {
    setInterval(input);
    ChartIQ.setPeriodicity(input.period, input.interval, input.timeUnit);
  };

  const handleChartStyleChange = useCallback((input: ChartStyleSelectorData) => {
    setChartStyle(input);
    if (input.aggregationType) {
      ChartIQ.setAggregationType(input.aggregationType);
      return;
    }
    ChartIQ.setChartType(input.value);
  }, []);

  const updateTheme = useCallback(() => {
    if (isDark) {
      ChartIQ.setTheme('night');
      return;
    } else {
      ChartIQ.setTheme('day');
    }
  }, [isDark]);

  const onChartAggregationTypeChanged: (
    event: NativeSyntheticEvent<{
      aggregationType: string;
    }>,
  ) => void = ({ nativeEvent: { aggregationType } }) => {
    const type: string | null = JSON.parse(aggregationType);

    if (!type) {
      return;
    }

    const aggregationItem = chartStyleSelectorData.find(
      (item) => item?.aggregationType && item?.aggregationType === type,
    );

    if (aggregationItem) {
      setChartStyle(aggregationItem);
    }
  };

  const addSymbol = (input: ColoredChartSymbol) => {
    setCompareSymbols((prevState) => {
      return new Map(prevState).set(input.symbol, {
        ...input,
        color: input.color,
      });
    });

    ChartIQ.addSeries(
      input.symbol,
      input.color ? input.color : colorPickerColors[0] ?? 'black',
      true,
    );
  };

  const removeSymbol = (input: ColoredChartSymbol) => {
    setCompareSymbols((prevState) => {
      const map = new Map(prevState);
      map.delete(input.symbol);
      return map;
    });
    ChartIQ.removeSeries(input.symbol);
  };

  const initChart = useCallback(async () => {
    updateTheme();
    setChartInitialized(true);
    const symbol = await ChartIQ.getSymbol();

    if (!symbol) {
      setSymbol('AAPL');
    } else {
      setSymbol(symbol);
    }

    const periodicity = await ChartIQ.getPeriodicity();

    const newInterval =
      [...intervals.first, ...intervals.second, ...intervals.third].find((item) => {
        return (
          item.timeUnit?.toLowerCase() === periodicity.timeUnit?.toLowerCase() &&
          item.period === periodicity.periodicity &&
          item.interval === periodicity.interval
        );
      }) ?? null;

    setInterval(newInterval);

    const activeSeries = await ChartIQ.getActiveSeries();

    const map = new Map();
    activeSeries.forEach((item) => {
      map.set(item.symbolName, {
        color: item.color,
        symbol: item.symbolName,
        description: '',
        funds: [],
      } as ColoredChartSymbol);
    });

    setCompareSymbols(map);

    const aggregationType = await ChartIQ.getChartAggregationType();
    const chartType = await ChartIQ.getChartType();

    const foundAggregation = chartStyleSelectorData.find(
      (chartType) => chartType?.aggregationType === aggregationType,
    );
    const foundChartType = chartStyleSelectorData.find(
      (type) => type?.value.toLowerCase() === chartType.toLowerCase(),
    );

    if (foundAggregation) {
      setChartStyle((prevState) => {
        return foundAggregation ?? prevState;
      });
      handleChartStyleChange(foundAggregation);
      return;
    }

    if (foundChartType) {
      setChartStyle((prevState) => {
        return foundChartType ?? prevState;
      });
    }
  }, [handleChartStyleChange, updateTheme]);

  useEffect(() => {
    if (initialized) updateTheme();
  }, [initialized, updateTheme]);

  const handleChartTypeChanged = (chartType: string) => {
    const newChartType = chartStyleSelectorData.find(
      (item) => item.value.toLocaleLowerCase() === chartType.toLocaleLowerCase(),
    );

    if (newChartType) {
      setChartStyle(newChartType);
    }
  };

  const onChartTypeChanged = ({
    nativeEvent: { chartType },
  }: NativeSyntheticEvent<{ chartType: string }>) => {
    handleChartTypeChanged(chartType);
  };

  const onMeasureChanged = ({ nativeEvent: { measure } }: OnMeasureChangeEvent) => {
    measureValue.value = measure;
  };

  const onDrawingToolChanged = async (input: DrawingItem) => {
    drawingManagerRef.current?.loading(true);
    drawingManagerRef.current?.show();

    ChartIQ.enableDrawing(input.name);
    const params = await ChartIQ.getDrawingParams(input.name);
    const lineTypeItem = findLineTypeItemByPatternAndWidth(params.pattern, params.lineWidth);

    updateDrawingTool(input, params, lineTypeItem);
    drawingManagerRef.current?.loading(false);
    if (input.name === DrawingTool.NO_TOOL) {
      drawingManagerRef.current?.hide();
      return setIsDrawing(false);
    }

    setIsDrawing(true);
    setIsFullScreen(false);
  };

  const handleRestoreDrawingParams = async (tool: DrawingItem) => {
    ChartIQ.restoreDefaultDrawingConfig(tool.name, true);
    await onDrawingToolChanged(tool);
  };

  const toggleDrawingToolSelector = () => {
    if (!isDrawing) {
      return drawingToolSelectorRef.current?.present('');
    }
    drawingDisableByTap.current = true;
    setIsDrawing(false);
    drawingManagerRef.current?.hide();
    ChartIQ.disableDrawing();
  };

  const orientationCallback = React.useCallback((orientation: Orientation) => {
    const landscape =
      orientation === Orientation.LANDSCAPE_LEFT || orientation === Orientation.LANDSCAPE_RIGHT;
    if (landscape) {
      setIsLandscape(true);
    } else {
      setIsLandscape(false);
    }
  }, []);

  React.useEffect(() => {
    getOrientationAsync().then(orientationCallback);

    addOrientationChangeListener(({ orientationInfo: { orientation } }: OrientationChangeEvent) => {
      orientationCallback(orientation);
    });

    return () => {
      removeOrientationChangeListeners();
    };
  }, [orientationCallback]);

  useEffect(() => {
    if (isLandscape && !isDrawing && !drawingDisableByTap.current) {
      drawingDisableByTap.current = false;
      setIsFullScreen(true);
    } else {
      drawingDisableByTap.current = false;
      setIsFullScreen(false);
    }
  }, [isDrawing, isLandscape]);

  const toggleFullScreen = () => {
    setIsFullScreen((prevState) => {
      if (!prevState) {
        setIsDrawing(false);
        drawingManagerRef.current?.hide();
        ChartIQ.disableDrawing();
      }
      return !prevState;
    });
  };

  return {
    onChartTypeChanged,
    onMeasureChanged,
    onPullInitialData,
    onPullUpdateData,
    onPullPagingData,
    onDrawingToolChanged,
    onChartAggregationTypeChanged,

    toggleDrawingToolSelector,
    toggleCompareSymbolSelector,
    toggleFullScreen,

    removeSymbol,
    addSymbol,

    handleSymbolChange,
    handleIntervalChange,
    handleChartStyleChange,
    handleRestoreDrawingParams,

    symbol,
    interval,
    chartStyle,
    compareSymbols,
    isDrawing,
    measureValue,
    isLandscape,
    isFullscreen,

    drawingToolSelectorRef,
    compareSymbolSelectorRef,
    drawingManagerRef,

    initialized,
    initChart,
  };
};
