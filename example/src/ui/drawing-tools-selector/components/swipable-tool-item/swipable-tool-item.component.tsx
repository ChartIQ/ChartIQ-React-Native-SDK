import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Icons from '~/assets/icons';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';
import { SwipableItem } from '~/ui/swipable-item';

import { DrawingItem } from '../../drawing-tools-selector.data';

interface SwipableToolItemProps {
  item: DrawingItem;
  addToFavorites: (item: DrawingItem) => void;
  removeFromFavorites: (item: DrawingItem) => void;
  onPress: (item: DrawingItem) => void;
  enabled?: boolean;
  active?: boolean;
  listItemProps?: React.ComponentProps<typeof ListItem>;
}

const SwipableToolItem: React.FC<SwipableToolItemProps> = ({
  item,
  addToFavorites,
  removeFromFavorites,
  onPress,
  enabled = true,
  active = false,
  listItemProps,
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
      <ListItem
        onPress={() => {
          onPress(item);
        }}
        {...listItemProps}
      >
        <View style={[styles.row]}>
          <item.Icon
            width={24}
            height={24}
            fill={theme.colors.buttonText}
            stroke={theme.colors.buttonText}
          />
          <Text style={styles.cardTitle}>
            {item.title}
            {item.favorite ? ' ★' : ''}
          </Text>
          {active ? (
            <View style={styles.iconContainer}>
              <Icons.check style={{}} width={24} height={24} fill={theme.colors.colorPrimary} />
            </View>
          ) : null}
        </View>
      </ListItem>
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
    iconContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
  });

export default SwipableToolItem;
