import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { View } from 'react-native';
import Icons from '~/assets/icons';
import { Theme, useTheme } from '~/theme';
import { ReText } from '../re-text';
import { StyleSheet } from 'react-native';
import { redoDrawing, undoDrawing } from 'react-native-chart-iq-wrapper';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface DrawingMeasureProps {
  measure: SharedValue<string>;
  isDrawing: boolean;
}

const DrawingMeasure: React.FC<DrawingMeasureProps> = ({ isDrawing, measure }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const displayUndo: ViewStyle = { display: isDrawing ? 'flex' : 'none' };

  const undo = () => {
    undoDrawing();
  };
  const redo = () => {
    redoDrawing();
  };

  const measureStyle = useAnimatedStyle(() => {
    const display = measure.value === '' ? 'none' : 'flex';

    return { display };
  }, [measure]);

  return (
    <View style={[styles.absolute, displayUndo]}>
      <View style={styles.undoHeader}>
        <Pressable onPress={undo} style={styles.undoButton}>
          <Icons.undo
            width={32}
            height={32}
            fill={theme.colors.buttonText}
            stroke={theme.colors.buttonText}
          />
        </Pressable>
        <Pressable onPress={redo} style={styles.undoButton}>
          <Icons.undo
            width={32}
            height={32}
            fill={theme.colors.buttonText}
            stroke={theme.colors.buttonText}
            style={{
              transform: [
                {
                  rotateY: '180deg',
                },
              ],
            }}
          />
        </Pressable>
      </View>
      <Animated.View style={[styles.measure, measureStyle]}>
        <ReText text={measure} />
      </Animated.View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    box: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    absolute: {
      position: 'absolute',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    undoHeader: {
      paddingTop: 16,
      flexDirection: 'row',
    },
    undoButton: {
      paddingHorizontal: 5,
    },
    measure: {
      marginTop: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.background,
      borderRadius: 4,
    },
    measureText: {
      color: theme.colors.buttonText,
      fontSize: 12,
    },
  });

export default React.memo(DrawingMeasure);
