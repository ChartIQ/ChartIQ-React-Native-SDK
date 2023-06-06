import React from 'react';
import { StyleSheet, Text, FlatList, View, ViewStyle } from 'react-native';
import { useDerivedValue, SharedValue } from 'react-native-reanimated';

import { useTranslations } from '~/shared/hooks/use-translations';
import { ReText } from '~/ui/re-text';

import { CrosshairSharedValues } from '../../../../model';
import { Theme, useTheme } from '../../../../theme';

interface AnimatedCrosshairValuesProps {
  crosshair: CrosshairSharedValues;
}

const AnimatedCrosshairValues: React.FC<AnimatedCrosshairValuesProps> = ({ crosshair }) => {
  const { translationMap } = useTranslations();
  const data = useDerivedValue(() => {
    return Object.entries(crosshair).map(([key, value]: [string, SharedValue<string>]) => {
      return {
        key,
        value: value,
      };
    });
  }, [crosshair]);

  const theme = useTheme();
  const styles = createStyles(theme);
  const justify = (index: number): ViewStyle => {
    if (index === 0 || index === 3) {
      return {
        justifyContent: 'flex-start',
      };
    }
    if (index === 1 || index === 4) {
      return {
        justifyContent: 'center',
      };
    }
    if (index === 2 || index === 5) {
      return {
        justifyContent: 'flex-end',
      };
    }

    return {} as ViewStyle;
  };
  return (
    <FlatList
      data={data.value}
      contentContainerStyle={styles.contentContainerStyle}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      renderItem={({ item: { key, value }, index }) => {
        return (
          <View style={[styles.itemContainer, justify(index)]}>
            <Text style={styles.title}>
              {translationMap[key] || key}
              {':'}
            </Text>
            <ReText style={styles.textValue} text={value} />
          </View>
        );
      }}
      keyExtractor={(item) => item.key}
      numColumns={3}
    />
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainerStyle: {
      paddingHorizontal: 16,
      justifyContent: 'space-between',
    },
    itemContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
    justifyCenter: {
      justifyContent: 'center',
    },
    title: {
      paddingRight: 5,
      textTransform: 'uppercase',
      fontSize: 12,
      color: theme.colors.buttonText,
      textAlign: 'center',
    },
    textValue: {
      fontSize: 12,
      color: theme.colors.crosshairUpdateValueColor,
    },
  });

export default React.memo(AnimatedCrosshairValues);
