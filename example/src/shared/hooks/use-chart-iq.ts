import React, { useCallback, useEffect } from 'react';
import { NativeSyntheticEvent } from 'react-native';
import {
  enableDrawing,
  getDrawingParams,
  setInitialData,
  setPagingData,
  setUpdateData,
  addSeries,
  setSymbol as setChartSymbol,
  setPeriodicity,
  setAggregationType,
  setChartType,
  removeSeries,
  getSymbol,
  getChartType,
  getChartAggregationType,
  getPeriodicity,
  getActiveSeries,
  QuoteFeedEvent,
  disableDrawing,
  setTheme,
  OnMeasureChangeEvent,
  OnHudChangeEvent,
  restoreDefaultDrawingConfig,
} from 'react-native-chart-iq-wrapper';
import { useSharedValue } from 'react-native-reanimated';

import {
  ChartIQDatafeedParams,
  ChartQuery,
  ChartSymbol,
  fetchDataFeedAsync,
  handleRetry,
} from '~/api';
import { colorPickerColors } from '~/constants';
import { CrosshairSharedValues, DrawingTool } from '~/model';
import { useTheme } from '~/theme';
import { BottomSheetMethods } from '~/ui/bottom-sheet';
import {
  ChartStyleItem,
  chartStyleSelectorData,
} from '~/ui/chart-style-selector/chart-style-selector.data';
import { ColoredChartSymbol } from '~/ui/compare-symbol-selector/compare-symbol-selector.component';
import { DrawingItem } from '~/ui/drawing-tools-selector/drawing-tools-selector.data';
import { IntervalItem, intervals } from '~/ui/interval-selector/interval-selector.component';

import { useUpdateDrawingTool } from './use-update-drawing-tool';

const handleRequest = async (input: Omit<ChartIQDatafeedParams, 'id'>) => {
  const params = {
    identifier: input.symbol,
    enddate: input.end,
    startdate: input.start,
    interval: input.interval,
    period: input.period.toString(),
    session,
  } as ChartQuery;

  return await fetchDataFeedAsync(params);
};

const session = 'test-session-id//aldnsalfkjnsalkdfjnaslkdjfna';

