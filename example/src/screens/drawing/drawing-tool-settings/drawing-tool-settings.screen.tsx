import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useLayoutEffect, useRef, useContext, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  SwitchChangeEvent,
  TextInputChangeEventData,
  NativeSyntheticEvent,
} from 'react-native';
import { ChartIQ, DrawingParams } from 'react-native-chart-iq';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icons from '~/assets/icons';
import { LineTypeItem } from '~/assets/icons/line-types/line-types';
import { edges } from '~/constants';
import { DrawingContext } from '~/context/drawing-context/drawing.context';
import { colorInitializer } from '~/shared/helpers';
import { useUpdateDrawingTool } from '~/shared/hooks/use-update-drawing-tool';
import { DrawingToolsRoute, DrawingToolsSettings, DrawingsStack } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';
import { BottomSheetMethods } from '~/ui/bottom-sheet';
import ColorSelector, { ColorSelectorMethods } from '~/ui/color-selector/color-selector.component';
import LineTypeSelector from '~/ui/line-type-selector/line-type-selector.component';
import { ListItem } from '~/ui/list-item';

const DrawingToolSettings: React.FC = () => {
  const { params } = useRoute<DrawingToolsRoute>();
  const navigation = useNavigation<DrawingToolsSettings>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const colorSelectorRef = useRef<ColorSelectorMethods>(null);
  const lineTypeSelectorRef = useRef<BottomSheetMethods>(null);
  const {
    drawingSettings,
    supportedSettings: {
      supportingFont,
      supportingFillColor,
      supportingLineColor,
      supportingLineType,
      supportingFibonacci,
      supportingDeviations,
      supportingVolumeProfile,
      supportingAxisLabel,
      supportingElliottWave,
    },
    currentLineType,
  } = useContext(DrawingContext);
  const {
    color: lineColorValue,
    fillColor: fillColorValue,
    font,
    volumeProfile,
    waveParameters,
  } = drawingSettings;

  const [fillColor, setFillColor] = useState(() => colorInitializer(fillColorValue, theme.isDark));
  const [lineColor, setLineColor] = useState(() => colorInitializer(lineColorValue, theme.isDark));

  const [axisLabel, setAxisLabel] = useState(() => drawingSettings.axisLabel);
  const [isBold, setIsBold] = useState(() => font.weight === 'bold');
  const [isItalic, setIsItalic] = useState(() => font.style === 'italic');

  const { updateFillColor, updateLineColor, updateLineTypeItem, updateDrawingSettings } =
    useUpdateDrawingTool();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: params.title,
    });
  }, [navigation, params.title]);

  const toggleFillColor = () => {
    colorSelectorRef.current?.present(DrawingParams.FILL_COLOR, fillColor);
  };
  const toggleLineColor = () => {
    colorSelectorRef.current?.present(DrawingParams.LINE_COLOR, lineColor);
  };
  const toggleLineType = () => {
    lineTypeSelectorRef.current?.present('');
  };

  const onLineTypeChange = (lineTypeItem: LineTypeItem) => {
    updateLineTypeItem(lineTypeItem);
    ChartIQ.setDrawingParams(DrawingParams.LINE_TYPE, lineTypeItem.value);
    ChartIQ.setDrawingParams(DrawingParams.LINE_WIDTH, lineTypeItem.lineWidth.toString());
  };

  const onColorChange = (color: string, id?: string | undefined) => {
    if (!id) return;

    if (id === DrawingParams.FILL_COLOR) {
      updateFillColor(color);
      setFillColor(color);
      ChartIQ.setDrawingParams(DrawingParams.FILL_COLOR, color);
    }
    if (id === DrawingParams.LINE_COLOR) {
      updateLineColor(color);
      setLineColor(color);
      ChartIQ.setDrawingParams(DrawingParams.LINE_COLOR, color);
    }
  };

  const toggleBoldFontStyle = () => {
    setIsBold((prevState) => !prevState);
    setTimeout(() => {
      const newWeight = font.weight === '300' ? 'bold' : '300';
      ChartIQ.setDrawingParams(DrawingParams.WEIGHT, newWeight);

      updateDrawingSettings((prevState) => ({
        ...prevState,
        font: {
          ...prevState.font,
          weight: newWeight,
        },
      }));
    });
  };

  const toggleItalicFontStyle = () => {
    setIsItalic((prevState) => !prevState);
    setTimeout(() => {
      const newStyle = font.style === 'normal' ? 'italic' : 'normal';

      ChartIQ.setDrawingParams(DrawingParams.STYLE, newStyle);

      updateDrawingSettings((prevState) => ({
        ...prevState,
        font: {
          ...prevState.font,
          style: newStyle,
        },
      }));
    });
  };

  const handleNavigate = (
    routeName:
      | DrawingsStack.DrawingToolsFontFamily
      | DrawingsStack.DrawingToolsFontSizes
      | DrawingsStack.DrawingToolsFibonacci
      | DrawingsStack.DrawingToolsSTDDeviation
      | DrawingsStack.DrawingToolsImpulse
      | DrawingsStack.DrawingToolCorrective
      | DrawingsStack.DrawingToolDecoration,
  ) => {
    if (DrawingsStack.DrawingToolsFibonacci === routeName) {
      navigation.navigate(routeName, { filterNegative: params.title === 'Fib Arc' });
      return;
    }
    navigation.navigate(routeName, undefined);
  };

  const handleAxisLabelChange = ({ nativeEvent: { value } }: SwitchChangeEvent) => {
    setAxisLabel(value);
    updateDrawingSettings((prevState) => ({
      ...prevState,
      axisLabel: value,
    }));

    ChartIQ.setDrawingParams(DrawingParams.AXIS_LABEL, JSON.stringify(value));
  };

  const handleVolumeProfileChange = ({
    nativeEvent: { text },
  }: NativeSyntheticEvent<TextInputChangeEventData>) => {
    updateDrawingSettings((prevState) => ({
      ...prevState,
      volumeProfile: {
        priceBuckets: +text,
      },
    }));

    ChartIQ.setDrawingParams(DrawingParams.PRICE_BUCKETS, text);
  };

  const toggleShowLines = () => {
    updateDrawingSettings((prevState) => {
      const value = !prevState.waveParameters.showLines;
      ChartIQ.setDrawingParams(DrawingParams.SHOW_LINES, JSON.stringify(value));
      return {
        ...prevState,
        waveParameters: {
          ...prevState.waveParameters,
          showLines: value,
        },
      };
    });
  };

  return (
    <>
      <SafeAreaView edges={edges} style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.container}>
          {supportingFillColor ? (
            <ListItem onPress={toggleFillColor} key="Fill color" title="Fill color">
              <View style={[styles.colorBox, { backgroundColor: fillColor }]} />
            </ListItem>
          ) : null}
          {supportingLineColor ? (
            <ListItem onPress={toggleLineColor} key="Line color" title="Line color">
              <View style={[styles.colorBox, { backgroundColor: lineColor }]} />
            </ListItem>
          ) : null}
          {supportingLineType ? (
            <ListItem onPress={toggleLineType} key="Line type" title="Line type">
              <currentLineType.Icon
                width={24}
                height={24}
                fill={theme.colors.buttonText}
                stroke={theme.colors.buttonText}
              />
            </ListItem>
          ) : null}
          {supportingFont ? (
            <>
              <ListItem
                onPress={() => handleNavigate(DrawingsStack.DrawingToolsFontFamily)}
                key="font-family"
                title="Font Family"
              >
                <View style={styles.listItemDescriptionContainer}>
                  <Text style={styles.text}>{font.family}</Text>
                  <Icons.chevronRight fill={theme.colors.cardSubtitle} />
                </View>
              </ListItem>

              <ListItem
                onPress={() => handleNavigate(DrawingsStack.DrawingToolsFontSizes)}
                key="font-size"
                title="Font Size"
              >
                <View style={styles.listItemDescriptionContainer}>
                  <Text style={styles.text}>{font.size}</Text>
                  <Icons.chevronRight fill={theme.colors.cardSubtitle} />
                </View>
              </ListItem>
              <ListItem key="font-style" title="Font Style">
                <View style={styles.row}>
                  <Pressable
                    onPress={toggleBoldFontStyle}
                    style={[styles.fontStyle, isBold ? styles.fontStyleSelected : null]}
                  >
                    <Text style={[styles.letter, styles.bold, styles.text]}>B</Text>
                  </Pressable>
                  <Pressable
                    onPress={toggleItalicFontStyle}
                    style={[styles.fontStyle, isItalic ? styles.fontStyleSelected : null]}
                  >
                    <Text style={[styles.letter, styles.bold, styles.text]}>I</Text>
                  </Pressable>
                </View>
              </ListItem>
            </>
          ) : null}
          {supportingAxisLabel ? (
            <ListItem key="axis-labelr" title="Axis label">
              <Switch value={axisLabel} onChange={handleAxisLabelChange} />
            </ListItem>
          ) : null}
          {supportingFibonacci ? (
            <ListItem
              onPress={() => handleNavigate(DrawingsStack.DrawingToolsFibonacci)}
              title="Fibonacci settings"
            >
              <Icons.chevronRight fill={theme.colors.border} />
            </ListItem>
          ) : null}
          {supportingDeviations ? (
            <ListItem
              onPress={() => handleNavigate(DrawingsStack.DrawingToolsSTDDeviation)}
              title="STD Deviations"
            >
              <Icons.chevronRight fill={theme.colors.border} />
            </ListItem>
          ) : null}
          {supportingVolumeProfile ? (
            <ListItem title="Price Buckets">
              <TextInput
                value={volumeProfile.priceBuckets.toString()}
                onChange={handleVolumeProfileChange}
                style={styles.text}
              />
            </ListItem>
          ) : null}
          {supportingElliottWave ? (
            <>
              <ListItem
                onPress={() => handleNavigate(DrawingsStack.DrawingToolsImpulse)}
                title="Impulse"
              >
                <View style={styles.listItemDescriptionContainer}>
                  <Text style={styles.text}>{waveParameters.impulse}</Text>
                  <Icons.chevronRight fill={theme.colors.cardSubtitle} />
                </View>
              </ListItem>
              <ListItem
                onPress={() => handleNavigate(DrawingsStack.DrawingToolCorrective)}
                title="Corrective"
              >
                <View style={styles.listItemDescriptionContainer}>
                  <Text style={styles.text}>{waveParameters.corrective}</Text>
                  <Icons.chevronRight fill={theme.colors.cardSubtitle} />
                </View>
              </ListItem>

              <ListItem
                onPress={() => handleNavigate(DrawingsStack.DrawingToolDecoration)}
                title="Decoration"
              >
                <View style={styles.listItemDescriptionContainer}>
                  <Text style={[styles.text, styles.decorationTextStyle]}>
                    {waveParameters.decoration}
                  </Text>
                  <Icons.chevronRight fill={theme.colors.cardSubtitle} />
                </View>
              </ListItem>

              <ListItem title="Show Lines">
                <Switch onChange={toggleShowLines} value={waveParameters.showLines} />
              </ListItem>
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
      <ColorSelector ref={colorSelectorRef} onChange={onColorChange} />
      <LineTypeSelector
        selectedItem={currentLineType}
        ref={lineTypeSelectorRef}
        onChange={onLineTypeChange}
      />
    </>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    colorBox: {
      padding: 12,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    fontStyle: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginHorizontal: 4,
    },
    fontStyleSelected: {
      borderWidth: 2,
      borderColor: theme.colors.colorPrimary,
    },
    row: {
      flexDirection: 'row',
    },
    letter: {
      textAlign: 'center',
    },
    italic: {
      fontStyle: 'italic',
    },
    bold: {
      fontWeight: 'bold',
    },
    text: {
      color: theme.colors.cardSubtitle,
    },
    decorationTextStyle: {
      textTransform: 'capitalize',
    },
    listItemDescriptionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default DrawingToolSettings;
