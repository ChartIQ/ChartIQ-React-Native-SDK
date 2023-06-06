import React from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
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

  return (
    <FlatList
      data={data.value}
      contentContainerStyle={styles.contentContainerStyle}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.columnWrapperStyle}
      renderItem={({ item: { key, value } }) => {
        return (
          <View style={styles.itemContainer}>
            <Text style={styles.title}>{translationMap[key] || key}</Text>
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
      paddingTop: 8,
      justifyContent: 'space-between',
    },
    itemContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
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
    columnWrapperStyle: {
      marginBottom: 4,
    },
  });

export default React.memo(AnimatedCrosshairValues);
