import { useHeaderHeight } from '@react-navigation/elements';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  TextInputEndEditingEventData,
} from 'react-native';
import {
  ChartIQ,
  SignalOperatorValues,
  SignalOperator,
  SignalJoiner,
  MarkerOption,
  Condition,
  NullableCondition,
  StudyParameter,
} from 'react-native-chart-iq';
import { SafeAreaView } from 'react-native-safe-area-context';

import { defaultHitSlop, edges } from '~/constants';
import { formatNumber, formatStudyName } from '~/shared/helpers';
import { useTranslations } from '~/shared/hooks/use-translations';
import { SignalsStack, SignalsStackParamList } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';
import { ColorSelector } from '~/ui/color-selector';
import { ColorSelectorMethods } from '~/ui/color-selector/color-selector.component';
import { ListItem } from '~/ui/list-item';
import { SelectFromList } from '~/ui/select-from-list';
import { SelectOptionFromListMethods } from '~/ui/select-from-list/select-from-list.component';

import { MarkerOptionsForm } from './components/marker-options-form';
import { MarkerOptionsFormMethods } from './components/marker-options-form/marker-options-form.component';

interface AddConditionProps
  extends NativeStackScreenProps<SignalsStackParamList, SignalsStack.AddCondition> {}

const CONDITION = 'CONDITION';
const FIRST_INDICATOR = 'FIRST_INDICATOR';
const SECOND_INDICATOR = 'SECOND_INDICATOR';
const VALUE = 'Value';

