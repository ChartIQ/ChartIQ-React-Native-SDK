import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { CrosshairSharedValues } from 'react-native-chart-iq-wrapper';
import Animated from 'react-native-reanimated';

import { useTranslations } from '~/shared/hooks/use-translations';
import { ReText } from '~/ui/re-text';

import { Theme, useTheme } from '../../../../theme';

interface AnimatedCrosshairValuesProps {
  crosshair: CrosshairSharedValues;
  opacityStyle: {
    opacity: 0 | 1;
  };
}

const AnimatedCrosshairValues: React.FC<AnimatedCrosshairValuesProps> = ({
  crosshair,
  opacityStyle,
}) => {
  const { translationMap } = useTranslations();

  const theme = useTheme();
  const styles = createStyles(theme);
  const textValueStyles = Platform.select({
    ios: styles.textValueStylesIOS,
    android: styles.textValueStylesAndroid,
  });

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
          <ReText style={textValueStyles} text={crosshair.Price} />
          <ReText style={textValueStyles} text={crosshair.Vol} />
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
          <ReText style={textValueStyles} text={crosshair.Open} />
          <ReText style={textValueStyles} text={crosshair.High} />
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
          <ReText style={textValueStyles} text={crosshair.Close} />
          <ReText style={textValueStyles} text={crosshair.Low} />
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
    textValueStylesIOS: {
      fontSize: 12,
      lineHeight: 14,
      color: theme.colors.crosshairValue,
      letterSpacing: -0.29,
      textAlign: 'left',
      width: 50,
      height: 16,
    },
    textValueStylesAndroid: {
      fontSize: 12,
      color: theme.colors.crosshairValue,
      letterSpacing: -0.29,
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
