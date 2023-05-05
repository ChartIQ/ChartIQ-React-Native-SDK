import { Theme, useTheme } from '~/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SwipableItem } from '~/ui/swipable-item';

import { DrawingItem } from '../../drawing-tools-selector.data';

interface SwipableToolItemProps {
  item: DrawingItem;
  addToFavorites: (item: DrawingItem) => void;
  removeFromFavorites: (item: DrawingItem) => void;
  onPress: (item: DrawingItem) => void;
  enabled?: boolean;
}

const SwipableToolItem: React.FC<SwipableToolItemProps> = ({
  item,
  addToFavorites,
  removeFromFavorites,
  onPress,
  enabled = true,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const rightActionButtons = !item.favorite
    ? [
        {
          key: 'drawing-tool.favorite.add',
          onPress: () => addToFavorites(item),
          title: '★ Add',
          backgroundColor: theme.colors.favoriteBackground,
          color: theme.colors.white,
          width: 80,
        },
      ]
    : [
        {
          key: 'drawing-tool.favorite.renove',
          onPress: () => removeFromFavorites(item),
          title: '★ Remove',
          backgroundColor: theme.colors.favoriteBackground,
          color: theme.colors.white,
          width: 120,
        },
      ];

  return (
    <SwipableItem enabled={enabled} rightActionButtons={rightActionButtons}>
      <Pressable
        onPress={() => {
          onPress(item);
        }}
        style={styles.card}
      >
        <View style={[styles.row]}>
          <item.Icon
            width={32}
            height={32}
            fill={theme.colors.buttonText}
            stroke={theme.colors.buttonText}
          />
          <Text style={styles.cardTitle}>
            {item.title}
            {item.favorite ? ' ★' : ''}
          </Text>
        </View>
      </Pressable>
    </SwipableItem>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      padding: 8,
      backgroundColor: theme.colors.backgroundSecondary,
    },
    cardTitle: {
      color: theme.colors.cardTitle,
      fontSize: 17,
      paddingLeft: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
    },
  });

export default SwipableToolItem;
