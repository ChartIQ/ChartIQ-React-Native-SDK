import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';

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
    <View style={styles.container}>
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
        <View style={styles.background}>
          <ListItem
            onPress={() => handleChangeColor(item)}
            title={item.symbol}
            bottomBorderStyles={styles.borderBottom}
          >
            <View style={[styles.selectedColor, { backgroundColor: item.color }]} />
          </ListItem>
        </View>
      </SwipableItem>
      <View style={styles.borderBottom} />
    </View>
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
    },
    title: {
      fontSize: 17,
      color: theme.colors.buttonText,
    },
    selectedColor: {
      width: 22,
      height: 22,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    borderBottom: {
      marginLeft: 16,
    },
    container: {
      backgroundColor: theme.colors.backgroundSecondary,
    },
    background: {
      backgroundColor: theme.colors.backgroundSecondary,
    },
  });

export default SwipableSymbol;
