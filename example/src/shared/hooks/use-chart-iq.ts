import React, { useCallback } from 'react';
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
  enableCrosshairs,
  disableCrosshairs,
  getSymbol,
  getChartType,
  getChartAggregationType,
  getPeriodicity,
  getActiveSeries,
  disableDrawing,
} from 'react-native-chart-iq-wrapper';
import { useSharedValue } from 'react-native-reanimated';

import { ChartIQDatafeedParams, ChartQuery, ChartSymbol, fetchDataFeedAsync } from '~/api';
import { colorPickerColors } from '~/constants';
import { CrosshairSharedValues, CrosshairState, DrawingTool } from '~/model';
import { BottomSheetMethods } from '~/ui/bottom-sheet';
import {
  ChartStyleItem,
  chartStyleSelectorData,
} from '~/ui/chart-style-selector/chart-style-selector.data';
import { ColoredChartSymbol } from '~/ui/compare-symbol-selector/compare-symbol-selector.component';
import { DrawingItem } from '~/ui/drawing-tools-selector/drawing-tools-selector.data';
import { IntervalItem, intervals } from '~/ui/interval-selector/interval-selector.component';

import { useUpdateDrawingTool } from './use-update-drawing-tool';

type QuoteFeedEvent = { nativeEvent: { quoteFeedParam: string } };

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

  const drawingToolSelectorRef = React.useRef<BottomSheetMethods>(null);

  const { updateDrawingSettings, updateSupportedSettings } = useUpdateDrawingTool();

  const onPullInitialData = async ({ nativeEvent: { quoteFeedParam } }: QuoteFeedEvent) => {
    const parsed: ChartIQDatafeedParams = JSON.parse(quoteFeedParam);

    const response = await handleRequest(parsed);

    setInitialData(JSON.stringify(response));
  };

  const onPullUpdateData = async ({ nativeEvent: { quoteFeedParam } }: QuoteFeedEvent) => {
    const parsed: ChartIQDatafeedParams = JSON.parse(quoteFeedParam);
    const response = await handleRequest(parsed);

    if (!isCrosshairEnabled) {
      const last = response[response.length - 1];
      crosshair.Close.value = last?.Close?.toString() ?? crosshair.Close.value;
      crosshair.Open.value = last?.Open?.toString() ?? crosshair.Open.value;
      crosshair.High.value = last?.High?.toString() ?? crosshair.High.value;
      crosshair.Low.value = last?.Low?.toString() ?? crosshair.Low.value;
      crosshair.Vol.value = last?.Volume?.toString() ?? crosshair.Vol.value;
    }
    setUpdateData(JSON.stringify(response));
  };

  const onPullPagingData = async ({ nativeEvent: { quoteFeedParam } }: QuoteFeedEvent) => {
    const parsed: ChartIQDatafeedParams = JSON.parse(quoteFeedParam);
    const response = await handleRequest(parsed);
    setPagingData(JSON.stringify(response));
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

  const initChart = useCallback(async () => {
    const symbol = await getSymbol();
    if (!symbol) {
      setSymbol('AAPL');
    } else {
      setSymbol(symbol);
    }

    // const chartType = await getChartType();
    // handleChartTypeChanged(chartType);

    const periodicity = await getPeriodicity();
    const parsedPeriodicity = JSON.parse(periodicity);
    const interval = JSON.parse(parsedPeriodicity.interval);

    setInterval(
      intervals.find((item) => item.timeUnit.toLowerCase() === interval.toLowerCase()) ?? null,
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
    setTimeout(() => {
      initChart();
    }, 1000);
  }, [initChart]);

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

  const onHUDChanged = ({ nativeEvent: { hud } }: NativeSyntheticEvent<{ hud: string }>) => {
    const response: CrosshairState = JSON.parse(hud);

    crosshair.Close.value = response.close ?? crosshair.Close.value;
    crosshair.Open.value = response.open ?? crosshair.Open.value;
    crosshair.High.value = response.high ?? crosshair.High.value;
    crosshair.Low.value = response.low ?? crosshair.Low.value;
    crosshair.Vol.value = response.volume ?? crosshair.Vol.value;
    crosshair.Price.value = response.price ?? crosshair.Price.value;
  };

  const onMeasureChanged = ({
    nativeEvent: { measure },
  }: NativeSyntheticEvent<{ measure: string }>) => {
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

  const toggleDrawingToolSelector = () => {
    if (!isDrawing) {
      return drawingToolSelectorRef.current?.present();
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

    toggleCrosshair,
    toggleDrawingToolSelector,

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
    isDrawing,
    drawingItem,
    measureValue,
    crosshair,

    drawingToolSelectorRef,
  };
};
