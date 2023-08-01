import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { ChartIQ, DrawingParams, STDDeviationSettings } from 'react-native-chart-iq';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LineTypeItem } from '~/assets/icons/line-types/line-types';
import { defaultHitSlop, edges } from '~/constants';
import { DrawingContext } from '~/context/drawing-context/drawing.context';
import { useUpdateDrawingTool } from '~/shared/hooks/use-update-drawing-tool';
import { Theme, useTheme } from '~/theme';
import { BottomSheetMethods } from '~/ui/bottom-sheet';
import { ColorSelector } from '~/ui/color-selector';
import { ColorSelectorMethods } from '~/ui/color-selector/color-selector.component';
import { LineTypeSelector } from '~/ui/line-type-selector';
import { ListItem } from '~/ui/list-item';

import {
  STDDeviationItem,
  createSTDDeviationSettings,
  defaultLineType,
} from './std-deviation-settings.data';

const STDDeviationsSettingsScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { updateDrawingSettings } = useUpdateDrawingTool();
  const { drawingSettings } = useContext(DrawingContext);
  const [stdDeviationSettings, setStdDeviationSettings] = useState<STDDeviationItem[]>(() =>
    createSTDDeviationSettings(drawingSettings),
  );

  const [selectedLineType, setSelectedLineType] = useState<LineTypeItem>(defaultLineType);

  const colorSelectorRef = useRef<ColorSelectorMethods>(null);
  const lineTypeSelectorRef = useRef<BottomSheetMethods>(null);

  const navigation = useNavigation();

  const handleSave = useCallback(() => {
    const newSettings = stdDeviationSettings.reduce((acc, item, index) => {
      const { lineType, lineColor, showLine } = item;
      const { lineWidth, value } = lineType;

      return {
        [`active${index + 1}`]: showLine,
        [`color${index + 1}`]: lineColor,
        [`pattern${index + 1}`]: value,
        [`lineWidth${index + 1}`]: lineWidth,
        ...acc,
      };
    }, {} as STDDeviationSettings);

    updateDrawingSettings((prevState) => {
      return {
        ...prevState,
        ...newSettings,
      };
    });

    ChartIQ.setDrawingParams(DrawingParams.ACTIVE_1, JSON.stringify(newSettings.active1));
    ChartIQ.setDrawingParams(DrawingParams.ACTIVE_2, JSON.stringify(newSettings.active2));
    ChartIQ.setDrawingParams(DrawingParams.ACTIVE_3, JSON.stringify(newSettings.active3));

    ChartIQ.setDrawingParams(DrawingParams.COLOR_1, newSettings.color1);
    ChartIQ.setDrawingParams(DrawingParams.COLOR_2, newSettings.color2);
    ChartIQ.setDrawingParams(DrawingParams.COLOR_3, newSettings.color3);

    ChartIQ.setDrawingParams(DrawingParams.PATTERN_1, newSettings.pattern1);
    ChartIQ.setDrawingParams(DrawingParams.PATTERN_2, newSettings.pattern2);
    ChartIQ.setDrawingParams(DrawingParams.PATTERN_3, newSettings.pattern3);

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