export const useChartIQ = () => {
  const [initialized, setChartInitialized] = React.useState(false);
  const { isDark } = useTheme();
  const [symbol, setSymbol] = React.useState<null | string>(null);
  const [interval, setInterval] = React.useState<IntervalItem | null>(null);
  const [chartStyle, setChartStyle] = React.useState<ChartStyleItem>(chartStyleSelectorData[0]);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [drawingItem, setDrawingItem] = React.useState<DrawingItem | null>(null);
  const [compareSymbols, setCompareSymbols] = React.useState<Map<string, ColoredChartSymbol>>(
    new Map(),
  );
  const measureValue = useSharedValue('');

  const drawingToolSelectorRef = React.useRef<BottomSheetMethods>(null);

  const { updateDrawingSettings, updateSupportedSettings } = useUpdateDrawingTool();

  const compareSymbolSelectorRef = React.useRef<BottomSheetMethods>(null);

  const toggleCompareSymbolSelector = () => {
    getActiveSeries().then((activeSeries) => {
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
      const response = await handleRequest(params);
      setInitialData(response, id);
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
      const response = await handleRequest(params);

      const last = response[response.length - 1];
      crosshair.Close.value = last?.Close?.toString() ?? crosshair.Close.value;
      crosshair.Open.value = last?.Open?.toString() ?? crosshair.Open.value;
      crosshair.High.value = last?.High?.toString() ?? crosshair.High.value;
      crosshair.Low.value = last?.Low?.toString() ?? crosshair.Low.value;
      crosshair.Vol.value = last?.Volume?.toString() ?? crosshair.Vol.value;

      setUpdateData(response, id);
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
      const response = await handleRequest(params);
      setPagingData(response, id);
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
    setChartSymbol(symbol);
  };

  const handleIntervalChange = (input: IntervalItem) => {
    setInterval(input);
    setPeriodicity(input.period, input.interval, input.timeUnit);
  };

  const handleChartStyleChange = useCallback((input: ChartStyleItem) => {
    setChartStyle(input);
    if (input.aggregationType) {
      setAggregationType(input.aggregationType);
      return;
    }
    setChartType(input.value);
  }, []);

  const updateTheme = useCallback(() => {
    if (isDark) {
      setTheme('night');
      return;
    } else {
      setTheme('day');
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

    addSeries(input.symbol, input.color ? input.color : colorPickerColors[0] ?? 'black', true);
  };

  const removeSymbol = (input: ColoredChartSymbol) => {
    setCompareSymbols((prevState) => {
      const map = new Map(prevState);
      map.delete(input.symbol);
      return map;
    });
    removeSeries(input.symbol);
  };

  const initChart = useCallback(async () => {
    setChartInitialized(true);
    const symbol = await getSymbol();

    if (!symbol) {
      setSymbol('AAPL');
    } else {
      setSymbol(symbol);
    }

    const periodicity = await getPeriodicity();

    const newInterval =
      intervals.find((item) => {
        return (
          item.timeUnit?.toLowerCase() === periodicity.timeUnit?.toLowerCase() &&
          item.period === periodicity.periodicity &&
          item.interval === periodicity.interval
        );
      }) ?? null;

    setInterval(newInterval);

    const activeSeries = await getActiveSeries();

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

    updateTheme();

    const aggregationType = await getChartAggregationType();
    const chartType = await getChartType();

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

  const crosshair: CrosshairSharedValues = {
    Price: useSharedValue<string>('0'),
    Open: useSharedValue<string>('0'),
    Close: useSharedValue<string>('0'),
    Vol: useSharedValue<string>('0'),
    High: useSharedValue<string>('0'),
    Low: useSharedValue<string>('0'),
  };
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

  const onHUDChanged = ({ nativeEvent: { hud } }: OnHudChangeEvent) => {
    crosshair.Close.value = hud.close ?? crosshair.Close.value;
    crosshair.Open.value = hud.open ?? crosshair.Open.value;
    crosshair.High.value = hud.high ?? crosshair.High.value;
    crosshair.Low.value = hud.low ?? crosshair.Low.value;
    crosshair.Vol.value = hud.volume ?? crosshair.Vol.value;
    crosshair.Price.value = hud.price ?? crosshair.Price.value;
  };

  const onMeasureChanged = ({ nativeEvent: { measure } }: OnMeasureChangeEvent) => {
    measureValue.value = measure;
  };

  const onDrawingToolChanged = async (input: DrawingItem) => {
    enableDrawing(input.name);
    const params = await getDrawingParams(input.name);

    updateDrawingSettings(() => params);

    updateSupportedSettings(input.name);
    setDrawingItem(input);
    if (input.name === DrawingTool.NO_TOOL) {
      return setIsDrawing(false);
    }

    setIsDrawing(true);
  };

  const handleRestoreDrawingParams = async (tool: DrawingTool) => {
    await restoreDefaultDrawingConfig(tool, true);
    await enableDrawing(tool);
    const params = await getDrawingParams(tool);
    updateDrawingSettings(() => params);

    if (tool === DrawingTool.NO_TOOL) {
      disableDrawing();
      return setIsDrawing(false);
    }
  };

  const toggleDrawingToolSelector = () => {
    if (!isDrawing) {
      return drawingToolSelectorRef.current?.present('');
    }
    setIsDrawing(false);
    setDrawingItem(null);
    disableDrawing();
  };

  return {
    onChartTypeChanged,
    onHUDChanged,
    onMeasureChanged,
    onPullInitialData,
    onPullUpdateData,
    onPullPagingData,
    onDrawingToolChanged,
    onChartAggregationTypeChanged,

    toggleDrawingToolSelector,
    toggleCompareSymbolSelector,

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
    drawingItem,
    measureValue,
    crosshair,

    drawingToolSelectorRef,
    compareSymbolSelectorRef,

    initialized,
    initChart,
  };
};
