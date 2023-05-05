import { DrawingParams, Theme, useTheme } from '@chart-iq/chart-iq-sdk';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useContext } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { LineTypeItem } from '~/assets/icons/line-types/line-types';
import { DrawingToolsNavigation, RootStack } from '~/shared/navigation.types';

import Icons from '../../assets/icons';
import {
  DrawingContext,
  ChartIQWebViewContext,
} from '../../context/drawing-context/drawing.context';
import { useUpdateDrawingTool } from '../../shared/hooks/use-update-drawing-tool';
import { DrawingItem } from '../drawing-tools-selector/drawing-tools-selector.data';
import { HorizontalColorPicker } from '../horizontal-color-picker';
import { HorizontalLineTypePicker } from '../horizontal-line-type-picker';

interface DrawingToolManagerProps {
  drawingItem: DrawingItem;
  handleDrawingTool: () => void;
}

type DrawingTool = 'line-color' | 'fill-color' | 'line-type';

const DrawingToolManager: React.FC<DrawingToolManagerProps> = ({
  drawingItem,
  handleDrawingTool,
}) => {
  const navigation = useNavigation<DrawingToolsNavigation>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [activeTool, setActiveTool] = useState<DrawingTool | null>(null);
  const chartIQWebView = useContext(ChartIQWebViewContext);

  const { drawingSettings, supportedSettings, currentLineType } = useContext(DrawingContext);
  const { updateFillColor, updateLineColor, updateLineTypeItem } = useUpdateDrawingTool();

  const { color: lineColor, pattern: lineType, fillColor } = drawingSettings;
  const { supportingFillColor, supportingLineColor, supportingLineType, supportingSettings } =
    supportedSettings;

  const toggleFillColor = () => {
    setActiveTool(activeTool === 'fill-color' ? null : 'fill-color');
  };

  const handleFillColorChange = (color?: string) => {
    setActiveTool(null);

    if (color) {
      chartIQWebView.current?.setDrawingParameter(DrawingParams.FILL_COLOR, color);
      updateFillColor(color);
    }
  };

  const toggleLineColor = () => {
    setActiveTool(activeTool === 'line-color' ? null : 'line-color');
  };

  const handleLineColorChange = (color?: string) => {
    setActiveTool(null);

    if (color) {
      chartIQWebView.current?.setDrawingParameter(DrawingParams.LINE_COLOR, color);

      updateLineColor(color);
    }
  };

  const toggleLineType = () => {
    setActiveTool(activeTool === 'line-type' ? null : 'line-type');
  };

  const onLineTypeChange = (lineTypeItem: LineTypeItem) => {
    setActiveTool(null);
    updateLineTypeItem(lineTypeItem);
    chartIQWebView.current?.setDrawingParameter(DrawingParams.LINE_TYPE, lineTypeItem.value);
    chartIQWebView.current?.setDrawingParameter(
      DrawingParams.LINE_WIDTH,
      lineTypeItem.lineWidth.toString(),
    );
  };

  const handleSettingsPress = () => {
    navigation.navigate(RootStack.DrawingToolsSettings, {
      title: drawingItem.title,
      name: drawingItem.name,
      settings: {
        ...drawingSettings,
        fillColor,
        color: lineColor,
        pattern: lineType,
      },
    });
  };

  return (
    <View>
      <HorizontalColorPicker
        active={activeTool === 'fill-color'}
        onChange={handleFillColorChange}
        activeColor={fillColor}
      />
      <HorizontalColorPicker
        active={activeTool === 'line-color'}
        onChange={handleLineColorChange}
        activeColor={lineColor}
      />
      <HorizontalLineTypePicker
        active={activeTool === 'line-type'}
        activeItem={currentLineType}
        onChange={onLineTypeChange}
      />
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          scrollEnabled={false}
        >
          <Pressable onPress={handleDrawingTool} style={styles.itemContainer}>
            <drawingItem.Icon width={24} height={24} fill={theme.colors.buttonText} />
          </Pressable>
          {supportingFillColor && (
            <Pressable style={[styles.itemContainer]} onPress={toggleFillColor}>
              <Icons.FillColor iconColor={theme.colors.buttonText} selectedColor={fillColor} />
            </Pressable>
          )}
          {supportingLineColor && (
            <Pressable style={[styles.itemContainer]} onPress={toggleLineColor}>
              <Icons.LineColor iconColor={theme.colors.buttonText} selectedColor={lineColor} />
            </Pressable>
          )}
          {supportingLineType ? (
            <Pressable onPress={toggleLineType} style={styles.itemContainer}>
              <currentLineType.Icon
                width={24}
                height={24}
                fill={theme.colors.buttonText}
                stroke={theme.colors.buttonText}
              />
            </Pressable>
          ) : null}
          {supportingSettings && (
            <Pressable onPress={handleSettingsPress} style={styles.itemContainer}>
              <Icons.menuSettings width={24} height={24} fill={theme.colors.buttonText} />
            </Pressable>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

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
  });

export default DrawingToolManager;
