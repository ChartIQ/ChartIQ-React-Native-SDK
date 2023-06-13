import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
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

const Header: React.FC<HeaderProps> = ({
  symbol,
  interval,
  chartStyle,

  handleSymbolSelector,
  handleIntervalSelector,
  handleChartStyleSelector,
  handleCompareSymbolSelector,
  handleCrosshair,
  handleDrawingTool,
  handleFullScreen,

  isCrosshairEnabled,
  crosshairState,
  isDrawing,
  isLandscape,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<SettingsNavigation>();
  const { translationMap } = useTranslations();
  const [width, setWidth] = useState(0);
  const [open, setOpen] = useState(false);
  const otherToolsHeight = useSharedValue(0);
  const crosshairHeight = useSharedValue(0);

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
      handleCrosshair(false);
    }
  }, [crosshairHeight, handleCrosshair, isLandscape, open, otherToolsHeight]);

  const onCrosshair = useCallback(() => {
    'worklet';

    const toValue = isCrosshairEnabled ? 0 : CROSSHAIR_HEIGHT;
    crosshairHeight.value = withTiming(toValue, timingConfig, () => {
      runOnJS(handleCrosshair)(!isCrosshairEnabled);
    });
  }, [crosshairHeight, handleCrosshair, isCrosshairEnabled]);

  const otherToolsHeightStyle = useAnimatedStyle(
    () => ({ height: otherToolsHeight.value }),
    [otherToolsHeight],
  );

  const crosshairHeightStyle = useAnimatedStyle(
    () => ({ height: crosshairHeight.value }),
    [crosshairHeight],
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

  const cardWidth = 24 + 16;

  const numberOfVisibleItems = Math.floor(width / cardWidth);
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
    const visibleItems: HeaderItem[] = items.slice(
      0,
      isAllItemsFits ? items.length : numberOfVisibleItems - 1,
    );
    let otherItems = items.slice(numberOfVisibleItems - 1, items.length);

    if (!isAllItemsFits) {
      otherItems = [visibleItems.pop() as HeaderItem, ...otherItems];
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
            {symbol ? (
              <Text numberOfLines={1} ellipsizeMode="middle" style={styles.buttonText}>
                {symbol}
              </Text>
            ) : null}
          </TouchableOpacity>
          <View style={styles.space} />
          <TouchableOpacity onPress={handleIntervalSelector} style={styles.button}>
            <Text style={styles.buttonText}>{translationMap[interval ?? ''] || interval}</Text>
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
      <Animated.View style={[styles.crosshairContainer, crosshairHeightStyle]}>
        <AnimatedCrosshairValues crosshair={crosshairState} />
      </Animated.View>
    </>
  );
};

export default Header;
