// import {
//   Orientation,
//   OrientationChangeEvent,
//   addOrientationChangeListener,
//   getOrientationAsync,
//   removeOrientationChangeListeners,
//   lockAsync,
//   OrientationLock
// } from 'expo-screen-orientation';
import React, { useCallback, useEffect } from 'react';
import { NativeSyntheticEvent } from 'react-native';
import { ChartIQ, OnMeasureChangeEvent, ChartSymbol, DrawingTool, TimeUnit } from '@chartiq/react-native-chartiq';
import { useSharedValue } from 'react-native-reanimated';

import { findLineTypeItemByPatternAndWidth } from '../../assets/icons/line-types/line-types';
import { colorPickerColors } from '../../constants';
import { useTheme } from '../../theme';
import { BottomSheetMethods } from '../../ui/bottom-sheet';
import {
  ChartStyleSelectorData,
  candle,
  chartStyleSelectorData,
} from '../../ui/chart-style-selector/chart-style-selector.data';
import { ColoredChartSymbol } from '../../ui/compare-symbol-selector/compare-symbol-selector.component';
import { DrawingToolManagerMethods } from '../../ui/drawing-tool-manager/drawing-tool-manager.component';
import { DrawingItem } from '../../ui/drawing-tools-selector/drawing-tools-selector.data';
import { IntervalItem, intervals } from '../../ui/interval-selector/interval-selector.component';

import { useUpdateDrawingTool } from './use-update-drawing-tool';
import { asyncStorageKeys } from '../../constants/async-storage-keys';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';


