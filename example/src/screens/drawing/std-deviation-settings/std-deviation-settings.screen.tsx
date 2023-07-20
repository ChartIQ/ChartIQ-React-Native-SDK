import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { ChartIQ, DrawingParams } from 'react-native-chart-iq';
import { SafeAreaView } from 'react-native-safe-area-context';

import icons from '~/assets/icons';
import {
  LineTypeItem,
  findLineTypeItemByPatternAndWidth,
} from '~/assets/icons/line-types/line-types';
import { defaultHitSlop, edges } from '~/constants';
import { DrawingContext } from '~/context/drawing-context/drawing.context';
import { useUpdateDrawingTool } from '~/shared/hooks/use-update-drawing-tool';
import { Theme, useTheme } from '~/theme';
import { BottomSheetMethods } from '~/ui/bottom-sheet';
import { ColorSelector } from '~/ui/color-selector';
import { ColorSelectorMethods } from '~/ui/color-selector/color-selector.component';
import { LineTypeSelector } from '~/ui/line-type-selector';
import { ListItem } from '~/ui/list-item';

type STDDeviations = '1' | '2' | '3';

type STDDeviationItem = {
  name: STDDeviations;
  showLine: boolean;
  lineType: LineTypeItem;
  lineColor: string;
};

const defaultLineType = {
  Icon: icons.lineTypes.solid,
  lineWidth: 1,
  name: 'solid',
  value: 'solid',
};

const STDDeviationsSettingsScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { updateDrawingSettings } = useUpdateDrawingTool();
  const { drawingSettings } = useContext(DrawingContext);
  const [stdDeviationSettings, setStdDeviationSettings] = useState<STDDeviationItem[]>([
    {
      name: '1' as STDDeviations,
      showLine: drawingSettings.active1,
      lineType:
        findLineTypeItemByPatternAndWidth(drawingSettings.pattern1, drawingSettings.lineWidth1) ??
        defaultLineType,
      lineColor: drawingSettings.color1,
    },
    {
      name: '2' as STDDeviations,
      showLine: drawingSettings.active2,
      lineType:
        findLineTypeItemByPatternAndWidth(drawingSettings.pattern2, drawingSettings.lineWidth2) ??
        defaultLineType,
      lineColor: drawingSettings.color2,
    },
    {
      name: '3' as STDDeviations,
      showLine: drawingSettings.active3,
      lineType:
        findLineTypeItemByPatternAndWidth(drawingSettings.pattern2, drawingSettings.lineWidth2) ??
        defaultLineType,
      lineColor: drawingSettings.color3,
    },
  ] satisfies STDDeviationItem[]);

  const [selectedLineType, setSelectedLineType] = useState<LineTypeItem>(defaultLineType);

  const colorSelectorRef = useRef<ColorSelectorMethods>(null);
  const lineTypeSelectorRef = useRef<BottomSheetMethods>(null);

  const navigation = useNavigation();

  const handleSave = useCallback(() => {
    updateDrawingSettings((prevState) => {
      return {
        ...prevState,
        color1: stdDeviationSettings[0].lineColor,
        color2: stdDeviationSettings[1].lineColor,
        color3: stdDeviationSettings[2].lineColor,
        pattern1: stdDeviationSettings[0].lineType.value,
        pattern2: stdDeviationSettings[1].lineType.value,
        pattern3: stdDeviationSettings[2].lineType.value,
        active1: stdDeviationSettings[0].showLine,
        active2: stdDeviationSettings[1].showLine,
        active3: stdDeviationSettings[2].showLine,
        lineWidth1: stdDeviationSettings[0].lineType.lineWidth,
        lineWidth2: stdDeviationSettings[1].lineType.lineWidth,
        lineWidth3: stdDeviationSettings[2].lineType.lineWidth,
      };
    });
    ChartIQ.setDrawingParams(
      DrawingParams.ACTIVE_1,
      JSON.stringify(stdDeviationSettings[0].showLine),
    );
    ChartIQ.setDrawingParams(
      DrawingParams.ACTIVE_2,
      JSON.stringify(stdDeviationSettings[1].showLine),
    );
    ChartIQ.setDrawingParams(
      DrawingParams.ACTIVE_3,
      JSON.stringify(stdDeviationSettings[2].showLine),
    );

    ChartIQ.setDrawingParams(DrawingParams.COLOR_1, stdDeviationSettings[0].lineColor);
    ChartIQ.setDrawingParams(DrawingParams.COLOR_2, stdDeviationSettings[1].lineColor);
    ChartIQ.setDrawingParams(DrawingParams.COLOR_3, stdDeviationSettings[2].lineColor);

    ChartIQ.setDrawingParams(DrawingParams.PATTERN_1, stdDeviationSettings[0].lineType.value);
    ChartIQ.setDrawingParams(DrawingParams.PATTERN_2, stdDeviationSettings[1].lineType.value);
    ChartIQ.setDrawingParams(DrawingParams.PATTERN_3, stdDeviationSettings[2].lineType.value);

    navigation.goBack();
  }, [navigation, stdDeviationSettings, updateDrawingSettings]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable hitSlop={defaultHitSlop} onPress={handleSave}>
          <Text style={styles.text}>Save</Text>
        </Pressable>
      ),
    });
  }, [handleSave, navigation, styles.text, theme.colors.colorPrimary]);

  const defaultColor = theme.isDark ? theme.colors.white : 'black';

  const handleLineColor = useCallback(
    (id: string) => {
      const color =
        stdDeviationSettings.find((item) => item.name === id)?.lineColor || defaultColor;
      colorSelectorRef.current?.present(id, color);
    },
    [defaultColor, stdDeviationSettings],
  );

  const handleColorChange = (input: string, id: string) => {
    setStdDeviationSettings((prevState) =>
      prevState.map((item) => {
        if (item.name === id) {
          return { ...item, lineColor: input };
        }
        return item;
      }),
    );
  };

  const handleLineTypeChange = (input: LineTypeItem, id?: string) => {
    setStdDeviationSettings((prevState) =>
      prevState.map((item) => {
        if (item.name === id) {
          return { ...item, lineType: input };
        }
        return item;
      }),
    );
  };

  const handleShowLine = useCallback((id: string) => {
    setStdDeviationSettings((prevState) =>
      prevState.map((item) => {
        if (item.name === id) {
          return { ...item, showLine: !item.showLine };
        }
        return item;
      }),
    );
  }, []);

  const handleLineType = (id: string) => {
    setSelectedLineType(
      stdDeviationSettings.find((item) => item.name === id)?.lineType || defaultLineType,
    );
    lineTypeSelectorRef.current?.present(id);
  };

  return (
    <SafeAreaView edges={edges} style={styles.container}>
      <FlatList
        data={stdDeviationSettings}
        renderItem={({
          item: {
            lineColor,
            lineType: { Icon },
            name,
            showLine,
          },
        }) => {
          return (
            <>
              <ListItem title={`Show Line ${name}`}>
                <Switch
                  trackColor={{
                    false: theme.colors.border,
                    true: theme.colors.colorPrimary,
                  }}
                  value={showLine}
                  onChange={() => handleShowLine(name)}
                />
              </ListItem>
              <ListItem onPress={() => handleLineColor(name)} title={`Line ${name} color`}>
                <View style={[styles.colorBox, { backgroundColor: lineColor || defaultColor }]} />
              </ListItem>
              <ListItem title={`Line ${name} type`}>
                <Pressable onPress={() => handleLineType(name)} style={styles.lineContainer}>
                  <Icon
                    width={40}
                    height={40}
                    fill={theme.colors.buttonText}
                    stroke={theme.colors.buttonText}
                  />
                </Pressable>
              </ListItem>
            </>
          );
        }}
        keyExtractor={(item) => item.name + ' deviation'}
      />
      <ColorSelector ref={colorSelectorRef} onChange={handleColorChange} />
      <LineTypeSelector
        ref={lineTypeSelectorRef}
        onChange={handleLineTypeChange}
        selectedItem={selectedLineType}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    text: {
      color: theme.colors.colorPrimary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    colorBox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    lineContainer: {
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });

export default STDDeviationsSettingsScreen;
