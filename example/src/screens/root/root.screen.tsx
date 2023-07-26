import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ChartIQ, ChartIQView } from 'react-native-chart-iq';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

import { WEB_VIEW_SOURCE } from '~/constants';
import { asyncStorageKeys } from '~/constants/async-storage-keys';
import { ChartIQLanguages } from '~/constants/languages';
import { useChartIQ } from '~/shared/hooks/use-chart-iq';
import { useTranslations } from '~/shared/hooks/use-translations';
import { Theme, useTheme } from '~/theme';
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
  const theme = useTheme();
  const styles = createStyles(theme);
  const [session, setSession] = React.useState<string | null>();

  const symbolSelectorRef = React.useRef<BottomSheetMethods>(null);
  const intervalSelectorRef = React.useRef<BottomSheetMethods>(null);
  const chartStyleSelectorRef = React.useRef<BottomSheetMethods>(null);

  React.useEffect(() => {
    AsyncStorage.getItem(asyncStorageKeys.session)
      .then((session) => {
        setSession(session);
      })
      .catch(() => {
        AsyncStorage.setItem(asyncStorageKeys.session, uuid.v4() as string);
      });
  }, []);

  const toggleSymbolSelector = () => {
    symbolSelectorRef.current?.present('');
  };

  const toggleIntervalSelector = () => {
    intervalSelectorRef.current?.present('');
  };

  const toggleChartStyleSelector = () => {
    chartStyleSelectorRef.current?.present('');
  };

  const {
    onMeasureChanged,
    onDrawingToolChanged,
    onPullInitialData,
    onPullPagingData,
    onPullUpdateData,
    toggleDrawingToolSelector,
    toggleCompareSymbolSelector,
    toggleFullScreen,

    addSymbol,
    removeSymbol,
    handleSymbolChange,
    handleChartStyleChange,
    handleIntervalChange,
    handleRestoreDrawingParams,

    chartStyle,
    compareSymbols,
    interval,
    isDrawing,
    measureValue,
    symbol,
    isLandscape,
    isFullscreen,

    drawingToolSelectorRef,
    compareSymbolSelectorRef,
    drawingManagerRef,

    initChart,
    initialized,
  } = useChartIQ(session ?? '');

  function showDrawingToolsSelector() {
    drawingToolSelectorRef.current?.present('');
  }

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
          isLandscape={isLandscape}
          loading={!initialized}
        />
      </View>
      <View style={styles.chartContainer}>
        <ChartIQView
          url={WEB_VIEW_SOURCE}
          symbol={symbol}
          dataMethod="pull"
          onStart={initChart}
          onPullInitialData={onPullInitialData}
          onPullUpdateData={onPullUpdateData}
          onPullPagingData={onPullPagingData}
          onMeasureChanged={onMeasureChanged}
          style={styles.chartIq}
        />
        <View style={initialized ? {} : styles.overlay} />
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

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chartContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    box: {
      flex: 1,
    },
    chartIq: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.background,
    },
  });