export const useChartIQ = () => {
  const [initialized, setChartInitialized] = React.useState(false);
  const { isDark } = useTheme();
  const [symbol, setSymbol] = React.useState<null | string>(null);
  const [interval, setInterval] = React.useState<IntervalItem | null>(null);
  const [chartStyle, setChartStyle] = React.useState<ChartStyleSelectorData>(candle);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const drawingDisableByTap = React.useRef(false);
  const [isLandscape, setIsLandscape] = React.useState(false);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [compareSymbols, setCompareSymbols] = React.useState<Map<string, ColoredChartSymbol>>(
    new Map(),
  );
  const measureValue = useSharedValue('');
  const market = useSelector((state: any) => state.market);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const drawingToolSelectorRef = React.useRef<BottomSheetMethods>(null);
  const { updateDrawingTool } = useUpdateDrawingTool();
  const compareSymbolSelectorRef = React.useRef<BottomSheetMethods>(null);
  const drawingManagerRef = React.useRef<DrawingToolManagerMethods>(null);

  const toggleCompareSymbolSelector = () => {
    ChartIQ.getActiveSeries().then((activeSeries) => {
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

  const handleSymbolChange = ({ symbol }: any) => {
    console.log('handleSymbolChange', symbol);

    ChartIQ.setSymbol(symbol);
    setSymbol(symbol);
  };

  const handleIntervalChange = (input: IntervalItem) => {
    setInterval(input);
    console.log(input.timeUnit.toLocaleLowerCase());


    // nullify the Periodicity load again for day-week-month
    ChartIQ.setPeriodicity(0, '0', TimeUnit.TICK);
    ChartIQ.setPeriodicity(input.period, input.interval, input.timeUnit);
  };

  const handleChartStyleChange = useCallback((input: ChartStyleSelectorData) => {
    setChartStyle(input);
    if (input.aggregationType) {
      ChartIQ.setAggregationType(input.aggregationType);
      return;
    }
    ChartIQ.setChartType(input.value);
  }, []);

  const updateTheme = useCallback(() => {
    if (isDark) {
      ChartIQ.setTheme('night');
      return;
    } else {
      ChartIQ.setTheme('day');
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

    ChartIQ.addSeries(
      input.symbol,
      input.color ? input.color : colorPickerColors[0] ?? 'black',
      true,
    );
  };

  const removeSymbol = (input: ColoredChartSymbol) => {
    setCompareSymbols((prevState) => {
      const map = new Map(prevState);
      map.delete(input.symbol);
      return map;
    });
    ChartIQ.removeSeries(input.symbol);
  };

  const initChart = useCallback(async () => {
    updateTheme();
    setChartInitialized(true);
    const symbol = await ChartIQ.getSymbol();

    if (!symbol) {
      setSymbol('EURUSD');
      ChartIQ.setSymbol('EURUSD');
    } else {
      setSymbol(symbol);
    }

    const periodicity = await ChartIQ.getPeriodicity();

    const newInterval =
      [...intervals.first, ...intervals.second,].find((item) => {
        return (
          item.timeUnit?.toLowerCase() === periodicity.timeUnit?.toLowerCase() &&
          item.period === periodicity.periodicity &&
          item.interval === periodicity.interval
        );
      }) ?? null;

    setInterval(newInterval);

    const activeSeries = await ChartIQ.getActiveSeries();

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

    const aggregationType = await ChartIQ.getChartAggregationType();
    const chartType = await ChartIQ.getChartType();

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

  const onMeasureChanged = ({ nativeEvent: { measure } }: OnMeasureChangeEvent) => {
    measureValue.value = measure;
  };

  const onDrawingToolChanged = async (input: DrawingItem) => {
    drawingManagerRef.current?.loading(true);
    drawingManagerRef.current?.show();

    ChartIQ.enableDrawing(input.name);
    const params = await ChartIQ.getDrawingParams(input.name);
    const lineTypeItem = findLineTypeItemByPatternAndWidth(params.pattern, params.lineWidth);

    updateDrawingTool(input, params, lineTypeItem);
    drawingManagerRef.current?.loading(false);
    if (input.name === DrawingTool.NO_TOOL) {
      drawingManagerRef.current?.hide();
      return setIsDrawing(false);
    }

    setIsDrawing(true);
    setIsFullScreen(false);
  };

  const handleRestoreDrawingParams = async (tool: DrawingItem) => {
    ChartIQ.restoreDefaultDrawingConfig(tool.name, true);
    await onDrawingToolChanged(tool);
  };

  const toggleDrawingToolSelector = () => {
    if (!isDrawing) {
      return drawingToolSelectorRef.current?.present('');
    }
    drawingDisableByTap.current = true;
    setIsDrawing(false);
    drawingManagerRef.current?.hide();
    ChartIQ.disableDrawing();
  };

  // const orientationCallback = React.useCallback(async (orientation: Orientation) => {
  //   const landscape =
  //     orientation === Orientation.LANDSCAPE_LEFT || orientation === Orientation.LANDSCAPE_RIGHT;
  //   console.log('<<<<<<<<<<<<<<<< orientationCallback >>>>>>>>>>>>>>>>>>>');


  //   setIsLandscape(true);
  //   if (landscape) {
  //     setIsLandscape(true);
  //   } else {
  //     setIsLandscape(false);
  //   }
  // }, []);

  // React.useEffect(() => {
  //   getOrientationAsync().then(orientationCallback);

  //   addOrientationChangeListener(({ orientationInfo: { orientation } }: OrientationChangeEvent) => {
  //     orientationCallback(orientation);
  //   });

  //   return () => {
  //     removeOrientationChangeListeners();
  //   };
  // }, [orientationCallback,isFullscreen]);




  // useEffect(() => {
  //   if (isLandscape && !isDrawing && !drawingDisableByTap.current) {
  //     drawingDisableByTap.current = false;
  //     setIsFullScreen(true);
  //   } else {
  //     drawingDisableByTap.current = false;
  //     setIsFullScreen(false);
  //   }
  // }, [isDrawing, isLandscape]);

  // const toggleFullScreen = (val = false) => {
  //   console.log('<<<<<<<<<<<<<<>>>>>>>>>>>>> toggleFullScreen <<<<<<<<<<<<<<>>>>>>>>>>>>>');

  //   setIsFullScreen((prevState) => {
  //     if (!prevState) {
  //       setIsDrawing(false);
  //       drawingManagerRef.current?.hide();
  //       ChartIQ.disableDrawing();
  //     }
  //     return !val ? !prevState : val;
  //   });
  // };

  // useEffect(() => {
  //   //Orientation.unlockAllOrientations();

  //   console.log('<<<<<<<<<<<<<< isFullscreen Change>>>>>>>>>>>>>>');
  //   Orientation.getOrientation((orientation) => {
  //     console.log(`Current Device Orientation: ${orientation}`);
  //   });

  //   if (isFullScreen) {
  //     navigation.getParent()?.setOptions({
  //       tabBarStyle: {
  //         display: 'none'
  //       }
  //     });
  //     console.log('<<<<<<<<<<<<<< Orientation.lockToLandscape >>>>>>>>>>>>>>');
  //     Orientation.lockToLandscape();
  //     return;
  //   }
  //   console.log('<<<<<<<<<<<<<< Orientation.lockToPortrait >>>>>>>>>>>>>>');
  //   navigation.getParent()?.setOptions({
  //     tabBarStyle: {
  //       display: 'flex'
  //     }
  //   });
  //   Orientation.lockToPortrait();

  // }, [isFullScreen])

  return {
    onChartTypeChanged,
    onMeasureChanged,
    onDrawingToolChanged,
    onChartAggregationTypeChanged,

    toggleDrawingToolSelector,
    toggleCompareSymbolSelector,
    // toggleFullScreen,

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
    measureValue,
    isLandscape,
    isFullScreen,

    drawingToolSelectorRef,
    compareSymbolSelectorRef,
    drawingManagerRef,

    initialized,
    initChart,
  };
};
