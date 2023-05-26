import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import {
  ChartIqWrapperView,
  getTranslations,
  setLanguage,
  setTheme,
} from 'react-native-chart-iq-wrapper';

import { asyncStorageKeys } from '~/constants/async-storage-keys';
import { ChartIQLanguages } from '~/constants/languages';
import { defaultENTranslations } from '~/localization/language-keys';
import { useChartIQ } from '~/shared/hooks/use-chart-iq';
import { useTheme } from '~/theme';
import { DrawingMeasure } from '~/ui/drawing-measure';
import FullScreenAnimatedButtonComponent from '~/ui/full-screen-animated-button/full-screen-animated-button.component';

import { ChartStyleSelector } from '../../ui/chart-style-selector';
import CompareSymbolSelector from '../../ui/compare-symbol-selector/compare-symbol-selector.component';
import { DrawingToolManager } from '../../ui/drawing-tool-manager';
import { DrawingToolSelector } from '../../ui/drawing-tools-selector';
import { Header } from '../../ui/header';
import IntervalSelector from '../../ui/interval-selector/interval-selector.component';
import SymbolSelector from '../../ui/symbol-selector/symbol-selector.component';

export default function Root() {
  const { isDark } = useTheme();
  const {
    onChartTypeChanged,
    onHUDChanged,
    onMeasureChanged,
    onPullInitialData,
    onPullPagingData,
    onPullUpdateData,
    onDrawingToolChanged,
    onChartAggregationTypeChanged,

    showDrawingToolsSelector,
    toggleSymbolSelector,
    toggleIntervalSelector,
    toggleChartStyleSelector,
    toggleCompareSymbolSelector,
    toggleDrawingToolSelector,
    toggleCrosshair,
    toggleFullScreen,

    addSymbol,
    removeSymbol,
    handleSymbolChange,
    handleChartStyleChange,
    handleIntervalChange,

    isFullscreen,
    chartStyle,
    compareSymbols,
    crosshair,
    drawingItem,
    interval,
    isCrosshairEnabled,
    isDrawing,
    isLandscape,
    measureValue,
    symbol,

    chartStyleSelectorRef,
    compareSymbolSelectorRef,
    drawingToolSelectorRef,
    symbolSelectorRef,
    intervalSelectorRef,
  } = useChartIQ();

  const displayStyle: ViewStyle = { display: isFullscreen ? 'none' : 'flex' };

  React.useEffect(() => {
    if (isDark) {
      setTheme('night');
      return;
    }

    setTheme('day');
  }, [isDark]);

  const get = React.useCallback(async () => {
    let userLanguage =
      (await AsyncStorage.getItem(asyncStorageKeys.languageCode)) ?? ChartIQLanguages.EN.code;

    AsyncStorage.setItem(asyncStorageKeys.languageCode, userLanguage);
    setLanguage(userLanguage);

    getTranslations(userLanguage).then((translations) => {
      if (Object.keys(translations).length === 0) {
        AsyncStorage.setItem(asyncStorageKeys.translations, JSON.stringify(defaultENTranslations));
      }

      AsyncStorage.setItem(asyncStorageKeys.translations, JSON.stringify(translations));
    });
  }, []);

  React.useEffect(() => {
    get();
  }, [get]);

  return (
    <View style={{ flex: 1 }}>
      <View style={displayStyle}>
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
          handleFullScreen={toggleFullScreen}
          isDrawing={isDrawing}
          crosshairState={crosshair}
          isLandscape={isLandscape}
        />
      </View>
      <View style={[{ flex: 1 }]}>
        <ChartIqWrapperView
          onPullInitialData={onPullInitialData}
          onPullUpdateData={onPullUpdateData}
          onPullPagingData={onPullPagingData}
          onChartTypeChanged={onChartTypeChanged}
          onHUDChanged={onHUDChanged}
          onMeasureChanged={onMeasureChanged}
          onChartAggregationTypeChanged={onChartAggregationTypeChanged}
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
      <DrawingToolSelector onChange={onDrawingToolChanged} ref={drawingToolSelectorRef} />
      <FullScreenAnimatedButtonComponent isFullScreen={isFullscreen} onChange={toggleFullScreen} />
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
  },
});