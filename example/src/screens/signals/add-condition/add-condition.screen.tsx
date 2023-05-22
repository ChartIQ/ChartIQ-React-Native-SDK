import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { getStudyParameters } from 'react-native-chart-iq-wrapper';

import { StudyParameter } from '~/model';
import { Condition } from '~/model/signals/condition';
import {
  SignalOperator,
  SignalOperatorListItem,
  SignalOperatorValues,
} from '~/model/signals/signal-operator';
import { SignalsStack, SignalsStackParamList } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';
import { SelectFromList } from '~/ui/select-from-list';
import { SelectOptionFromListMethods } from '~/ui/select-from-list/select-from-list.component';

import { MarkerOptionsForm } from './components/marker-options-form';

interface AddConditionProps
  extends NativeStackScreenProps<SignalsStackParamList, SignalsStack.AddCondition> {}

const FIRST_CONDITION = 'First condition';
const INDICATOR = 'Indicator';

const AddCondition: React.FC<AddConditionProps> = ({
  route: {
    params: { study },
  },
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const selectFromListRef = React.useRef<SelectOptionFromListMethods>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<StudyParameter>();
  const [operator, setOperator] = useState<SignalOperatorListItem | null>(null);

  const [inputParams, setInputParams] = useState<Array<StudyParameter>>([]);
  const [outputParams, setOutputParams] = useState<Array<StudyParameter>>([]);

  const get = useCallback(async () => {
    const inputs = await getStudyParameters(study, 'Inputs');
    const outputs = await getStudyParameters(study, 'Outputs');

    setInputParams(inputs);
    setOutputParams(outputs);
    setSelectedIndicator(outputs[0]);
  }, [study]);

  useEffect(() => {
    get();
  }, [get]);

  // console.log('study', study);
  // console.log('inputParams', inputParams);
  // console.log('outputParams', outputParams);

  const onChangeFromList = ({ key, value }: { value: string; key: string }, id: string) => {
    if (id === FIRST_CONDITION) {
      setOperator(
        (prevState) =>
          SignalOperatorValues.find(({ key: signalKey }) => signalKey === key) ?? prevState,
      );
    }
    if (id === INDICATOR) {
      setSelectedIndicator(outputParams.find(({ name }) => name === key));
    }
  };

  const handleIndicator = () => {
    const inputValues = inputParams
      .map(({ value }) => {
        if (typeof value === 'boolean') {
          return value ? 'y' : 'n';
        }

        return value;
      })
      .join(',');

    const data = outputParams.map(({ name }) => ({
      key: name,
      value: `${name} ${study.shortName} (${inputValues})`,
    }));
    selectFromListRef.current?.open(data, selectedIndicator?.name ?? '', INDICATOR);
  };

  const handleAddCondition = () => {
    const data = Object.values(SignalOperatorValues).map(({ key, description }) => ({
      key: key,
      value: description,
    }));
    selectFromListRef.current?.open(data, operator?.key ?? '', FIRST_CONDITION);
  };

  return (
    <>
      <Text style={styles.title}>Condition settings</Text>
      <ListItem
        onPress={handleIndicator}
        title="Indicator 1"
        value={`${selectedIndicator?.name} ${study.name}`}
      />
      <ListItem
        onPress={handleAddCondition}
        title="Condition "
        value={operator?.description ?? 'Select Action'}
      />

      {operator ? (
        <>
          <Text style={styles.title}>Appearance Settings</Text>
          <MarkerOptionsForm color={selectedIndicator?.value as string} />
        </>
      ) : null}
      <SelectFromList ref={selectFromListRef} onChange={onChangeFromList} />
    </>
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
  });

export default AddCondition;
