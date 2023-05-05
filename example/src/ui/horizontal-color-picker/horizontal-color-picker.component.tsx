import { Theme, colorPickerColors, useTheme } from '@chart-iq/chart-iq-sdk';
import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

interface HorizontalColorPickerProps {
  active: boolean;
  activeColor: string | null;
  onChange: (input: string) => void;
}

const HorizontalColorPicker: React.FC<HorizontalColorPickerProps> = ({
  active,
  onChange,
  activeColor,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const ref = useRef<FlatList>(null);

  const translateY = useDerivedValue(() => (active ? -70 : 0), [active]);
  const height = useDerivedValue(() => (active ? 70 : 50), [active]);

  const transform = useAnimatedStyle(() => {
    const toValue = withTiming(translateY.value, { duration: 200 });
    const heightValue = withTiming(height.value, { duration: 200 });

    return {
      transform: [{ translateY: toValue }],
      height: heightValue,
    };
  }, [translateY]);

  const handlePress = (color: string) => {
    onChange(color);
  };

  useEffect(() => {
    const activeIndex = colorPickerColors.findIndex((item) => item === activeColor);
    if (active && activeIndex !== -1) {
      ref.current?.scrollToIndex({ index: activeIndex, animated: true, viewPosition: 0.5 });
    }
  }, [active, activeColor]);

  return (
    <Animated.View style={[styles.container, transform]}>
      <FlatList
        ref={ref}
        horizontal
        data={colorPickerColors}
        showsHorizontalScrollIndicator={false}
        style={styles.listContainer}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            style={[
              styles.item,
              { backgroundColor: item },
              activeColor === item && styles.selectedItem,
            ]}
          />
        )}
      />
    </Animated.View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: theme.colors.backgroundSecondary,
    },
    listContainer: {
      paddingHorizontal: 12,
    },
    contentContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    item: {
      width: 44,
      height: 44,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginHorizontal: 6,
    },
    selectedItem: {
      borderWidth: 2,
      borderColor: theme.colors.colorPrimary,
    },
  });

export default HorizontalColorPicker;
