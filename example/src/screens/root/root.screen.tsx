import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ChartIqWrapperView, setTheme } from 'react-native-chart-iq-wrapper';

import IntervalSelector from '../../ui/interval-selector/interval-selector.component';

import CompareSymbolSelector from '../../ui/compare-symbol-selector/compare-symbol-selector.component';
import SymbolSelector from '../../ui/symbol-selector/symbol-selector.component';

import { DrawingToolSelector } from '../../ui/drawing-tools-selector';
import { ChartStyleSelector } from '../../ui/chart-style-selector';
import { DrawingToolManager } from '../../ui/drawing-tool-manager';
import { Header } from '../../ui/header';
import { DrawingMeasure } from '~/ui/drawing-measure';
import FullScreenAnimatedButtonComponent from '~/ui/full-screen-animated-button/full-screen-animated-button.component';
import { useChartIQ } from '~/shared/hooks/use-chart-iq';
import { useTheme } from '~/theme';

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
