import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { Theme, useTheme } from '~/theme';

import { SwipableItem } from '../../../swipable-item';
import { ColoredChartSymbol } from '../../compare-symbol-selector.component';

interface SwipableSymbolProps {
  item: ColoredChartSymbol;
  handleChangeColor: (id: ColoredChartSymbol) => void;
  handleDelete: (id: ColoredChartSymbol) => void;
}

const SwipableSymbol: React.FC<SwipableSymbolProps> = ({
  item,
  handleChangeColor,
  handleDelete,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <SwipableItem
      rightActionButtons={[
        {
          onPress: () => handleDelete(item),
          title: 'Delete',
          key: 'compare-symbol.delete',
          backgroundColor: theme.colors.error,
          color: theme.colors.white,
          isOvershoot: true,
        },
      ]}
    >
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{item.symbol}</Text>
        <Pressable
          onPress={() => handleChangeColor(item)}
          style={[styles.selectedColor, { backgroundColor: item.color }]}
        />
      </View>
    </SwipableItem>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    itemContainer: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.backgroundSecondary,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 17,
      color: theme.colors.buttonText,
    },
    selectedColor: {
      width: 22,
      height: 22,
    },
  });

export default SwipableSymbol;
