import {
  Orientation,
  OrientationChangeEvent,
  addOrientationChangeListener,
  getOrientationAsync,
  removeOrientationChangeListeners,
} from 'expo-screen-orientation';
import React, { useCallback } from 'react';
import { NativeSyntheticEvent } from 'react-native';
import {
  disableDrawing,
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
  enableCrosshairs,
  disableCrosshairs,
  getSymbol,
  getChartType,
  getChartAggregationType,
  getPeriodicity,
  getActiveSeries,
  QuoteFeedEvent,
} from 'react-native-chart-iq-wrapper';
import { set, useSharedValue } from 'react-native-reanimated';

import { ChartIQDatafeedParams, ChartQuery, ChartSymbol, fetchDataFeedAsync } from '~/api';
import { colorPickerColors } from '~/constants';
import { CrosshairSharedValues, CrosshairState, DrawingTool } from '~/model';
import {
  ChartStyleItem,
  ChartStyleSelectorMethods,
  chartStyleSelectorData,
} from '~/ui/chart-style-selector/chart-style-selector.data';
import {
  ColoredChartSymbol,
  CompareSymbolSelectorMethods,
} from '~/ui/compare-symbol-selector/compare-symbol-selector.component';
import { DrawingItem } from '~/ui/drawing-tools-selector/drawing-tools-selector.data';
import { DrawingToolSelectorMethods } from '~/ui/drawing-tools-selector/drawing-tools-selector.types';
import {
  IntervalItem,
  IntervalSelectorMethods,
  intervals,
} from '~/ui/interval-selector/interval-selector.component';
import { SymbolSelectorMethods } from '~/ui/symbol-selector/symbol-selector.component';

import { useUpdateDrawingTool } from './use-update-drawing-tool';

