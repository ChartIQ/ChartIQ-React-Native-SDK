import { Theme, useTheme } from '~/theme';
import React, { PropsWithChildren, useRef } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

interface SwipableSymbolProps extends PropsWithChildren {
  rightActionButtons: Array<{
    title: string;
    onPress: () => void;
    key: string;
    backgroundColor?: string;
    color?: string;
    width?: number;
  }>;
  enabled?: boolean;
}

const buildInterpolationConfig = (width: number): Animated.InterpolationConfigType => ({
  inputRange: [-width, 0],
  outputRange: [-width / 4, width / 2],
  extrapolate: 'clamp',
});

const SwipableItem: React.FC<SwipableSymbolProps> = ({
  children,
  rightActionButtons,
  enabled = true,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const ref = useRef<Swipeable>(null);

  const handlePress = (onPress: () => void) => {
    ref.current?.close();
    onPress();
  };

  const renderRightActions = (
    _: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>,
  ) => {
    return rightActionButtons.map(({ onPress, title, backgroundColor, color, key, width = 80 }) => {
      const trans = dragX.interpolate(buildInterpolationConfig(width));
      const style = { transform: [{ translateX: trans }] };
      return (
        <Pressable
          key={key}
          onPress={() => handlePress(onPress)}
          style={[styles.actionButton, { backgroundColor, width }]}
        >
          <Animated.Text style={[styles.actionButtonText, style, { color }]}>{title}</Animated.Text>
        </Pressable>
      );
    });
  };

  return (
    <Swipeable
      enabled={enabled}
      ref={ref}
      // rightThreshold={ACTION_BUTTON_WIDTH * rightActionButtons.length}
      renderRightActions={renderRightActions}
    >
      {children}
    </Swipeable>
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
    actionButton: {
      backgroundColor: theme.colors.backgroundSecondary,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    actionButtonText: {
      color: theme.colors.buttonText,
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

export default SwipableItem;
