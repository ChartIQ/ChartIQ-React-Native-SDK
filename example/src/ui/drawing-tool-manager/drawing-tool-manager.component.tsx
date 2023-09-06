import { useNavigation } from '@react-navigation/native';
import React, { useState, useContext, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Pressable, StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import { ChartIQ, DrawingParams } from 'react-native-chartiq';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LineTypeItem } from '~/assets/icons/line-types/line-types';
import { DrawingContext } from '~/context/drawing-context/drawing.context';
import { colorInitializer } from '~/shared/helpers';
import { DrawingsStack, RootStack } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';

import Icons from '../../assets/icons';
import { useUpdateDrawingTool } from '../../shared/hooks/use-update-drawing-tool';
import { HorizontalColorPicker } from '../horizontal-color-picker';
import { HorizontalLineTypePicker } from '../horizontal-line-type-picker';

interface DrawingToolManagerProps {
  handleDrawingTool: () => void;
}
export interface DrawingToolManagerMethods {
  show: () => void;
  hide: () => void;
  loading: (value: boolean) => void;
}
type DrawingTool = 'line-color' | 'fill-color' | 'line-type';

const PICKER_HEIGHT = 70;

const DrawingToolManager = forwardRef<DrawingToolManagerMethods, DrawingToolManagerProps>(
  ({ handleDrawingTool }, ref) => {
    const navigation = useNavigation();
    const theme = useTheme();
    const styles = createStyles(theme);
    const { bottom } = useSafeAreaInsets();

    const [activeTool, setActiveTool] = useState<DrawingTool | null>(null);
    const { drawingSettings, supportedSettings, currentLineType, name, title } =
      useContext(DrawingContext);
    const { updateFillColor, updateLineColor, updateLineTypeItem } = useUpdateDrawingTool();
    const { color: lineColorValue, pattern: lineType, fillColor: fillColorValue } = drawingSettings;
    const { supportingFillColor, supportingLineColor, supportingLineType, supportingSettings } =
      supportedSettings;
    const [loading, setLoading] = useState(false);
    const pickerHeight = useSharedValue(0);

    const [fillColor, setFillColor] = useState(() =>
      colorInitializer(fillColorValue, theme.isDark),
    );
    const [lineColor, setLineColor] = useState(() =>
      colorInitializer(lineColorValue, theme.isDark),
    );
    const toggleFillColor = () => {
      pickerHeight.value = withTiming(activeTool === 'fill-color' ? 0 : PICKER_HEIGHT, {
        duration: 200,
      });
      setActiveTool(activeTool === 'fill-color' ? null : 'fill-color');
    };
    const translate = useSharedValue(100);
    const height = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translate.value }],
        height: height.value + pickerHeight.value,
      };
    });

    const handleOpen = () => {
      'worklet';
      translate.value = withTiming(0, { duration: 300 });
      height.value = withTiming(50, { duration: 300 });
    };

    const handleClose = () => {
      'worklet';
      translate.value = withTiming(100, { duration: 300 });
      height.value = withTiming(0, { duration: 300 });
      pickerHeight.value = withTiming(0, { duration: 300 });
      runOnJS(setActiveTool)(null);
    };

    useImperativeHandle(ref, () => ({
      show: handleOpen,
      hide: handleClose,
      loading: (value: boolean) => {
        setLoading(value);
      },
    }));

    useEffect(() => {
      if (lineColorValue) {
        setLineColor(colorInitializer(lineColorValue, theme.isDark));
      }
      if (fillColorValue) {
        setFillColor(colorInitializer(fillColorValue, theme.isDark));
      }
    }, [fillColorValue, lineColorValue, theme.isDark]);

    const handleFillColorChange = (color?: string) => {
      'worklet';
      pickerHeight.value = withTiming(0, { duration: 200 });

      setActiveTool(null);

      if (color) {
        setFillColor(color);
        ChartIQ.setDrawingParams(DrawingParams.FILL_COLOR, color);
        updateFillColor(color);
      }
    };

    const toggleLineColor = () => {
      pickerHeight.value = withTiming(activeTool === 'line-color' ? 0 : PICKER_HEIGHT, {
        duration: 200,
      });
      setActiveTool(activeTool === 'line-color' ? null : 'line-color');
    };

    const handleLineColorChange = (color?: string) => {
      setActiveTool(null);
      pickerHeight.value = withTiming(0, { duration: 200 });
      if (color) {
        setLineColor(color);
        ChartIQ.setDrawingParams(DrawingParams.LINE_COLOR, color);

        updateLineColor(color);
      }
    };

    const toggleLineType = () => {
      pickerHeight.value = withTiming(activeTool === 'line-type' ? 0 : PICKER_HEIGHT, {
        duration: 200,
      });
      setActiveTool(activeTool === 'line-type' ? null : 'line-type');
    };

    const onLineTypeChange = (lineTypeItem: LineTypeItem) => {
      setActiveTool(null);
      pickerHeight.value = withTiming(0, { duration: 200 });
      updateLineTypeItem(lineTypeItem);
      ChartIQ.setDrawingParams(DrawingParams.LINE_TYPE, lineTypeItem.value);
      ChartIQ.setDrawingParams(DrawingParams.LINE_WIDTH, lineTypeItem.lineWidth.toString());
    };

    const handleSettingsPress = () => {
      // @ts-ignore
      navigation.navigate({
        name: RootStack.Drawings,
        params: {
          screen: DrawingsStack.DrawingToolsSettings,
          params: {
            title: title,
            name: name,
            settings: {
              ...drawingSettings,
              fillColor,
              color: lineColor,
              pattern: lineType,
            },
          },
        },
      });
    };

    const pickerContainerStyle = useAnimatedStyle(() => ({
      height: pickerHeight.value,
      backgroundColor: theme.colors.backgroundSecondary,
    }));

    const onDrawingToolChange = () => {
      'worklet';
      setActiveTool(null);
      pickerHeight.value = withTiming(0, { duration: 200 });
      handleDrawingTool();
    };

    const Icon = Icons.drawingTools[name];
    const LineTypeIcon = currentLineType.Icon;

    return (
      <Animated.View style={[animatedStyles]}>
        <Animated.View style={pickerContainerStyle}>
          <HorizontalColorPicker
            active={activeTool === 'fill-color'}
            onChange={handleFillColorChange}
            activeColor={fillColor ?? null}
          />
          <HorizontalColorPicker
            active={activeTool === 'line-color'}
            onChange={handleLineColorChange}
            activeColor={lineColor ?? null}
          />
          <HorizontalLineTypePicker
            active={activeTool === 'line-type'}
            activeItem={currentLineType}
            onChange={onLineTypeChange}
          />
        </Animated.View>
        <Animated.View style={[styles.container]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            scrollEnabled={false}
          >
            <Pressable onPress={onDrawingToolChange} style={styles.itemContainer}>
              {!loading ? (
                <Icon
                  width={24}
                  height={24}
                  fill={theme.colors.buttonText}
                  stroke={theme.colors.buttonText}
                />
              ) : (
                <ActivityIndicator style={styles.loading} color={theme.colors.colorPrimary} />
              )}
            </Pressable>
            {loading ? null : (
              <>
                {supportingFillColor && (
                  <Pressable style={[styles.itemContainer]} onPress={toggleFillColor}>
                    <Icons.FillColor
                      iconColor={theme.colors.buttonText}
                      selectedColor={fillColor}
                    />
                  </Pressable>
                )}
                {supportingLineColor && (
                  <Pressable style={[styles.itemContainer]} onPress={toggleLineColor}>
                    <Icons.LineColor
                      iconColor={theme.colors.buttonText}
                      selectedColor={lineColor}
                    />
                  </Pressable>
                )}
                {supportingLineType ? (
                  <Pressable onPress={toggleLineType} style={styles.itemContainer}>
                    <LineTypeIcon
                      width={24}
                      height={24}
                      fill={theme.colors.buttonText}
                      stroke={theme.colors.buttonText}
                      strokeWidth={currentLineType.lineWidth}
                    />
                  </Pressable>
                ) : null}
                {supportingSettings && (
                  <Pressable onPress={handleSettingsPress} style={styles.itemContainer}>
                    <Icons.menuSettings width={24} height={24} fill={theme.colors.buttonText} />
                  </Pressable>
                )}
              </>
            )}
          </ScrollView>
          <View
            style={[
              styles.safeView,
              {
                bottom: -bottom,
                height: bottom,
              },
            ]}
          />
        </Animated.View>
      </Animated.View>
    );
  },
);

DrawingToolManager.displayName = 'DrawingToolManager';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: 50,
      backgroundColor: theme.colors.buttonBackground,
    },
    contentContainer: {
      alignContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 16,
    },
    itemContainer: {
      backgroundColor: theme.colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      marginRight: 16,
    },
    loading: {
      width: 24,
      height: 24,
    },
    safeView: {
      position: 'absolute',
      left: 0,
      width: '100%',
      backgroundColor: theme.colors.backgroundSecondary,
    },
  });

export default DrawingToolManager;
