import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn,
  FadeOutLeft,
  FadeOutDown,
} from 'react-native-reanimated';

import images from '../../assets/images';
import { ActiveImage } from '../../assets/images/active-image';
import { useTheme } from '../../theme';

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
  const isFirstRender = useRef(true);
  const imageOpacity = useSharedValue(0);
  const [arrowVisible, setArrowsVisible] = useState(true);

  useEffect(() => {
    if (width) {
      translateX.value = withTiming(width - SPACE);
    }
  }, [translateX, width]);

  const positionsMap = useMemo(
    () => ({
      [Corners.TOP_RIGHT]: {
        x: width - SPACE,
        y: PADDING,
      },
      [Corners.BOTTOM_RIGHT]: {
        x: width - SPACE,
        y: height - SPACE - PADDING,
      },
      [Corners.TOP_LEFT]: {
        x: PADDING,
        y: PADDING,
      },
      [Corners.BOTTOM_LEFT]: {
        x: PADDING,
        y: height - SPACE - PADDING,
      },
    }),
    [height, width],
  );

  const gestureDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart(() => {
      const position = pos.value;
      switch (position) {
        case Corners.TOP_LEFT: {
          pos.value = Corners.BOTTOM_LEFT;
          break;
        }
        case Corners.TOP_RIGHT: {
          pos.value = Corners.BOTTOM_RIGHT;
          break;
        }
        default: {
          return;
        }
      }
    })
    .onEnd(() => {
      const position = pos.value;
      translateY.value = withTiming(positionsMap[position].y);
    });

  const gestureUp = Gesture.Fling()
    .direction(Directions.UP)
    .onStart(() => {
      const position = pos.value;
      switch (position) {
        case Corners.BOTTOM_LEFT: {
          pos.value = Corners.TOP_LEFT;
          break;
        }
        case Corners.BOTTOM_RIGHT: {
          pos.value = Corners.TOP_RIGHT;
          break;
        }
        default: {
          return;
        }
      }
    })
    .onEnd(() => {
      const position = pos.value;
      translateY.value = withTiming(positionsMap[position].y);
    });

  const gestureLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      const position = pos.value;
      switch (position) {
        case Corners.TOP_RIGHT: {
          pos.value = Corners.TOP_LEFT;
          break;
        }
        case Corners.BOTTOM_RIGHT: {
          pos.value = Corners.BOTTOM_LEFT;
          break;
        }
        default: {
          return;
        }
      }
    })
    .onEnd(() => {
      const position = pos.value;
      translateX.value = withTiming(positionsMap[position].x);
    });

  const gestureRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart(() => {
      const position = pos.value;
      switch (position) {
        case Corners.TOP_LEFT: {
          pos.value = Corners.TOP_RIGHT;
          break;
        }
        case Corners.BOTTOM_LEFT: {
          pos.value = Corners.BOTTOM_RIGHT;
          break;
        }
        default: {
          return;
        }
      }
    })
    .onEnd(() => {
      const position = pos.value;
      translateX.value = withTiming(positionsMap[position].x);
    });

  const gesture = Gesture.Race(gestureLeft, gestureRight, gestureDown, gestureUp);

  const onPress = () => {
    onChange(false);
  };

  useEffect(() => {
    if (isFullScreen) {
      if (isFirstRender.current) {
        pos.value = Corners.TOP_RIGHT;
        translateX.value = positionsMap[pos.value].x;
        translateY.value = positionsMap[pos.value].y;
        isFirstRender.current = false;
      } else {
        const value = positionsMap[pos.value];
        translateX.value = value.x;
        translateY.value = value.y;
      }
    }
  }, [isFullScreen, pos, positionsMap, translateX, translateY, width]);

  const style = useAnimatedStyle(
    () => ({
      transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
    }),
    [translateY, translateX],
  );

  const imageStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
    };
  }, []);

  useEffect(() => {
    if (isFullScreen && pos.value === Corners.TOP_RIGHT) {
      setArrowsVisible(true);
    }
  }, [isFullScreen, pos.value]);

  useEffect(() => {
    if (arrowVisible) {
      setTimeout(() => {
        setArrowsVisible(false);
      }, 4000);
    }
  }, [arrowVisible]);

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
            display: isFullScreen ? 'flex' : 'none',
          },
          style,
        ]}
      >
        <Pressable onPress={onPress} style={styles.button}>
          <ActiveImage type="fillView" active />
        </Pressable>
        {arrowVisible ? (
          <>
            <Animated.Image
              entering={FadeIn.delay(1500).duration(300)}
              exiting={FadeOutDown}
              source={images.arrowBottom}
              style={[styles.bottomArrow, imageStyle]}
            />
            <Animated.Image
              entering={FadeIn.delay(1500).duration(300)}
              exiting={FadeOutLeft}
              source={images.arrowLeft}
              style={[styles.leftArrow, imageStyle]}
            />
          </>
        ) : null}
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
  bottomArrow: {
    position: 'absolute',
    bottom: -32,
    left: 8,
  },
  leftArrow: {
    position: 'absolute',
    top: 4,
    left: -32,
  },
});

export default React.memo(FullScreenButton);
