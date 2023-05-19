import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SvgProps } from 'react-native-svg';

import Icons from '~/assets/icons';
import { CrosshairSharedValues } from '~/model';
import { RootStack, SettingsNavigation } from '~/shared/navigation.types';

import { Theme, useTheme } from '../../theme';
import { ChartStyleItem } from '../chart-style-selector/chart-style-selector.data';

import { AnimatedCrosshairValues } from './components/animated-crosshair-values';

const timingConfig = { duration: 200 };
const CROSSHAIR_HEIGHT = 70;

interface HeaderProps {
  interval: string | null;
  chartStyle: ChartStyleItem | null;
  symbol: string | null;
  handleSymbolSelector: () => void;
  handleIntervalSelector: () => void;
  handleChartStyleSelector: () => void;
  handleCompareSymbolSelector: () => void;
  handleDrawingTool: () => void;
  handleCrosshair: (input: boolean) => void;
  handleFullScreen: () => void;
  isCrosshairEnabled: boolean;
  crosshairState: CrosshairSharedValues;
  isDrawing: boolean;
  isLandscape: boolean;
}

interface HeaderItem {
  onPress: () => void;
  Icon: React.FC<SvgProps> | React.FC | null;
  key: string;
  style?: ViewStyle | ViewStyle[];
  containerStyle?: ViewStyle | ViewStyle[];
  fill?: string;
}

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
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<SettingsNavigation>();

  const [open, setOpen] = useState(false);
  const otherToolsHeight = useSharedValue(0);
  const crosshairHeight = useSharedValue(0);

  const handleChevron = useCallback(() => {
    'worklet';
    const toValue = open ? 0 : 50;
    otherToolsHeight.value = withTiming(toValue, timingConfig);

    runOnJS(setOpen)((prevState) => !prevState);
  }, [open, otherToolsHeight]);

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

  const displayStyle = { display: open ? 'flex' : 'none' } as ViewStyle;
  const drawingStyle = useMemo(
    () => (isDrawing ? [styles.chartStyleButton, styles.selectedButton] : styles.chartStyleButton),
    [isDrawing, styles.chartStyleButton, styles.selectedButton],
  );
  const drawingFill = isDrawing ? theme.colors.background : theme.colors.buttonText;
  const crosshairFill = isCrosshairEnabled ? theme.colors.background : theme.colors.buttonText;
  const crosshairStyle: ViewStyle | ViewStyle[] = useMemo(
    () =>
      isCrosshairEnabled
        ? [styles.chartStyleButton, styles.selectedButton]
        : styles.chartStyleButton,
    [isCrosshairEnabled, styles.chartStyleButton, styles.selectedButton],
  );

  const iconProps = {
    width: 24,
    height: 24,
    fill: theme.colors.buttonText,
  };

  const cardWidth = 24 + 16;

  const numberOfVisibleItems = Math.floor(width / 2 / cardWidth);

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
        Icon: Icons.signals,
        key: 'signals',
      },
      {
        onPress: onCrosshair,
        Icon: Icons.crosshair,
        key: 'crosshair',
        containerStyle: crosshairStyle,
        fill: crosshairFill,
      },
      {
        onPress: handleDrawingTool,
        Icon: isDrawing ? Icons.drawActive : Icons.draw,
        key: 'draw',
        fill: drawingFill,
        containerStyle: drawingStyle,
      },
      {
        onPress: () => {
          navigation.navigate(RootStack.Settings);
        },
        Icon: Icons.menuSettings,
        key: 'settings',
      },
    ],
    [
      chartStyle?.icon,
      crosshairFill,
      crosshairStyle,
      drawingFill,
      drawingStyle,
      handleChartStyleSelector,
      handleCompareSymbolSelector,
      handleDrawingTool,
      handleSignals,
      handleStudies,
      isDrawing,
      navigation,
      onCrosshair,
    ],
  );

  const isAllItemsFits = items.length <= numberOfVisibleItems;

  const visibleItems = useMemo(() => {
    const visibleItems: HeaderItem[] = items.slice(
      0,
      isAllItemsFits ? items.length : numberOfVisibleItems - 1,
    );

    if (!isAllItemsFits) {
      visibleItems.push({
        onPress: handleChevron,
        Icon: Icons.chevronRight,
        key: 'chevron',
        style: { transform: [{ rotate: open ? '90deg' : '270deg' }] },
      });
    }

    if (isLandscape) {
      visibleItems.push({
        onPress: () => {
          handleFullScreen();
        },
        Icon: Icons.fullView,
        key: 'full-screen',
      });
    }
    return visibleItems;
  }, [
    handleChevron,
    handleFullScreen,
    isAllItemsFits,
    isLandscape,
    items,
    numberOfVisibleItems,
    open,
  ]);

  const otherItems = items.slice(numberOfVisibleItems - 1, items.length);

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
            <Text style={styles.buttonText}>{interval}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          {visibleItems.map(({ Icon, key, onPress, style, containerStyle, fill }) => (
            <View key={key} style={styles.itemContainer}>
              <TouchableOpacity onPress={onPress} style={[styles.chartStyleButton, containerStyle]}>
                {Icon ? (
                  <Icon {...iconProps} fill={fill || theme.colors.buttonText} style={style} />
                ) : null}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </Animated.View>
      <Animated.View style={[styles.otherToolsContainer, otherToolsHeightStyle]}>
        {otherItems.map(({ Icon, key, onPress, style, containerStyle, fill }) => (
          <View key={key} style={styles.itemContainer}>
            <TouchableOpacity
              onPress={onPress}
              style={[containerStyle ? containerStyle : styles.chartStyleButton, displayStyle]}
            >
              {Icon ? (
                <Icon {...iconProps} fill={fill || theme.colors.buttonText} style={style} />
              ) : null}
            </TouchableOpacity>
          </View>
        ))}
      </Animated.View>
      <Animated.View style={[styles.crosshairContainer, crosshairHeightStyle]}>
        <AnimatedCrosshairValues crosshair={crosshairState} />
      </Animated.View>
    </>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    otherToolsContainer: {
      width: '100%',
      backgroundColor: theme.colors.background,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    crosshairContainer: {
      backgroundColor: theme.colors.background,
      width: '100%',
    },
    container: {
      backgroundColor: theme.colors.background,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: theme.colors.buttonBackground,
      height: 32,
      width: 76,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: theme.colors.buttonText,
    },
    selectedButtonText: {
      color: theme.colors.buttonBackground,
    },
    space: {
      width: 10,
    },
    row: {
      flexDirection: 'row',
    },
    chartStyleButton: {
      borderRadius: 32,
      backgroundColor: theme.colors.buttonBackground,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
      width: 32,
      height: 32,
    },
    selectedButton: {
      backgroundColor: theme.colors.buttonText,
    },
    itemContainer: {
      paddingHorizontal: 8,
    },
    iconMargin: {
      margin: 4,
    },
  });

export default Header;
