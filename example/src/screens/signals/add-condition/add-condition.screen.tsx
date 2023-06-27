import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { getChartAggregationType, getStudyParameters } from 'react-native-chart-iq-wrapper';

import { StudyParameter } from '~/model';
import { Condition, NullableCondition } from '~/model/signals/condition';
import { MarkerOption } from '~/model/signals/marker-option';
import { SignalJoiner } from '~/model/signals/signal';
import { SignalOperatorValues, SignalOperator } from '~/model/signals/signal-operator';
import { formatStudyName } from '~/shared/helpers';
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

const AddCondition: React.FC<AddConditionProps> = ({ route: { params }, navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { translations } = useTranslations();
  const study = params?.study;
  const condition = params?.condition;
  const id = params?.id;
  const joiner = params?.joiner;
  const selectFromListRef = React.useRef<SelectOptionFromListMethods>(null);
  const colorSelectorRef = React.useRef<ColorSelectorMethods>(null);
  const markerOptionRef = React.useRef<MarkerOptionsFormMethods>(null);
  const [selectedCondition, setSelectedCondition] = useState<NullableCondition | null>(null);
  const [secondIndicatorValue, setSecondIndicatorValue] = useState<string | null>('0');
  const [outputParams, setOutputParams] = useState<Array<StudyParameter>>([]);
  const [aggregationType, setAggregationType] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({
      title: `${params.index + 1} Condition`,
    });
  }, [navigation, params.index]);

  const get = useCallback(async () => {
    const outputs = await getStudyParameters(study, 'Outputs');
    const aggregation = await getChartAggregationType();
    setAggregationType(aggregation);
    setOutputParams(outputs);
    if (condition) {
      const isSecondIndicatorValueNumber = !Number.isNaN(Number(condition.rightIndicator));

      setSelectedCondition({
        ...condition,
        rightIndicator: isSecondIndicatorValueNumber ? 'Value' : condition.rightIndicator,
      });

      if (isSecondIndicatorValueNumber) {
        setSecondIndicatorValue(condition.rightIndicator);
      }
    } else {
      setSelectedCondition({
        leftIndicator: outputs[0]?.name ? `${outputs[0]?.name} ${study.shortName}` : null,
        signalOperator: null,
        markerOption: {
          color: (outputs[0]?.value as string) ?? '#000000',
        },
        rightIndicator: null,
      });
    }
  }, [condition, study]);

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
          rightInd = null;
        } else {
          const unusedIndicator = outputParams.find((item) => {
            return !leftIndicator.includes(item.name);
          })?.name;

          rightInd = prevState.rightIndicator ?? unusedIndicator ?? 'Value';
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

        return {
          ...prevState,
          leftIndicator: indicator?.name + ' ' + study.shortName,
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
          rightIndicator: indicator?.name ?? (key as string),
        };
      });
    }
  };

  const handleIndicator = (id: string, selected?: string) => {
    let data = outputParams.map(({ name }) => ({
      key: name,
      value: `${name} ${study.shortName}`,
    }));

    if (id === SECOND_INDICATOR) {
      data = [
        ...data.filter(({ key }) => !selectedCondition?.leftIndicator?.includes(key)),
        { key: 'Value', value: 'Value' },
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

    const leftIndicator =
      selectedCondition?.leftIndicator || (outputParams[0]?.name ?? '' + ' ' + study.shortName);
    const rightIndicator =
      selectedCondition?.rightIndicator === 'Value'
        ? secondIndicatorValue
        : selectedCondition?.rightIndicator + ' ' + study.shortName ?? null;
    const signalOperator = selectedCondition?.signalOperator ?? SignalOperator.DOES_NOT_CHANGE;

    const addCondition: Condition = {
      leftIndicator,
      rightIndicator,
      markerOption,
      signalOperator,
    };

    navigation.navigate(SignalsStack.AddSignal, { addCondition: { condition: addCondition, id } });
  }, [
    id,
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
          <Pressable onPress={handleSave}>
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
    selectedCondition?.signalOperator && selectedCondition.rightIndicator === 'Value';

  const handleSecondIndicatorValue = (text: string) => {
    const number = Number(text);
    if (Number.isNaN(number)) {
      setSecondIndicatorValue((0.0).toString());
      return;
    }

    setSecondIndicatorValue(text);
  };

  return (
    <ScrollView>
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
                onChangeText={handleSecondIndicatorValue}
                keyboardType="numeric"
                defaultValue="0.0"
                value={secondIndicatorValue ?? undefined}
                style={styles.textInput}
                placeholderTextColor={theme.colors.placeholder}
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
      <SelectFromList ref={selectFromListRef} onChange={onChangeFromList} />
      <ColorSelector onChange={handleColorChange} ref={colorSelectorRef} />
    </ScrollView>
  );
};

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
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
    },
  });

export default AddCondition;
