import React, { useEffect } from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';

import { ActiveImage } from '~/assets/images/active-image';
import { useTheme } from '~/theme';

enum Corners {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
}

interface FullScreenButtonProps {
  isFullScreen: boolean;
  onChange: (value: boolean) => void;
}

const PADDING = 32;
const BOX_SIZE = 32;
const SPACE = PADDING + BOX_SIZE;

const FullScreenButton: React.FC<FullScreenButtonProps> = ({ isFullScreen, onChange }) => {
  const theme = useTheme();
  const pos = useSharedValue(Corners.TOP_RIGHT);
  const { width, height } = useWindowDimensions();
  const translateX = useSharedValue(width - SPACE);
  const translateY = useSharedValue(PADDING);

  useEffect(() => {
    if (width) {
      translateX.value = withTiming(width - SPACE);
    }
  }, [translateX, width]);

  const gestureDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart(() => {
      const position = pos.value;

      if (position === Corners.TOP_LEFT || position === Corners.TOP_RIGHT) {
        translateY.value = withTiming(height - SPACE);
      }
    })
    .onEnd(() => {
      const position = pos.value;

      if (position === Corners.TOP_LEFT) {
        pos.value = Corners.BOTTOM_LEFT;
      }
      if (position === Corners.TOP_RIGHT) {
        pos.value = Corners.BOTTOM_RIGHT;
      }
    });

  const gestureUp = Gesture.Fling()
    .direction(Directions.UP)
    .onStart(() => {
      const position = pos.value;

      if (position === Corners.BOTTOM_LEFT || position === Corners.BOTTOM_RIGHT) {
        translateY.value = withTiming(PADDING);
      }
    })
    .onEnd(() => {
      const position = pos.value;
      if (position === Corners.BOTTOM_LEFT) {
        pos.value = Corners.TOP_LEFT;
      }
      if (position === Corners.BOTTOM_RIGHT) {
        pos.value = Corners.TOP_RIGHT;
      }
    });

  const gestureLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      const position = pos.value;
      if (position === Corners.TOP_RIGHT || position === Corners.BOTTOM_RIGHT) {
        translateX.value = withTiming(PADDING);
      }
    })
    .onEnd(() => {
      const position = pos.value;

      if (position === Corners.TOP_RIGHT) {
        pos.value = Corners.TOP_LEFT;
      }
      if (position === Corners.BOTTOM_RIGHT) {
        pos.value = Corners.BOTTOM_LEFT;
      }
    });

  const gestureRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart(() => {
      const position = pos.value;
      if (position === Corners.TOP_LEFT || position === Corners.BOTTOM_LEFT) {
        translateX.value = withTiming(width - SPACE);
      }
    })
    .onEnd(() => {
      const position = pos.value;
      if (position === Corners.TOP_LEFT) {
        pos.value = Corners.TOP_RIGHT;
      }
      if (position === Corners.BOTTOM_LEFT) {
        pos.value = Corners.BOTTOM_RIGHT;
      }
    });

  const gesture = Gesture.Race(gestureLeft, gestureRight, gestureDown, gestureUp);

  const style = useAnimatedStyle(
    () => ({
      transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
    }),
    [translateY, translateX],
  );

  const onPress = () => {
    onChange(false);
  };

  if (!isFullScreen) {
    return null;
  }

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[
          {
            width: BOX_SIZE,
            height: BOX_SIZE,
            backgroundColor: theme.colors.fullViewButtonBackground,
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: BOX_SIZE,
          },
          style,
        ]}
      >
        <Pressable onPress={onPress} style={styles.button}>
          <ActiveImage type="fillView" active />
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(FullScreenButton);