const AddCondition: React.FC<AddConditionProps> = ({ route: { params }, navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { translations } = useTranslations();
  const height = useHeaderHeight();
  const study = params?.study;
  const condition = params?.condition;
  const id = params?.id;
  const joiner = params?.joiner;
  const isEdit = params?.isEdit;
  const selectFromListRef = React.useRef<SelectOptionFromListMethods>(null);
  const colorSelectorRef = React.useRef<ColorSelectorMethods>(null);
  const markerOptionRef = React.useRef<MarkerOptionsFormMethods>(null);
  const [selectedCondition, setSelectedCondition] = useState<NullableCondition | null>(null);
  const [secondIndicatorValue, setSecondIndicatorValue] = useState<string | null>('0.0');
  const [outputParams, setOutputParams] = useState<Array<StudyParameter>>([]);
  const [aggregationType, setAggregationType] = useState<string | null>(null);
  const display = Platform.select({
    ios: study.display,
    android: study.shortName,
  });

  useEffect(() => {
    navigation.setOptions({
      title: `${params.index + 1} Condition`,
    });
  }, [navigation, params.index]);

  const get = useCallback(async () => {
    const outputs = await ChartIQ.getStudyParameters(study, 'Outputs');

    const aggregation = await ChartIQ.getChartAggregationType();
    setAggregationType(aggregation);
    setOutputParams(outputs);
    if (condition) {
      if (condition?.rightIndicator === '') {
        setSelectedCondition(condition);
      } else {
        const isSecondIndicatorValueNumber = !Number.isNaN(Number(condition?.rightIndicator));

        setSelectedCondition({
          ...condition,
          rightIndicator: isSecondIndicatorValueNumber ? VALUE : condition?.rightIndicator,
        });

        if (isSecondIndicatorValueNumber) {
          setSecondIndicatorValue(condition.rightIndicator);
        }
      }
    } else {
      setSelectedCondition({
        leftIndicator: outputs[0]?.name ? `${outputs[0]?.name} ${display}` : null,
        signalOperator: null,
        markerOption: {
          color: (outputs[0]?.value as string) ?? '#000000',
        },
        rightIndicator: '',
      });
    }
  }, [condition, display, study]);

  useEffect(() => {
    get();
  }, [get]);

  const onChangeFromList = ({ key }: { value: string; key: string }, id: string) => {
    const leftIndicator = selectedCondition?.leftIndicator ?? '';
    if (id === CONDITION) {
      setSelectedCondition((prevState) => {
        if (!prevState) {
          return null;
        }

        let rightInd = prevState.rightIndicator;
        if (
          key === SignalOperator.TURNS_UP ||
          key === SignalOperator.TURNS_DOWN ||
          key === SignalOperator.INCREASES ||
          key === SignalOperator.DECREASES ||
          key === SignalOperator.DOES_NOT_CHANGE
        ) {
          rightInd = '';
        } else {
          const unusedIndicator = outputParams.find((item) => {
            return !leftIndicator.includes(item.name);
          })?.name;

          rightInd = prevState.rightIndicator || `${unusedIndicator} ${display}` || VALUE;
        }

        const color =
          (outputParams.find(({ name }) => {
            return leftIndicator.trim().includes(name.trim());
          })?.value as string) ?? outputParams[0]?.value;

        return {
          ...prevState,
          signalOperator: key as SignalOperator,
          rightIndicator: rightInd,
          markerOption: {
            ...prevState.markerOption,
            color,
          },
        };
      });
    }
    if (id === FIRST_INDICATOR) {
      const indicator = outputParams.find(({ name }) => name === key);
      setSelectedCondition((prevState) => {
        if (!prevState) {
          return null;
        }
        let rightIndValue = prevState.rightIndicator;
        if (rightIndValue === null) {
          rightIndValue = outputParams.find(({ name }) =>
            prevState.leftIndicator?.includes(name),
          )?.name;
        }

        if (prevState.rightIndicator?.includes(key)) {
          rightIndValue =
            outputParams.find(({ name }) => !name.includes(key))?.name + ' ' + display;
        }

        return {
          ...prevState,
          leftIndicator: indicator?.name + ' ' + display,
          rightIndicator: rightIndValue,
          markerOption: {
            ...prevState.markerOption,
            color: indicator?.value as string,
          },
        };
      });
    }
    if (id === SECOND_INDICATOR) {
      const indicator = outputParams.find(({ name }) => name === key);
      setSelectedCondition((prevState) => {
        if (!prevState) {
          return null;
        }

        return {
          ...prevState,
          rightIndicator:
            key === VALUE ? VALUE : `${indicator?.name ?? (key as string)} ${display}`,
        };
      });
    }
  };

  const handleIndicator = (id: string, selected?: string) => {
    let data = outputParams.map(({ name }) => ({
      key: name,
      value: `${name} ${display}`,
    }));

    if (id === SECOND_INDICATOR) {
      data = [
        ...data.filter(({ key }) => !selectedCondition?.leftIndicator?.includes(key)),
        { key: VALUE, value: VALUE },
        { key: 'Open', value: 'Open' },
        { key: 'High', value: 'High' },
        { key: 'Low', value: 'Low' },
        { key: 'Close', value: 'Close' },
      ];
    }

    selectFromListRef.current?.open({
      data,
      selected: selected ?? '',
      id,
      title: id === SECOND_INDICATOR ? 'Indicator 2' : 'Indicator 1',
    });
  };

  const handleAddCondition = () => {
    const data = Object.values(SignalOperatorValues).map(({ key, description }) => ({
      key: key,
      value: description,
    }));
    selectFromListRef.current?.open({
      data,
      selected: selectedCondition?.signalOperator ?? '',
      id: CONDITION,
      title: 'Condition',
    });
  };

  const handleColor = () => {
    colorSelectorRef.current?.present(selectedCondition?.leftIndicator ?? '', markerColor);
  };

  const handleColorChange = (input: string) => {
    setSelectedCondition((prevState) => {
      if (!prevState) return null;

      return {
        ...prevState,
        markerOption: {
          ...prevState.markerOption,
          color: input,
        } as MarkerOption,
      };
    });
  };

  const handleSave = useCallback(() => {
    const markerOption = markerOptionRef.current?.getMarkerOptions();
    if (!markerOption) {
      return;
    }
    const value = secondIndicatorValue || '0.0';
    const leftIndicator =
      selectedCondition?.leftIndicator || (outputParams[0]?.name ?? '' + ' ' + study.shortName);

    let rightIndicator = selectedCondition?.rightIndicator;

    if (rightIndicator === VALUE) {
      rightIndicator = value;
    }

    const signalOperator = selectedCondition?.signalOperator ?? SignalOperator.DOES_NOT_CHANGE;

    const addCondition: Condition = {
      leftIndicator: leftIndicator.trim(),
      rightIndicator: rightIndicator?.trim() || '',
      markerOption,
      signalOperator,
    };

    navigation.navigate(SignalsStack.AddSignal, {
      addCondition: { condition: addCondition, id },
      isEdit,
    });
  }, [
    id,
    isEdit,
    navigation,
    outputParams,
    secondIndicatorValue,
    selectedCondition?.leftIndicator,
    selectedCondition?.rightIndicator,
    selectedCondition?.signalOperator,
    study.shortName,
  ]);

  useEffect(() => {
    if (selectedCondition?.signalOperator) {
      navigation.setOptions({
        headerRight: () => (
          <Pressable hitSlop={defaultHitSlop} onPress={handleSave}>
            <Text style={styles.headerRight}>{translations.Save}</Text>
          </Pressable>
        ),
      });
    }
  }, [
    handleSave,
    navigation,
    selectedCondition?.signalOperator,
    styles.headerRight,
    translations.Save,
  ]);

  const rightIndicator = outputParams.find(
    ({ name }) => name === selectedCondition?.rightIndicator,
  );

  const selectedOperator = SignalOperatorValues.find(
    (item) => item.key === selectedCondition?.signalOperator,
  );
  const leftIndicatorDescription = selectedCondition?.leftIndicator;
  const rightIndicatorDescription = rightIndicator
    ? `${selectedCondition?.rightIndicator ?? ''} ${study.name}`
    : selectedCondition?.rightIndicator ?? '';
  const markerColor = selectedCondition?.markerOption?.color ?? '';

  const hideSecondIndicator =
    selectedCondition?.signalOperator &&
    (selectedCondition?.signalOperator === SignalOperator.TURNS_UP ||
      selectedCondition?.signalOperator === SignalOperator.TURNS_DOWN ||
      selectedCondition?.signalOperator === SignalOperator.INCREASES ||
      selectedCondition?.signalOperator === SignalOperator.DECREASES ||
      selectedCondition?.signalOperator === SignalOperator.DOES_NOT_CHANGE);

  const showValueSelector =
    selectedCondition?.signalOperator && selectedCondition.rightIndicator === VALUE;

  const handleEndEditingSecondIndicatorValue = ({
    nativeEvent: { text },
  }: NativeSyntheticEvent<TextInputChangeEventData | TextInputEndEditingEventData>) => {
    setSecondIndicatorValue(formatNumber(text));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'height' : undefined}
      keyboardVerticalOffset={height}
    >
      <SafeAreaView edges={edges} style={styles.container}>
        <ScrollView style={styles.container} onTouchStart={Keyboard.dismiss}>
          <Text style={styles.title}>Condition settings</Text>
          <ListItem
            onPress={() => handleIndicator(FIRST_INDICATOR, selectedCondition?.leftIndicator ?? '')}
            title="Indicator 1"
            value={formatStudyName(leftIndicatorDescription) ?? undefined}
          />
          <ListItem
            onPress={handleAddCondition}
            title="Condition "
            value={selectedOperator?.description ?? 'Select Action'}
          />

          {selectedCondition?.signalOperator ? (
            <>
              {hideSecondIndicator ? null : (
                <ListItem
                  onPress={() =>
                    handleIndicator(SECOND_INDICATOR, selectedCondition?.rightIndicator ?? '')
                  }
                  title="Indicator 2"
                  value={formatStudyName(rightIndicatorDescription)}
                />
              )}
              {showValueSelector ? (
                <ListItem title="Value">
                  <TextInput
                    onChangeText={(text) => setSecondIndicatorValue(text)}
                    keyboardType="numbers-and-punctuation"
                    defaultValue="0.0"
                    value={secondIndicatorValue ?? undefined}
                    style={styles.textInput}
                    placeholderTextColor={theme.colors.placeholder}
                    onEndEditing={handleEndEditingSecondIndicatorValue}
                  />
                </ListItem>
              ) : null}

              <MarkerOptionsForm
                showAppearance={params.index === 0 || joiner === SignalJoiner.OR}
                color={markerColor}
                onColorPressed={handleColor}
                ref={markerOptionRef}
                markerOptions={selectedCondition?.markerOption ?? undefined}
                aggregationType={aggregationType}
              />
            </>
          ) : null}
          <SelectFromList
            compare={(a, b) => a.includes(b)}
            ref={selectFromListRef}
            onChange={onChangeFromList}
          />
          <ColorSelector onChange={handleColorChange} ref={colorSelectorRef} />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    title: {
      paddingVertical: 8,
      paddingLeft: 16,
      textTransform: 'uppercase',
      color: colors.cardSubtitle,
    },
    itemValue: {
      color: colors.cardSubtitle,
      fontSize: 16,
    },
    row: {
      flexDirection: 'row',
    },
    headerRight: {
      color: colors.colorPrimary,
    },
    textInput: {
      padding: 0,
      color: colors.cardSubtitle,
      minWidth: 100,
      textAlign: 'right',
    },
  });

export default AddCondition;
