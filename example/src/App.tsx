import * as React from 'react';

import { KeyboardAvoidingView, NativeSyntheticEvent, Platform, StyleSheet } from 'react-native';
import {
  ChartIqWrapperView,
  setInitialData,
  setSymbol as setChartSymbol,
  setPeriodicity,
  enableCrosshairs,
  disableCrosshairs,
  setChartType,
  getChartType,
  addSeries,
  getSymbol,
  getPeriodicity,
  getActiveSeries,
  removeSeries,
  getChartAggregationType,
  setAggregationType,
} from 'react-native-chart-iq-wrapper';

import SymbolSelector, {
  SymbolSelectorMethods,
} from './ui/symbol-selector/symbol-selector.component';
import IntervalSelector, {
  IntervalItem,
  IntervalSelectorMethods,
  intervals,
} from './ui/interval-selector/interval-selector.component';
import {
  ChartStyleItem,
  ChartStyleSelectorMethods,
  chartStyleSelectorData,
} from './ui/chart-style-selector/chart-style-selector.data';
import CompareSymbolSelector, {
  ColoredChartSymbol,
  CompareSymbolSelectorMethods,
} from './ui/compare-symbol-selector/compare-symbol-selector.component';
import { DrawingToolSelectorMethods } from './ui/drawing-tools-selector/drawing-tools-selector.types';

import { useSharedValue } from 'react-native-reanimated';
import { ChartIQDatafeedParams, ChartQuery, ChartSymbol, fetchDataFeedAsync } from './api';
import { Header } from './ui/header';
import { ChartStyleSelector } from './ui/chart-style-selector';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawingItem } from './ui/drawing-tools-selector/drawing-tools-selector.data';

import { colorPickerColors } from './constants';

const session = 'test-session-id//aldnsalfkjnsalkdfjnaslkdjfna';

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

