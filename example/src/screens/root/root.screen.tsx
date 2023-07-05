import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Orientation,
  OrientationChangeEvent,
  addOrientationChangeListener,
  getOrientationAsync,
  removeOrientationChangeListeners,
} from 'expo-screen-orientation';
import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ChartIQWebView, ChartIQ } from 'react-native-chart-iq-wrapper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WEB_VIEW_SOURCE } from '~/constants';
import { asyncStorageKeys } from '~/constants/async-storage-keys';
import { ChartIQLanguages } from '~/constants/languages';
import { useChartIQ } from '~/shared/hooks/use-chart-iq';
import { useTranslations } from '~/shared/hooks/use-translations';
import { BottomSheetMethods } from '~/ui/bottom-sheet';
import { ChartStyleSelector } from '~/ui/chart-style-selector';
import { CompareSymbolSelector } from '~/ui/compare-symbol-selector';
import { DrawingMeasure } from '~/ui/drawing-measure';
import { DrawingToolManager } from '~/ui/drawing-tool-manager';
import { DrawingToolSelector } from '~/ui/drawing-tools-selector';
import FullScreenAnimatedButtonComponent from '~/ui/full-screen-animated-button/full-screen-animated-button.component';
import { Header } from '~/ui/header';
import { IntervalSelector } from '~/ui/interval-selector';
import SymbolSelector from '~/ui/symbol-selector/symbol-selector.component';

export default function Root() {
  const [isFullscreen, setIsFullScreen] = React.useState(false);
  const [isLandscape, setIsLandscape] = React.useState(false);

  const symbolSelectorRef = React.useRef<BottomSheetMethods>(null);
  const intervalSelectorRef = React.useRef<BottomSheetMethods>(null);
  const chartStyleSelectorRef = React.useRef<BottomSheetMethods>(null);

  const toggleSymbolSelector = () => {
    symbolSelectorRef.current?.present('');
  };

  const toggleIntervalSelector = () => {
    intervalSelectorRef.current?.present('');
  };

  const toggleChartStyleSelector = () => {
    chartStyleSelectorRef.current?.present('');
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prevState) => {
      return !prevState;
    });
  };

  const {
    onHUDChanged,
    onMeasureChanged,
    onPullInitialData,
    onPullPagingData,
    onPullUpdateData,
    onDrawingToolChanged,

    toggleDrawingToolSelector,
    toggleCompareSymbolSelector,

    addSymbol,
    removeSymbol,
    handleSymbolChange,
    handleChartStyleChange,
    handleIntervalChange,
    handleRestoreDrawingParams,

    chartStyle,
    compareSymbols,
    crosshair,
    interval,
    isDrawing,
    measureValue,
    symbol,

    drawingToolSelectorRef,
    compareSymbolSelectorRef,
    drawingManagerRef,

    initChart,
    initialized,
  } = useChartIQ();

  React.useEffect(() => {
    const callback = (orientation: Orientation) => {
      const landscape =
        orientation === Orientation.LANDSCAPE_LEFT || orientation === Orientation.LANDSCAPE_RIGHT;
      if (landscape) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    };
    getOrientationAsync().then(callback);

    addOrientationChangeListener(({ orientationInfo: { orientation } }: OrientationChangeEvent) => {
      callback(orientation);
    });

    return () => {
      removeOrientationChangeListeners();
    };
  }, [setIsLandscape]);

  React.useEffect(() => {
    if (isLandscape && !isDrawing) {
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
    }
    // isDrawing is absent in dependency array for skip callback run when drawing tool disables in full screen mode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLandscape]);

  const showDrawingToolsSelector = () => {
    drawingToolSelectorRef.current?.present('');
  };

  const { getTranslationsFromStorage } = useTranslations();

  const displayStyle: ViewStyle = { display: isFullscreen ? 'none' : 'flex' };

  const get = React.useCallback(async () => {
    let userLanguage =
      (await AsyncStorage.getItem(asyncStorageKeys.languageCode)) ?? ChartIQLanguages.EN.code;

    AsyncStorage.setItem(asyncStorageKeys.languageCode, userLanguage);
    ChartIQ.setLanguage(userLanguage);
  }, []);

  React.useEffect(() => {
    if (initialized) {
      get();
      getTranslationsFromStorage();
    }
  }, [get, getTranslationsFromStorage, initialized]);

  return (
    <SafeAreaView style={styles.box}>
      <View style={displayStyle}>
        <Header
          symbol={symbol}
          interval={interval?.label ?? null}
          chartStyle={chartStyle}
          handleSymbolSelector={toggleSymbolSelector}
          handleIntervalSelector={toggleIntervalSelector}
          handleChartStyleSelector={toggleChartStyleSelector}
          handleCompareSymbolSelector={toggleCompareSymbolSelector}
          handleDrawingTool={toggleDrawingToolSelector}
          handleFullScreen={toggleFullScreen}
          isDrawing={isDrawing}
          crosshairState={crosshair}
          isLandscape={isLandscape}
          loading={!initialized}
        />
      </View>
      <View style={[{ flex: 1 }]}>
        <ChartIQWebView
          url={WEB_VIEW_SOURCE}
          onStart={initChart}
          onPullInitialData={onPullInitialData}
          onPullUpdateData={onPullUpdateData}
          onPullPagingData={onPullPagingData}
          onHUDChanged={onHUDChanged}
          onMeasureChanged={onMeasureChanged}
          style={styles.chartIq}
        />
        <DrawingMeasure isDrawing={isDrawing} measure={measureValue} />
        <DrawingToolManager ref={drawingManagerRef} handleDrawingTool={showDrawingToolsSelector} />
      </View>

      <CompareSymbolSelector
        ref={compareSymbolSelectorRef}
        onAdd={addSymbol}
        onDelete={removeSymbol}
        data={compareSymbols}
      />
      <SymbolSelector onChange={handleSymbolChange} ref={symbolSelectorRef} />
      <IntervalSelector
        ref={intervalSelectorRef}
        selectedInterval={interval ?? null}
        onChange={handleIntervalChange}
      />
      <ChartStyleSelector ref={chartStyleSelectorRef} onChange={handleChartStyleChange} />
      <DrawingToolSelector
        handleRestoreDrawingParams={handleRestoreDrawingParams}
        onChange={onDrawingToolChanged}
        ref={drawingToolSelectorRef}
      />
      <FullScreenAnimatedButtonComponent isFullScreen={isFullscreen} onChange={toggleFullScreen} />
    </SafeAreaView>
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
  },
  chartIq: {
    flex: 1,
  },
});
