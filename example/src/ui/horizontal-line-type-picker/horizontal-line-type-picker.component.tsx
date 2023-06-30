import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { LineTypeItem, lineTypePickerData } from '~/assets/icons/line-types/line-types';
import { Theme, useTheme } from '~/theme';

interface HorizontalLineTypePickerProps {
  active: boolean;
  activeItem: LineTypeItem;
  onChange: (input: LineTypeItem) => void;
}

const HorizontalLineTypePicker: React.FC<HorizontalLineTypePickerProps> = ({
  active,
  onChange,
  activeItem,
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

  const handlePress = (input: LineTypeItem) => {
    onChange(input);
  };

  useEffect(() => {
    const activeIndex = lineTypePickerData.findIndex((item) => item.name === activeItem.name);
    if (active && activeIndex !== -1) {
      ref.current?.scrollToIndex({ index: activeIndex, animated: true, viewPosition: 0.5 });
    }
  }, [active, activeItem]);

  return (
    <Animated.View style={[styles.container, transform]}>
      <FlatList
        ref={ref}
        horizontal
        data={lineTypePickerData}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }: { item: LineTypeItem }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            style={[
              styles.item,
              { marginHorizontal: 6 },
              activeItem.name === item.name && styles.selectedItem,
            ]}
          >
            <item.Icon
              fill={theme.colors.buttonText}
              stroke={theme.colors.buttonText}
              strokeWidth={item.lineWidth}
            />
          </TouchableOpacity>
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
    contentContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: 12,
      paddingRight: 20,
    },
    item: {
      width: 64,
      height: 44,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedItem: {
      borderWidth: 2,
      borderColor: theme.colors.colorPrimary,
    },
  });

export default HorizontalLineTypePicker;