export default function App() {
  const [symbol, setSymbol] = React.useState<null | string>(null);
  const [interval, setInterval] = React.useState<IntervalItem | null>(null);
  const [chartStyle, setChartStyle] = React.useState<ChartStyleItem>(chartStyleSelectorData[0]);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [drawingItem, setDrawingItem] = React.useState<DrawingItem | null>(null);
  const [compareSymbols, setCompareSymbols] = React.useState<Map<string, ColoredChartSymbol>>(
    new Map(),
  );
  const [isCrosshairEnabled, setIsCrosshairEnabled] = React.useState(false);

  const onPullInitialData = async (event: QuoteFeedEvent) => {
    const parsed: ChartIQDatafeedParams = JSON.parse(event.nativeEvent.quoteFeedParam);

    const response = await handleRequest(parsed);

    setInitialData(JSON.stringify(response));
  };

  const onPullUpdateData = async (event: QuoteFeedEvent) => {
    const parsed: ChartIQDatafeedParams = JSON.parse(event.nativeEvent.quoteFeedParam);
    const response = await handleRequest(parsed);
    setInitialData(JSON.stringify(response));
  };

  const onPullPagingData = async (event: QuoteFeedEvent) => {
    const parsed: ChartIQDatafeedParams = JSON.parse(event.nativeEvent.quoteFeedParam);
    const response = await handleRequest(parsed);
    setInitialData(JSON.stringify(response));
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
    // if (!isDrawing) {
    //   return drawingToolSelectorRef.current?.open();
    // }
    // setIsDrawing(false);
    // setDrawingItem(null);
    // chartIqWebViewRef.current?.disableDrawing();
  };

  const handleSymbolChange = ({ symbol }: ChartSymbol) => {
    console.log('handleSymbolChange', symbol);
    setSymbol(symbol);
    setChartSymbol(symbol);
  };

  const handleIntervalChange = (input: IntervalItem) => {
    setInterval(input);

    setPeriodicity(input.period, input.interval, input.timeUnit);
  };

  const handleChartStyleChange = (input: ChartStyleItem) => {
    // setChartStyle(input);
    // chartIqWebViewRef.current?.setChartType(input.value);
    setChartStyle(input);
    if (input.aggregationType) {
      setAggregationType(input.aggregationType);
      return;
    }
    setChartType(input.value);
  };

  const addSymbol = (input: ColoredChartSymbol) => {
    setCompareSymbols((prevState) => {
      return new Map(prevState).set(input.symbol, {
        ...input,
        color: input.color ? input.color : colorPickerColors[0],
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
    // chartIqWebViewRef.current?.toggleCrosshair(nextState);
    setIsCrosshairEnabled(nextState);

    if (nextState) {
      enableCrosshairs();
      return;
    }

    disableCrosshairs();
  };

  const showDrawingToolsSelector = () => {
    // drawingToolSelectorRef.current?.open();
  };

  const initChart = async () => {
    const symbol = await getSymbol();
    setSymbol(symbol);

    const chartType = await getChartType();
    handleChartTypeChanged(chartType);

    const aggregationType = await getChartAggregationType();
    console.log({ aggregationType });
    const periodicity = await getPeriodicity();
    const parsedPeriodicity = JSON.parse(periodicity);
    const interval = JSON.parse(parsedPeriodicity.interval);
    setInterval(
      intervals.find((item) => item.timeUnit.toLowerCase() === interval.toLowerCase()) ?? null,
    );

    const activeSeries = await getActiveSeries();
    const map = new Map();
    console.log('getActiveSeries', { activeSeries });
    activeSeries.forEach((item) => {
      map.set(item.symbolName, {
        color: item.color,
        symbol: item.symbolName,
        description: '',
        funds: [],
      } as ColoredChartSymbol);
    });
    setCompareSymbols(map);
  };

  React.useEffect(() => {
    initChart();
  }, []);

  const crosshairStateValue = {
    open: useSharedValue('0'),
    high: useSharedValue('0'),
    low: useSharedValue('0'),
    close: useSharedValue('0'),
    volume: useSharedValue('0'),
    price: useSharedValue('0'),
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
    console.log('onChartTypeChanged', { chartType });
    handleChartTypeChanged(chartType);
  };

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 0}
        enabled={Platform.OS === 'ios' ? true : false}
      >
        <Header
          symbol={symbol}
          interval={interval?.label ?? null}
          chartStyle={chartStyle}
          isCrosshairEnabled={isCrosshairEnabled}
          handleSymbolSelector={toggleSymbolSelector}
          handleIntervalSelector={toggleIntervalSelector}
          handleChartStyleSelector={toggleChartStyleSelector}
          handleCompareSymbolSelector={toggleCompareSymbolSelector}
          handleDrawingTool={toggleDrawingToolSelector}
          handleCrosshair={toggleCrosshair}
          isDrawing={false}
          crosshairState={crosshairStateValue}
        />
        <ChartIqWrapperView
          onPullInitialData={onPullInitialData}
          onPullUpdateData={onPullUpdateData}
          onPullPagingData={onPullPagingData}
          onChartTypeChanged={onChartTypeChanged}
          style={styles.box}
        />
        <CompareSymbolSelector
          ref={compareSymbolSelectorRef}
          onAdd={addSymbol}
          onDelete={removeSymbol}
          data={compareSymbols}
        />
        <SymbolSelector onChange={handleSymbolChange} ref={symbolSelectorRef} />
        <IntervalSelector ref={intervalSelectorRef} onChange={handleIntervalChange} />
        <ChartStyleSelector ref={chartStyleSelectorRef} onChange={handleChartStyleChange} />
        {/* <DrawingToolSelector
        onChange={(input) => {
          chartIqWebViewRef.current?.enableDrawing(input.name);
          chartIqWebViewRef.current?.getDrawingParams(input.name);

          updateSupportedSettings(input.name);
          setDrawingItem(input);
          if (input.name === DrawingTool.NO_TOOL) {
            return setIsDrawing(false);
          }

          setIsDrawing(true);
        }}
        ref={drawingToolSelectorRef}
      /> */}
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
