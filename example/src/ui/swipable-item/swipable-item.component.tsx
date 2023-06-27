import React, { PropsWithChildren, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Reanimated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';

import { Theme, useTheme } from '~/theme';

interface SwipableSymbolProps extends PropsWithChildren {
  rightActionButtons: Array<{
    title: string;
    onPress: () => void;
    key: string;
    backgroundColor?: string;
    color?: string;
    width?: number;
    isOvershoot?: boolean;
  }>;
  enabled?: boolean;
}

const buildInterpolationConfig = (
  width: number,
  length: number,
  screenWidth: number,
): Animated.InterpolationConfigType => {
  if (length === 2) {
    return {
      inputRange: [0, 1, 2.5],
      outputRange: [width, 0, -screenWidth],
      extrapolate: 'clamp',
    };
  }

  return {
    inputRange: [0, 1, 2, 5],
    outputRange: [width, 0, -width, -screenWidth],
    extrapolate: 'clamp',
  };
};

const SwipableItem: React.FC<SwipableSymbolProps> = ({
  children,
  rightActionButtons,
  enabled = true,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const ref = useRef<Swipeable>(null);
  const { width: screenWidth } = useWindowDimensions();
  const buttons = [...rightActionButtons].reverse();

  const handlePress = (onPress: () => void) => {
    ref.current?.close();
    onPress();
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<string | number>) => {
    return (
      <View style={styles.actionButtonsContainer}>
        {buttons.map(({ onPress, title, backgroundColor, color, key, width = 80, isOvershoot }) => {
          const trans = progress.interpolate(
            buildInterpolationConfig(width, buttons.length, screenWidth),
          );
          const style = { transform: [{ translateX: trans }] };
          trans.addListener((value) => {
            if (Math.abs(value.value) >= screenWidth * 0.8 && isOvershoot) {
              onPress();
            }
          });

          return (
            <Animated.View
              key={key}
              style={[styles.actionButton, { backgroundColor, width }, style]}
            >
              <Pressable onPress={() => handlePress(onPress)}>
                <Animated.Text style={[styles.actionButtonText, { color }]}>{title}</Animated.Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  return (
    <Reanimated.View exiting={SlideOutLeft.duration(200)} entering={SlideInRight.duration(200)}>
      <Swipeable
        enabled={enabled}
        ref={ref}
        renderRightActions={renderRightActions}
        containerStyle={{
          backgroundColor: rightActionButtons[0]?.backgroundColor,
        }}
        overshootFriction={1}
        overshootRight={true}
      >
        {children}
      </Swipeable>
    </Reanimated.View>
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
      alignItems: 'center',
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
    actionButtonsContainer: {
      flexDirection: 'row',
    },
  });

export default SwipableItem;
