import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import {
  addSignal,
  addStudySignal,
  getStudyList,
  getStudyParameters,
} from 'react-native-chart-iq-wrapper';
import { TextInput } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';

import Icons from '~/assets/icons';
import { Condition } from '~/model/signals/condition';
import { Signal, SignalJoiner } from '~/model/signals/signal';
import { Study } from '~/model/study';
import { SignalsStack, SignalsStackParamList } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';
import { SelectFromList } from '~/ui/select-from-list';
import { SelectOptionFromListMethods } from '~/ui/select-from-list/select-from-list.component';

import ConditionItem from './components/condition-item/condition-item.component';
import { JoinSelector } from './components/join-selector';

const SELECT_STUDY = 'Select study';

interface AddSignalProps
  extends NativeStackScreenProps<SignalsStackParamList, SignalsStack.AddSignal> {}

const AddSignal: React.FC<AddSignalProps> = ({ navigation, route: { params } }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const selectFromListRef = React.useRef<SelectOptionFromListMethods>(null);
  const [studies, setStudies] = useState<Study[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const addCondition = params?.addCondition;
  const changedStudy = params?.changeStudy?.study;
  const [conditions, setConditions] = useState<Map<string, Condition>>(new Map());
  const [joiner, setJoiner] = useState<SignalJoiner>(SignalJoiner.OR);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      if (addCondition?.condition) {
        setConditions((prevState) => {
          const newConditions = new Map(prevState);
          newConditions.set(addCondition.id, addCondition.condition);

          return newConditions;
        });
      }
      if (changedStudy) {
        console.log('changedStudy', changedStudy);
        setSelectedStudy(changedStudy);
      }
    }, [addCondition, changedStudy]),
  );

  const get = useCallback(async () => {
    const studiesList = await getStudyList();

    setStudies(studiesList.filter(({ signalIQExclude }) => !signalIQExclude));
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  const handleSelectStudy = () => {
    selectFromListRef.current?.open(
      studies.map(({ name }) => ({ key: name, value: name })),
      selectedStudy?.name ?? '',
      SELECT_STUDY,
    );
  };

  const handleStudyChange = async ({ value }: { value: string }, _: string) => {
    const item = studies.find((item) => item.name === value) ?? null;
    const study = await addStudySignal(item?.shortName ?? '');
    setSelectedStudy(study);
  };

  const handleChangeStudyParams = async () => {
    if (selectedStudy === null) return;

    navigation.navigate(SignalsStack.ChangeStudyParameters, { study: selectedStudy });
  };

  const handleAddCondition = (id: string, index: number, input?: Condition) => {
    if (selectedStudy)
      navigation.navigate(SignalsStack.AddCondition, {
        study: selectedStudy,
        condition: input,
        id,
        index,
      });
  };

  const handleSave = useCallback(async () => {
    if (selectedStudy) {
      const stdy = await addStudySignal(selectedStudy.name);

      const mappedConditions = Array.from(conditions.values()).map((condition) => ({
        ...condition,
        leftIndicator: `${condition.leftIndicator} ${stdy?.name}`,
        rightIndicator: `${condition.rightIndicator} ${stdy?.name}`,
      }));

      const signal: Signal = {
        conditions: mappedConditions,
        joiner,
        name,
        disabled: false,
        description,
        study: stdy,
        uniqueId: '',
      };
      addSignal(signal, false);
      navigation.goBack();
    }
  }, [conditions, description, joiner, name, navigation, selectedStudy]);

  const data = Array.from(conditions).map(([id, condition]) => ({ id, condition }));

  useEffect(() => {
    if (selectedStudy && conditions.size > 0) {
      navigation.setOptions({
        headerRight: () => (
          <Text disabled={false} style={styles.saveButton} onPress={handleSave}>
            Save
          </Text>
        ),
      });
    } else {
      navigation.setOptions({
        headerRight: () => (
          <Text disabled={true} style={styles.saveButtonDisabled} onPress={handleSave}>
            Save
          </Text>
        ),
      });
    }
  }, [
    conditions.size,
    handleSave,
    navigation,
    selectedStudy,
    styles.saveButton,
    styles.saveButtonDisabled,
  ]);

  const ListFooterComponent = (
    <>
      {selectedStudy ? (
        <ListItem
          onPress={() => handleAddCondition(uuid.v4() as string, data.length)}
          title="Add Condition"
          textStyle={styles.selectStudy}
        />
      ) : null}
      <View style={styles.firstListItem}>
        <ListItem
          titleComponent={
            <View>
              <Text>Description</Text>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Description will appear in an infobox when the signal is clicked."
                onChangeText={setDescription}
              />
            </View>
          }
        />
        <ListItem title="Name">
          <TextInput style={styles.textInput} placeholder="Enter name" onChangeText={setName} />
        </ListItem>
      </View>
    </>
  );

  const ListHeaderComponent =
    selectedStudy === null ? (
      <ListItem
        style={styles.firstListItem}
        title="Select study"
        textStyle={styles.selectStudy}
        onPress={handleSelectStudy}
      />
    ) : (
      <>
        <ListItem
          onPress={handleChangeStudyParams}
          style={styles.firstListItem}
          title={selectedStudy.name}
        >
          <Icons.chevronRight fill={theme.colors.cardSubtitle} />
        </ListItem>

        <ListItem onPress={handleSelectStudy} title="Change study" textStyle={styles.selectStudy} />
      </>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item: { condition, id }, index }) => (
          <>
            <ConditionItem
              condition={condition}
              index={index}
              onPress={() => {
                handleAddCondition(id, index, condition);
              }}
              studyName={selectedStudy ? selectedStudy.shortName : ''}
            />
            {data.length > 0 ? (
              index === 0 ? (
                <JoinSelector onPress={setJoiner} />
              ) : index !== data.length - 1 ? (
                <JoinSelector value={joiner} />
              ) : null
            ) : null}
          </>
        )}
        keyExtractor={({ id }) => id}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
      />

      <SelectFromList ref={selectFromListRef} onChange={handleStudyChange} />
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    firstListItem: {
      marginTop: 24,
    },
    selectStudy: {
      color: theme.colors.colorPrimary,
    },
    descriptionTitle: {
      color: theme.colors.cardSubtitle,
    },
    textInput: {
      padding: 0,
    },
    saveButton: {
      color: theme.colors.colorPrimary,
    },
    saveButtonDisabled: {
      color: theme.colors.cardSubtitle,
    },
  });

export default AddSignal;
