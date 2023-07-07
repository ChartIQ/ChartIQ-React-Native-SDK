import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChartIQ, CrosshairState } from 'react-native-chart-iq-wrapper';
import Animated from 'react-native-reanimated';

import { useTranslations } from '~/shared/hooks/use-translations';

import { Theme, useTheme } from '../../../../theme';

interface AnimatedCrosshairValuesProps {
  opacityStyle: {
    opacity: 0 | 1;
  };
  enabled: boolean;
}

const AnimatedCrosshairValues: React.FC<AnimatedCrosshairValuesProps> = ({
  opacityStyle,
  enabled,
}) => {
  const { translationMap } = useTranslations();
  const [hudState, setHudState] = React.useState<CrosshairState>({
    price: '',
    volume: '',
    open: '',
    high: '',
    low: '',
    close: '',
  });

  const crosshairUpdate = useCallback(async () => {
    if (enabled) {
      const hud = await ChartIQ.getHudDetails();
      setHudState(hud);
    }
  }, [enabled]);

  useEffect(() => {
    const crosshairUpdateInterval = setInterval(crosshairUpdate, 300);

    return () => {
      clearInterval(crosshairUpdateInterval);
    };
  }, [crosshairUpdate]);

  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Animated.View style={[styles.container, opacityStyle]}>
      <View style={[styles.columnItem]}>
        <View style={styles.rowTitle}>
          <Text style={styles.title}>
            {translationMap['Price'] ?? 'Price'}
            {':'}
          </Text>
          <Text style={styles.title}>
            {translationMap['Vol'] ?? 'Vol'}
            {':'}
          </Text>
        </View>
        <View style={styles.rowValue}>
          <Text style={styles.textValue}>{hudState.price}</Text>
          <Text style={styles.textValue}>{hudState.volume}</Text>
        </View>
      </View>
      <View style={[styles.columnItem, { justifyContent: 'center' }]}>
        <View style={styles.rowTitle}>
          <Text style={styles.title}>
            {translationMap['Open'] ?? 'Open'}
            {':'}
          </Text>
          <Text style={styles.title}>
            {translationMap['High'] ?? 'High'}
            {':'}
          </Text>
        </View>
        <View style={styles.rowValue}>
          <Text style={styles.textValue}>{hudState.open}</Text>
          <Text style={styles.textValue}>{hudState.high}</Text>
        </View>
      </View>
      <View style={[styles.columnItem, { justifyContent: 'flex-end' }]}>
        <View style={[styles.rowTitle, styles.alignEnd]}>
          <Text style={styles.title}>
            {translationMap['Close'] ?? 'Close'}
            {':'}
          </Text>
          <Text style={styles.title}>
            {translationMap['Low'] ?? 'Low'}
            {':'}
          </Text>
        </View>
        <View style={styles.rowValue}>
          <Text style={styles.textValue}>{hudState.close}</Text>
          <Text style={styles.textValue}>{hudState.high}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 3,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    columnItem: {
      flex: 1,
      flexDirection: 'row',
    },
    title: {
      paddingRight: 5,
      textTransform: 'uppercase',
      fontSize: 12,
      color: theme.colors.crosshairItemTitle,
      textAlign: 'center',
      letterSpacing: -0.29,
    },
    textValue: {
      fontSize: 12,
      // lineHeight: 14,
      color: theme.colors.crosshairValue,
      // letterSpacing: -0.29,
      textAlign: 'left',
      width: 50,
      height: 16,
    },
    rowTitle: {
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    alignEnd: {},
    rowValue: {
      alignItems: 'flex-start',
    },
  });

export default React.memo(AnimatedCrosshairValues);
