import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ChartIQ } from 'react-native-chart-iq';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Icons from '~/assets/icons';
import { useTranslations } from '~/shared/hooks/use-translations';
import { RootStack, SettingsNavigation } from '~/shared/navigation.types';

import { useTheme } from '../../theme';

import { AnimatedCrosshairValues } from './components/animated-crosshair-values';
import { HeaderButtons } from './components/header-buttons';
import { createStyles } from './header.styles';
import { HeaderItem, HeaderProps } from './header.types';

const timingConfig = { duration: 200 };
const CROSSHAIR_HEIGHT = 58;
const MIN_VISIBLE_ITEMS = 3 + 1;
const DEFAULT_CARD_SIZE = 24 + 16;

const Header: React.FC<HeaderProps> = ({
  symbol,
  interval,
  chartStyle,

  handleSymbolSelector,
  handleIntervalSelector,
  handleChartStyleSelector,
  handleCompareSymbolSelector,
  handleDrawingTool,
  handleFullScreen,

  isDrawing,
  isLandscape,
  loading,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<SettingsNavigation>();
  const { translationMap } = useTranslations();
  const [width, setWidth] = useState(0);
  const [open, setOpen] = useState(false);
  const otherToolsHeight = useSharedValue(0);
  const crosshairHeight = useSharedValue(0);
  const [isCrosshairEnabled, setIsCrosshairEnabled] = useState(false);

  const toggleCrosshair = useCallback(
    (nextState?: boolean) => {
      setIsCrosshairEnabled((prevState) => {
        const state = nextState !== undefined ? nextState : !prevState;
        if (state) {
          ChartIQ.enableCrosshairs();
          return state;
        }

        ChartIQ.disableCrosshairs();

        return state;
      });
    },
    [setIsCrosshairEnabled],
  );

  const handleChevron = useCallback(() => {
    'worklet';
    const toValue = open ? 0 : 50;
    otherToolsHeight.value = withTiming(toValue, timingConfig);

    runOnJS(setOpen)((prevState) => !prevState);
  }, [open, otherToolsHeight]);

  useEffect(() => {
    if (open && isLandscape) {
      otherToolsHeight.value = withTiming(0, timingConfig);
      setOpen(false);
      crosshairHeight.value = withTiming(0, timingConfig);
      toggleCrosshair(false);
    }
  }, [crosshairHeight, isLandscape, open, otherToolsHeight, toggleCrosshair]);

  const onCrosshair = useCallback(() => {
    ('worklet');
    toggleCrosshair();
  }, [toggleCrosshair]);

  const otherToolsHeightStyle = useAnimatedStyle(
    () => ({ height: otherToolsHeight.value }),
    [otherToolsHeight],
  );

  const crosshairHeightStyle = useAnimatedStyle(
    () => ({
      height: withTiming(isCrosshairEnabled ? CROSSHAIR_HEIGHT : 0, timingConfig),
    }),
    [isCrosshairEnabled],
  );
  const opacityStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(isCrosshairEnabled ? 1 : 0, timingConfig),
      transform: [
        {
          translateY: withTiming(isCrosshairEnabled ? 0 : 50, timingConfig),
        },
      ],
      position: 'absolute',
      bottom: 12,
      left: 0,
      width: '100%',
    }),
    [isCrosshairEnabled],
  );

  const getFill = useCallback(
    (condition: boolean) => (condition ? theme.colors.background : theme.colors.buttonText),
    [theme.colors.background, theme.colors.buttonText],
  );

  const getContainerStyles = useCallback(
    (condition: boolean) =>
      condition
        ? [styles.chartStyleButton, styles.selectedButton]
        : (styles.chartStyleButton as ViewStyle | ViewStyle[]),
    [styles.chartStyleButton, styles.selectedButton],
  );

  const numberOfVisibleItems = Math.max(Math.floor(width / DEFAULT_CARD_SIZE), MIN_VISIBLE_ITEMS);

  const handleStudies = useCallback(() => {
    navigation.navigate(RootStack.Studies);
  }, [navigation]);

  const handleSignals = useCallback(() => {
    navigation.navigate(RootStack.Signals);
  }, [navigation]);

  const items: HeaderItem[] = useMemo(
    () => [
      {
        onPress: handleChartStyleSelector,
        Icon: chartStyle?.icon ?? null,
        key: 'chartStyle',
      },
      {
        onPress: () => {
          handleStudies();
        },
        Icon: Icons.studies,
        key: 'studies',
      },
      {
        onPress: handleCompareSymbolSelector,
        Icon: Icons.compare,
        key: 'compare',
      },
      {
        onPress: () => {
          handleSignals();
        },
        Icon: Icons.navSignals,
        key: 'signals',
        stroke: theme.colors.buttonText,
      },
      {
        onPress: onCrosshair,
        key: 'crosshair',
        activeImageType: 'crosshair',
        active: isCrosshairEnabled,
      },
      {
        onPress: handleDrawingTool,
        key: 'draw',
        activeImageType: 'drawings',
        active: isDrawing,
      },
      {
        onPress: () => {
          navigation.navigate(RootStack.Settings);
        },
        Icon: Icons.settings,
        fill: theme.colors.buttonText,
        key: 'settings',
      },
    ],
    [
      chartStyle?.icon,
      handleChartStyleSelector,
      handleCompareSymbolSelector,
      handleDrawingTool,
      handleSignals,
      handleStudies,
      isCrosshairEnabled,
      isDrawing,
      navigation,
      onCrosshair,
      theme.colors.buttonText,
    ],
  );

  const isAllItemsFits = items.length <= numberOfVisibleItems;

  const [visibleItems, otherItems] = useMemo(() => {
    let preparedItems = [...items];
    if (isLandscape) {
      const compareIndex = preparedItems.findIndex((item) => item.key === 'compare');
      const signalIndex = preparedItems.findIndex((item) => item.key === 'signals');
      let tmp = preparedItems[compareIndex];
      if (
        compareIndex !== -1 &&
        signalIndex !== -1 &&
        preparedItems[compareIndex] &&
        preparedItems[signalIndex] &&
        tmp
      ) {
        preparedItems[compareIndex] = preparedItems[signalIndex] as HeaderItem;
        preparedItems[signalIndex] = tmp;
      }
    }
    const visibleItems: HeaderItem[] = preparedItems.slice(
      0,
      isAllItemsFits ? preparedItems.length : numberOfVisibleItems - 1,
    );

    let otherItems = preparedItems.slice(numberOfVisibleItems - 1, items.length);

    if (!isAllItemsFits) {
      const signalButton = otherItems.find((item) => item.key === 'signals');
      const restButtons = otherItems.filter((item) => item.key !== 'signals');

      if (!signalButton && visibleItems[0]) {
        //@ts-ignore
        otherItems = [visibleItems.pop(), ...otherItems];
      } else if (signalButton) {
        otherItems = [signalButton, visibleItems.pop() as HeaderItem, ...restButtons];
      }

      visibleItems.push({
        onPress: handleChevron,
        Icon: Icons.chevronRight,
        key: 'chevron',
        style: { transform: [{ rotate: open ? '270deg' : '90deg' }] },
        containerStyle: getContainerStyles(open),
        fill: getFill(open),
      });
    }

    if (isLandscape) {
      visibleItems.push({
        onPress: () => {
          handleFullScreen();
        },
        key: 'full-screen',
        activeImageType: 'fillView',
        active: false,
      });
    }

    return [visibleItems, otherItems];
  }, [
    getContainerStyles,
    getFill,
    handleChevron,
    handleFullScreen,
    isAllItemsFits,
    isLandscape,
    items,
    numberOfVisibleItems,
    open,
  ]);

  return (
    <>
      <Animated.View style={[styles.container]}>
        <View style={styles.row}>
          <TouchableOpacity onPress={handleSymbolSelector} style={styles.button}>
            {symbol && !loading ? (
              <Text numberOfLines={1} ellipsizeMode="middle" style={styles.buttonText}>
                {symbol}
              </Text>
            ) : (
              <ActivityIndicator size="small" color={theme.colors.colorPrimary} />
            )}
          </TouchableOpacity>
          <View style={styles.space} />
          <TouchableOpacity onPress={handleIntervalSelector} style={styles.button}>
            {!loading ? (
              <Text style={styles.buttonText}>{translationMap[interval ?? ''] || interval}</Text>
            ) : (
              <ActivityIndicator size="small" color={theme.colors.colorPrimary} />
            )}
          </TouchableOpacity>
        </View>
        <View
          onLayout={({
            nativeEvent: {
              layout: { width },
            },
          }) => {
            setWidth(width);
          }}
          style={styles.buttonsContainer}
        >
          <HeaderButtons type="main" items={visibleItems} open={open} />
        </View>
      </Animated.View>
      <Animated.View style={[styles.otherToolsContainer, otherToolsHeightStyle]}>
        <HeaderButtons type="others" items={otherItems} open={open} />
      </Animated.View>
      <Animated.View style={[styles.crosshairContainer, crosshairHeightStyle]}></Animated.View>
      <AnimatedCrosshairValues enabled={isCrosshairEnabled} opacityStyle={opacityStyle} />
    </>
  );
};

export default Header;
