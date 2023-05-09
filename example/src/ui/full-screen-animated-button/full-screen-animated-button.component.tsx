import React, { useEffect } from 'react';
import { Dimensions, Pressable, useWindowDimensions } from 'react-native';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn,
  runOnUI,
  useDerivedValue,
} from 'react-native-reanimated';
import { useTheme } from '~/theme';

enum Corners {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
}

interface FullScreenButtonProps {
  isLandscape: boolean;
  active: boolean;
  onChange: (value: boolean) => void;
}

const PADDING = 32;
const BOX_SIZE = 32;
const SPACE = PADDING + BOX_SIZE;

const { width: INITIAL_WIDTH, height: INITIAL_HEIGHT } = Dimensions.get('screen');

const FullScreenButton: React.FC<FullScreenButtonProps> = ({
  isLandscape,
  active = true,
  onChange,
}) => {
  const theme = useTheme();
  const pos = useSharedValue(Corners.TOP_RIGHT);
  const width = useSharedValue(INITIAL_WIDTH);
  const height = useSharedValue(INITIAL_HEIGHT);

  const defaultX = useDerivedValue(() => width.value - SPACE, [width]);
  const defaultY = SPACE;

  const translateX = useSharedValue(defaultX.value);
  const translateY = useSharedValue(defaultY);

  const gestureDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart(() => {
      const position = pos.value;

      if (position === Corners.TOP_LEFT || position === Corners.TOP_RIGHT) {
        translateY.value = withTiming(height.value - SPACE);
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
        translateY.value = withTiming(active ? PADDING : SPACE);
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
        translateX.value = withTiming(defaultX.value);
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

  useEffect(() => {
    if (pos.value === Corners.TOP_LEFT || pos.value === Corners.TOP_RIGHT) {
      if (active) {
        runOnUI(() => {
          translateY.value = withTiming(PADDING);
        })();
        return;
      }

      runOnUI(() => {
        translateY.value = withTiming(SPACE);
      })();
    }
  }, [active]);

  const onPress = () => {
    onChange(!active);
  };

  if (!isLandscape) {
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
            backgroundColor: theme.colors.colorPrimary,
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: BOX_SIZE,
          },
          style,
        ]}
      >
        <Pressable
          onPress={onPress}
          style={{ flex: 1, backgroundColor: theme.colors.error, borderRadius: BOX_SIZE }}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default React.memo(FullScreenButton);
