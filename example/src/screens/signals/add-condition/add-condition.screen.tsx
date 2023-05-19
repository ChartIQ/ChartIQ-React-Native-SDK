import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { getStudyParameters } from 'react-native-chart-iq-wrapper';

import { StudyParameter } from '~/model';
import { Condition } from '~/model/signals/condition';
import { SignalOperatorValues } from '~/model/signals/signal-operator';
import { SignalsStack, SignalsStackParamList } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';
import { SelectFromList } from '~/ui/select-from-list';
import { SelectOptionFromListMethods } from '~/ui/select-from-list/select-from-list.component';

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
  const [selectedConditions, setSelectedConditions] = React.useState<Condition[]>([]);
  const [inputParams, setInputParams] = useState<Array<StudyParameter>>([]);
  const [outputParams, setOutputParams] = useState<Array<StudyParameter>>([]);

  const get = useCallback(async () => {
    const inputs = await getStudyParameters(study, 'Inputs');
    const outputs = await getStudyParameters(study, 'Outputs');

    setInputParams(inputs);
    setOutputParams(outputs);
  }, [study]);

  useEffect(() => {
    get();
  }, [get]);

  console.log('study', study);
  // console.log('inputParams', inputParams);
  // console.log('outputParams', outputParams);

  const onChangeFromList = (value: string, id: string) => {
    if (id === FIRST_CONDITION) {
      console.log('FIRST_CONDITION', value);
    }
    if (id === INDICATOR) {
      console.log('INDICATOR', value);
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
    selectFromListRef.current?.open(data, data[0]?.key ?? '', INDICATOR);
  };

  const handleAddCondition = () => {
    const data = Object.entries(SignalOperatorValues).map(([key, value]) => ({
      key: value,
      value: key,
    }));
    selectFromListRef.current?.open(data, '', FIRST_CONDITION);
  };

  return (
    <>
      <SectionList
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Condition settings</Text>
            <ListItem onPress={handleIndicator} title="Indicator 1" value={study.name} />
            <ListItem onPress={handleAddCondition} title="Condition " value="Select Action" />
          </>
        }
        data={[]}
        sections={[]}
      />
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
