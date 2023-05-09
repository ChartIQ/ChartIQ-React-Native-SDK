import * as React from 'react';
import * as Orientation from 'expo-screen-orientation';

import { NativeSyntheticEvent, StyleSheet, View, ViewStyle } from 'react-native';
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
  disableDrawing,
  enableDrawing,
  getDrawingParams,
} from 'react-native-chart-iq-wrapper';
import { useSharedValue } from 'react-native-reanimated';
import { ChartIQDatafeedParams, ChartQuery, ChartSymbol, fetchDataFeedAsync } from '../../api';
import IntervalSelector, {
  IntervalItem,
  IntervalSelectorMethods,
  intervals,
} from '../../ui/interval-selector/interval-selector.component';
import {
  ChartStyleItem,
  ChartStyleSelectorMethods,
  chartStyleSelectorData,
} from '../../ui/chart-style-selector/chart-style-selector.data';
import { DrawingItem } from '../../ui/drawing-tools-selector/drawing-tools-selector.data';
import CompareSymbolSelector, {
  ColoredChartSymbol,
  CompareSymbolSelectorMethods,
} from '../../ui/compare-symbol-selector/compare-symbol-selector.component';
import SymbolSelector, {
  SymbolSelectorMethods,
} from '../../ui/symbol-selector/symbol-selector.component';
import { DrawingToolSelectorMethods } from '../../ui/drawing-tools-selector/drawing-tools-selector.types';
import { colorPickerColors } from '../../constants';
import { CrosshairSharedValues, CrosshairState, DrawingTool } from '../../model';
import { DrawingToolSelector } from '../../ui/drawing-tools-selector';
import { ChartStyleSelector } from '../../ui/chart-style-selector';
import { DrawingToolManager } from '../../ui/drawing-tool-manager';
import { Header } from '../../ui/header';
import { useUpdateDrawingTool } from '../../shared/hooks/use-update-drawing-tool';
import { DrawingMeasure } from '~/ui/drawing-measure';
import FullScreenAnimatedButtonComponent from '~/ui/full-screen-animated-button/full-screen-animated-button.component';

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

export default function Root() {
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
  const { updateSupportedSettings, updateDrawingSettings } = useUpdateDrawingTool();
  const [isFullscreen, setIsFullScreen] = React.useState(false);
  const [isLandscape, setIsLandscape] = React.useState(false);

  const onPullInitialData = async (event: QuoteFeedEvent) => {
    console.log('onPullInitialData');
    const parsed: ChartIQDatafeedParams = JSON.parse(event.nativeEvent.quoteFeedParam);

    const response = await handleRequest(parsed);

    setInitialData(JSON.stringify(response));
  };

  const onPullUpdateData = async (event: QuoteFeedEvent) => {
    console.log('onPullUpdateData');

    const parsed: ChartIQDatafeedParams = JSON.parse(event.nativeEvent.quoteFeedParam);
    const response = await handleRequest(parsed);
    setInitialData(JSON.stringify(response));
  };

  const onPullPagingData = async (event: QuoteFeedEvent) => {
    console.log('onPullPagingData');

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
    console.log('toggleSymbolSelector');
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

  const handleChartStyleChange = (input: ChartStyleItem) => {
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
    // chartIqWebViewRef.current?.toggleCrosshair(nextState);
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

  const initChart = async () => {
    const symbol = await getSymbol();
    setSymbol(symbol);

    const chartType = await getChartType();
    handleChartTypeChanged(chartType);

    const aggregationType = await getChartAggregationType();
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
  };

  React.useEffect(() => {
    initChart();
  }, []);

  const crosshair: CrosshairSharedValues = {
    close: useSharedValue<string>('0'),
    open: useSharedValue<string>('0'),
    high: useSharedValue<string>('0'),
    low: useSharedValue<string>('0'),
    volume: useSharedValue<string>('0'),
    price: useSharedValue<string>('0'),
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
    console.log('onChartTypeChanged');
    handleChartTypeChanged(chartType);
  };

  const onHUDChanged = ({ nativeEvent: { hud } }: NativeSyntheticEvent<{ hud: string }>) => {
    console.log('onHUDChanged');
    const response: CrosshairState = JSON.parse(hud);

    crosshair.close.value = response.close ?? '0';
    crosshair.open.value = response.open ?? '0';
    crosshair.high.value = response.high ?? '0';
    crosshair.low.value = response.low ?? '0';
    crosshair.volume.value = response.volume ?? '0';
    crosshair.price.value = response.price ?? '0';
  };

  const onMeasureChanged = ({
    nativeEvent: { measure },
  }: NativeSyntheticEvent<{ measure: string }>) => {
    console.log('onMeasureChanged');
    measureValue.value = measure;
  };

  React.useEffect(() => {
    Orientation.getOrientationAsync().then((orientation) => {
      setIsLandscape(
        orientation === Orientation.Orientation.LANDSCAPE_LEFT ||
          orientation === Orientation.Orientation.LANDSCAPE_RIGHT,
      );
    });

    Orientation.addOrientationChangeListener(
      ({ orientationInfo: { orientation } }: Orientation.OrientationChangeEvent) => {
        setIsLandscape(
          orientation === Orientation.Orientation.LANDSCAPE_LEFT ||
            orientation === Orientation.Orientation.LANDSCAPE_RIGHT,
        );
      },
    );

    return () => {
      Orientation.removeOrientationChangeListeners();
    };
  }, [setIsLandscape]);

  const displayStyle: ViewStyle = { display: isFullscreen ? 'none' : 'flex' };

  return (
    <View style={{ flex: 1 }}>
      <View>
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
          isDrawing={isDrawing}
          crosshairState={crosshair}
          isFullscreen={isFullscreen && isLandscape}
        />
      </View>
      <View style={[{ flex: 1 }, displayStyle]}>
        <ChartIqWrapperView
          onPullInitialData={onPullInitialData}
          onPullUpdateData={onPullUpdateData}
          onPullPagingData={onPullPagingData}
          onChartTypeChanged={onChartTypeChanged}
          onHUDChanged={onHUDChanged}
          onMeasureChanged={onMeasureChanged}
          style={styles.box}
        />
        <DrawingMeasure isDrawing={isDrawing} measure={measureValue} />
        {drawingItem !== null ? (
          <DrawingToolManager
            handleDrawingTool={showDrawingToolsSelector}
            drawingItem={drawingItem}
          />
        ) : null}
      </View>

      <CompareSymbolSelector
        ref={compareSymbolSelectorRef}
        onAdd={addSymbol}
        onDelete={removeSymbol}
        data={compareSymbols}
      />
      <SymbolSelector onChange={handleSymbolChange} ref={symbolSelectorRef} />
      <IntervalSelector ref={intervalSelectorRef} onChange={handleIntervalChange} />
      <ChartStyleSelector ref={chartStyleSelectorRef} onChange={handleChartStyleChange} />
      <DrawingToolSelector
        onChange={async (input) => {
          enableDrawing(input.name);
          const params = await getDrawingParams(input.name);

          updateDrawingSettings(() => params);

          updateSupportedSettings(input.name);
          setDrawingItem(input);
          if (input.name === DrawingTool.NO_TOOL) {
            return setIsDrawing(false);
          }

          setIsDrawing(true);
        }}
        ref={drawingToolSelectorRef}
      />
      <FullScreenAnimatedButtonComponent
        isLandscape={isLandscape}
        active={isFullscreen}
        onChange={(value) => {
          setIsFullScreen(value);
        }}
      />
    </View>
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
