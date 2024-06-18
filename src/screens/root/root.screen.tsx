import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { StyleSheet, View, ViewStyle, Dimensions, Text } from 'react-native';
import { ChartIQ, ChartIQLanguages, ChartIQView, TimeUnit } from '@chartiq/react-native-chartiq';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

import { WEB_VIEW_SOURCE } from '../../constants';
import { asyncStorageKeys } from '../../constants/async-storage-keys';
import { useChartIQ } from '../../shared/hooks/use-chart-iq';
import { usePullData } from '../../shared/hooks/use-pull-data';
import { useTranslations } from '../../shared/hooks/use-translations';
import { Theme, useTheme } from '../../theme';
import { BottomSheetMethods } from '../../ui/bottom-sheet';
import { ChartStyleSelector } from '../../ui/chart-style-selector';
import { CompareSymbolSelector } from '../../ui/compare-symbol-selector';
import { DrawingMeasure } from '../../ui/drawing-measure';
import { DrawingToolManager } from '../../ui/drawing-tool-manager';
import { DrawingToolSelector } from '../../ui/drawing-tools-selector';
import FullScreenAnimatedButtonComponent from '../../ui/full-screen-animated-button/full-screen-animated-button.component';
import { Header } from '../../ui/header';
import { IntervalSelector } from '../../ui/interval-selector';
import SymbolSelector from '../../ui/symbol-selector/symbol-selector.component';
import { useSelector, useDispatch } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const Root = (props: any) => {
  const theme = useTheme();
  const data = props?.route?.params?.data;
  const [socketData, setSocketData] = React.useState([]);
  const [index, setIndex] = React.useState(0);
  const styles = createStyles(theme);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const translateX = useSharedValue(- (Dimensions.get('screen').width));
  const viewOpacity = useSharedValue(0);

  const symbolSelectorRef = React.useRef<BottomSheetMethods>(null);
  const intervalSelectorRef = React.useRef<BottomSheetMethods>(null);
  const chartStyleSelectorRef = React.useRef<BottomSheetMethods>(null);




  const toggleSymbolSelector = () => {
    //navigate('AddWatchList', { type: 1 })

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
    toggleDrawingToolSelector,
    toggleCompareSymbolSelector,
    // toggleFullScreen,
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
    isFullScreen,
    drawingToolSelectorRef,
    compareSymbolSelectorRef,
    drawingManagerRef,
    initChart,
    initialized,
  } = useChartIQ();

  const { onPullInitialData, onPullPagingData, onPullUpdateData, intervalApi } = usePullData(isFocused, interval);

  function showDrawingToolsSelector() {
    drawingToolSelectorRef.current?.present('');
  }

  const { getTranslationsFromStorage } = useTranslations();

  const displayStyle: ViewStyle = { display: isFullScreen ? 'none' : 'flex' };

  const get = React.useCallback(async () => {
    let userLanguage =
      (await AsyncStorage.getItem(asyncStorageKeys.languageCode)) ?? ChartIQLanguages.EN.code;

    AsyncStorage.setItem(asyncStorageKeys.languageCode, userLanguage);
    ChartIQ.setLanguage(userLanguage);
  }, []);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: withTiming(viewOpacity.value, {
      duration: 500,
    }),
    transform: [{
      translateX: withTiming(translateX.value, {
        duration: 250,
        easing: Easing.linear,
      })
    }],
  }));

  React.useEffect(() => {
    if (initialized) {
      get();
      getTranslationsFromStorage();
    }
  }, [get, getTranslationsFromStorage, initialized]);



  React.useEffect(() => {
    if (data) {
      if (data?.symbol !== symbol) {
        handleSymbolChange(data)

      }
    }
  }, [isFocused, data]);

  return (
    <>
      <View style={{ flex: 1 }}>


        <Header
          symbol={symbol}
          interval={interval?.label ?? null}
          chartStyle={chartStyle}
          handleSymbolSelector={toggleSymbolSelector}
          handleIntervalSelector={toggleIntervalSelector}
          handleChartStyleSelector={toggleChartStyleSelector}
          handleCompareSymbolSelector={toggleCompareSymbolSelector}
          handleDrawingTool={toggleDrawingToolSelector}
          // handleFullScreen={}
          isDrawing={isDrawing}

          isFullScreen={false}
          isLandscape={isLandscape}
          loading={!initialized}
        />

        <View style={styles.chartContainer}>
          <ChartIQView
            url={WEB_VIEW_SOURCE}
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
        {/* <FullScreenAnimatedButtonComponent isFullScreen={isFullscreen} onChange={toggleFullScreen} /> */}
      </View>
    </>
  );
}
export default Root;


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
