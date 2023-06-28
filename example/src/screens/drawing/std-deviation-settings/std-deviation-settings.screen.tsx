import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { setDrawingParams } from 'react-native-chart-iq-wrapper';

import icons from '~/assets/icons';
import {
  LineTypeItem,
  findLineTypeItemByPatternAndWidth,
} from '~/assets/icons/line-types/line-types';
import { DrawingContext } from '~/context/drawing-context/drawing.context';
import { DrawingParams } from '~/model';
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
  const [selectedColor, setSelectedColor] = useState<string>('#000000');

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
    setDrawingParams(DrawingParams.ACTIVE_1, JSON.stringify(stdDeviationSettings[0].showLine));
    setDrawingParams(DrawingParams.ACTIVE_2, JSON.stringify(stdDeviationSettings[1].showLine));
    setDrawingParams(DrawingParams.ACTIVE_3, JSON.stringify(stdDeviationSettings[2].showLine));

    setDrawingParams(DrawingParams.COLOR_1, JSON.stringify(stdDeviationSettings[0].lineColor));
    setDrawingParams(DrawingParams.ACTIVE_2, JSON.stringify(stdDeviationSettings[1].lineColor));
    setDrawingParams(DrawingParams.ACTIVE_3, JSON.stringify(stdDeviationSettings[2].lineColor));

    setDrawingParams(
      DrawingParams.PATTERN_1,
      JSON.stringify(stdDeviationSettings[0].lineType.value),
    );
    setDrawingParams(
      DrawingParams.PATTERN_2,
      JSON.stringify(stdDeviationSettings[1].lineType.value),
    );
    setDrawingParams(
      DrawingParams.PATTERN_3,
      JSON.stringify(stdDeviationSettings[2].lineType.value),
    );

    navigation.goBack();
  }, [navigation, stdDeviationSettings, updateDrawingSettings]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleSave}>
          <Text style={styles.text}>Save</Text>
        </Pressable>
      ),
    });
  }, [handleSave, navigation, styles.text, theme.colors.colorPrimary]);

  const handleLineColor = useCallback(
    (id: string) => {
      const color = stdDeviationSettings.find((item) => item.name === id)?.lineColor || '#000000';
      setSelectedColor(color);
      colorSelectorRef.current?.present(id, color);
    },
    [stdDeviationSettings],
  );

  const handleColorChange = (input: string, id?: string) => {
    const newSettings = stdDeviationSettings.map((item) => {
      if (item.name === id) {
        return { ...item, lineColor: input };
      }
      return item;
    });

    setStdDeviationSettings(newSettings);
  };

  const handleLineTypeChange = (input: LineTypeItem, id?: string) => {
    const newSettings = stdDeviationSettings.map((item) => {
      if (item.name === id) {
        return { ...item, lineType: input };
      }
      return item;
    });

    setStdDeviationSettings(newSettings);
  };

  const handleShowLine = useCallback(
    (id: string) => {
      const newSettings = stdDeviationSettings.map((item) => {
        if (item.name === id) {
          return { ...item, showLine: !item.showLine };
        }
        return item;
      });

      setStdDeviationSettings(newSettings);
    },
    [stdDeviationSettings],
  );

  const handleLineType = (id: string) => {
    setSelectedLineType(
      stdDeviationSettings.find((item) => item.name === id)?.lineType || defaultLineType,
    );
    lineTypeSelectorRef.current?.present(id);
  };

  return (
    <>
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
                <Switch value={showLine} onChange={() => handleShowLine(name)} />
              </ListItem>

              <ListItem onPress={() => handleLineColor(name)} title={`Line ${name} color`}>
                <View style={[styles.colorBox, { backgroundColor: lineColor }]} />
              </ListItem>
              <ListItem title={`Line ${name} type`}>
                <Pressable onPress={() => handleLineType(name)} style={styles.lineContainer}>
                  <Icon width={40} height={40} fill="black" stroke="black" />
                </Pressable>
              </ListItem>
            </>
          );
        }}
        keyExtractor={(item) => item.name}
      />
      <ColorSelector
        ref={colorSelectorRef}
        onChange={handleColorChange}
        selectedColor={selectedColor}
      />
      <LineTypeSelector
        ref={lineTypeSelectorRef}
        onChange={handleLineTypeChange}
        selectedItem={selectedLineType}
      />
    </>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
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