const handleRequest = async (input: ChartIQDatafeedParams) => {
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
  const [symbol, setSymbol] = React.useState<null | string>(null);
  const [interval, setInterval] = React.useState<IntervalItem | null>(null);
  const [chartStyle, setChartStyle] = React.useState<ChartStyleItem>(chartStyleSelectorData[0]);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [drawingItem, setDrawingItem] = React.useState<DrawingItem | null>(null);
  const [compareSymbols, setCompareSymbols] = React.useState<Map<string, ColoredChartSymbol>>(
    new Map(),
  );
  const [isCrosshairEnabled, setIsCrosshairEnabled] = React.useState(false);
  const measureValue = useSharedValue('');

  const [isFullscreen, setIsFullScreen] = React.useState(false);
  const [isLandscape, setIsLandscape] = React.useState(false);

  const { updateDrawingSettings, updateSupportedSettings } = useUpdateDrawingTool();

  const onPullInitialData = async ({ nativeEvent: { quoteFeedParam } }: QuoteFeedEvent) => {
    const parsed: ChartIQDatafeedParams = JSON.parse(quoteFeedParam);
    const response = await handleRequest(parsed);
    setInitialData(JSON.stringify(response));
  };

  const onPullUpdateData = async ({ nativeEvent: { quoteFeedParam } }: QuoteFeedEvent) => {
    const parsed: ChartIQDatafeedParams = JSON.parse(quoteFeedParam);
    const response = await handleRequest(parsed);
    setUpdateData(JSON.stringify(response));
  };

  const onPullPagingData = async ({ nativeEvent: { quoteFeedParam } }: QuoteFeedEvent) => {
    const parsed: ChartIQDatafeedParams = JSON.parse(quoteFeedParam);
    const response = await handleRequest(parsed);
    setPagingData(JSON.stringify(response));
  };

  const symbolSelectorRef = React.useRef<SymbolSelectorMethods>(null);
  const intervalSelectorRef = React.useRef<IntervalSelectorMethods>(null);
  const chartStyleSelectorRef = React.useRef<ChartStyleSelectorMethods>(null);
  const compareSymbolSelectorRef = React.useRef<CompareSymbolSelectorMethods>(null);
  const drawingToolSelectorRef = React.useRef<DrawingToolSelectorMethods>(null);

  const toggleSymbolSelector = () => {
    symbolSelectorRef.current?.open();
  };

  const toggleIntervalSelector = () => {
    intervalSelectorRef.current?.open();
  };

  const toggleChartStyleSelector = () => {
    chartStyleSelectorRef.current?.open();
  };

  const toggleCompareSymbolSelector = () => {
    compareSymbolSelectorRef.current?.open();
  };

  const toggleDrawingToolSelector = () => {
    if (!isDrawing) {
      return drawingToolSelectorRef.current?.open();
    }
    setIsDrawing(false);
    setDrawingItem(null);
    disableDrawing();
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

  const toggleCrosshair = (nextState: boolean) => {
    setIsCrosshairEnabled(nextState);

    if (nextState) {
      enableCrosshairs();
      return;
    }

    disableCrosshairs();
  };

  const showDrawingToolsSelector = () => {
    drawingToolSelectorRef.current?.open();
  };

  const initChart = useCallback(async () => {
    console.log('initChart');
    getSymbol()
      .then((symbol) => {
        setSymbol(symbol);
      })
      .catch(() => {
        setChartSymbol('AAPL');
        setSymbol('AAPL');
      });

    // const chartType = await getChartType();
    // handleChartTypeChanged(chartType);

    const periodicity = await getPeriodicity();
    console.log('periodicity', periodicity);
    // const parsedPeriodicity = JSON.parse(periodicity);
    // const interval = JSON.parse(periodicity.interval);
    setInterval(
      intervals.find(
        (item) => item.timeUnit.toLowerCase() === periodicity.timeUnit.toLowerCase(),
      ) ?? null,
    );

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

    const aggregationType = await getChartAggregationType();
    const chartType = await getChartType();
    const foundAggregation = chartStyleSelectorData.find(
      (chartType) => chartType?.aggregationType === aggregationType,
    );
    const foundChartType = chartStyleSelectorData.find(
      (type) => type?.value.toLocaleLowerCase() === chartType.toLocaleLowerCase(),
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
      handleChartStyleChange(foundChartType);
    }
  }, [handleChartStyleChange]);

  React.useEffect(() => {
    initChart();
  }, [initChart]);

  const crosshair: CrosshairSharedValues = {
    Close: useSharedValue<string>('0'),
    Open: useSharedValue<string>('0'),
    High: useSharedValue<string>('0'),
    Low: useSharedValue<string>('0'),
    Volume: useSharedValue<string>('0'),
    Price: useSharedValue<string>('0'),
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

  const onHUDChanged = ({ nativeEvent: { hud } }: NativeSyntheticEvent<{ hud: string }>) => {
    const response: CrosshairState = JSON.parse(hud);

    crosshair.Close.value = response.close ?? '0';
    crosshair.Open.value = response.open ?? '0';
    crosshair.High.value = response.high ?? '0';
    crosshair.Low.value = response.low ?? '0';
    crosshair.Volume.value = response.volume ?? '0';
    crosshair.Price.value = response.price ?? '0';
  };

  const onMeasureChanged = ({
    nativeEvent: { measure },
  }: NativeSyntheticEvent<{ measure: string }>) => {
    measureValue.value = measure;
  };

  React.useEffect(() => {
    const callback = (orientation: Orientation) => {
      setIsLandscape(
        orientation === Orientation.LANDSCAPE_LEFT || orientation === Orientation.LANDSCAPE_RIGHT,
      );
      drawingToolSelectorRef.current?.close();
      symbolSelectorRef.current?.close();
      intervalSelectorRef.current?.close();
      chartStyleSelectorRef.current?.close();
      compareSymbolSelectorRef.current?.close();
    };
    getOrientationAsync().then(callback);

    addOrientationChangeListener(({ orientationInfo: { orientation } }: OrientationChangeEvent) => {
      callback(orientation);
    });

    return () => {
      removeOrientationChangeListeners();
    };
  }, [setIsLandscape]);

  const toggleFullScreen = () => {
    setIsFullScreen((prevState) => {
      return !prevState;
    });
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

  return {
    onChartTypeChanged,
    onHUDChanged,
    onMeasureChanged,
    onPullInitialData,
    onPullUpdateData,
    onPullPagingData,
    onDrawingToolChanged,
    onChartAggregationTypeChanged,

    toggleSymbolSelector,
    toggleIntervalSelector,
    toggleChartStyleSelector,
    toggleCompareSymbolSelector,
    toggleDrawingToolSelector,
    showDrawingToolsSelector,
    toggleCrosshair,
    toggleFullScreen,

    removeSymbol,
    addSymbol,

    handleSymbolChange,
    handleIntervalChange,
    handleChartStyleChange,

    symbol,
    interval,
    chartStyle,
    compareSymbols,
    isCrosshairEnabled,
    isLandscape,
    isDrawing,
    drawingItem,
    measureValue,
    crosshair,
    isFullscreen,

    compareSymbolSelectorRef,
    symbolSelectorRef,
    intervalSelectorRef,
    chartStyleSelectorRef,
    drawingToolSelectorRef,
  };
};
