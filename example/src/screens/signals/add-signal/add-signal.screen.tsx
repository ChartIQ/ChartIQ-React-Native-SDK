import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import { addSignal, addSignalStudy, getStudyList } from 'react-native-chart-iq-wrapper';
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
import { SwipableItem } from '~/ui/swipable-item';

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
  const signalForEdit = params?.signalForEdit?.signal;
  const [conditions, setConditions] = useState<Map<string, Condition>>(new Map());
  const [joiner, setJoiner] = useState<SignalJoiner>(SignalJoiner.OR);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const onStudyChange = useCallback(async () => {
    if (changedStudy) {
      setSelectedStudy(changedStudy);
      setConditions((prevState) => {
        const newConditions = new Map(prevState);

        newConditions.forEach((condition, key) => {
          newConditions.set(key, {
            ...condition,
            leftIndicator: condition.leftIndicator.replace(
              selectedStudy?.shortName || '',
              changedStudy.name,
            ),
            rightIndicator: condition.rightIndicator
              ? condition.rightIndicator.replace(selectedStudy?.shortName || '', changedStudy.name)
              : '',
          });
        });

        return newConditions;
      });
    }
  }, [changedStudy, selectedStudy?.shortName]);

  const onConditionChange = useCallback(() => {
    if (addCondition?.condition) {
      setConditions((prevState) => {
        const newConditions = new Map(prevState);
        newConditions.set(addCondition.id, addCondition.condition);

        return newConditions;
      });
    }
  }, [addCondition]);

  useFocusEffect(
    useCallback(() => {
      onConditionChange();
    }, [onConditionChange]),
  );

  useFocusEffect(
    useCallback(() => {
      onStudyChange();
    }, [onStudyChange]),
  );

  const get = useCallback(async () => {
    const studiesList = await getStudyList();

    setStudies(
      studiesList
        .filter(({ signalIQExclude }) => !signalIQExclude)
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
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
    const study = await addSignalStudy(item?.shortName ?? '');
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
        joiner,
      });
  };

  const handleSave = useCallback(async () => {
    if (selectedStudy) {
      const mappedConditions = Array.from(conditions.values());

      const signal: Signal = {
        conditions: mappedConditions,
        joiner,
        name,
        disabled: false,
        description,
        study: selectedStudy,
        uniqueId: '',
      };

      addSignal(signal, isEdit);
      navigation.goBack();
    }
  }, [conditions, description, isEdit, joiner, name, navigation, selectedStudy]);

  const data = Array.from(conditions).map(([id, condition]) => ({ id, condition }));

  useEffect(() => {
    if (selectedStudy && conditions.size > 0 && name.length > 0) {
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
    name.length,
    navigation,
    selectedStudy,
    styles.saveButton,
    styles.saveButtonDisabled,
  ]);

  useEffect(() => {
    if (signalForEdit) {
      setConditions(
        new Map(signalForEdit.conditions.map((condition) => [uuid.v4() as string, condition])),
      );
      setJoiner(signalForEdit.joiner);
      setName(signalForEdit.name);
      setDescription(signalForEdit.description);
      setSelectedStudy(signalForEdit.study);
      setIsEdit(true);
      navigation.setOptions({
        headerTitle: 'Edit Signal',
      });
    } else {
      setIsEdit(false);
    }
  }, [navigation, signalForEdit]);

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
                defaultValue={description}
                placeholder="Description will appear in an infobox when the signal is clicked."
                onChangeText={setDescription}
              />
            </View>
          }
        />
        <ListItem title="Name">
          <TextInput
            style={styles.textInput}
            placeholder="Enter name"
            defaultValue={name}
            onChangeText={setName}
          />
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

        {!isEdit ? (
          <ListItem
            onPress={handleSelectStudy}
            title="Change study"
            textStyle={styles.selectStudy}
          />
        ) : null}
      </>
    );

  const handleDeleteCondition = (id: string) => {
    setConditions((conditions) => {
      const newConditions = new Map(conditions);
      newConditions.delete(id);

      return newConditions;
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item: { condition, id }, index }) => (
          <>
            <SwipableItem
              rightActionButtons={[
                {
                  title: 'Delete',
                  onPress: () => {
                    handleDeleteCondition(id);
                  },
                  key: 'condition.delete',
                  backgroundColor: theme.colors.error,
                  color: theme.colors.primaryButtonText,
                },
              ]}
            >
              <ConditionItem
                condition={condition}
                index={index}
                onPress={() => {
                  handleAddCondition(id, index, condition);
                }}
                joiner={joiner}
              />
            </SwipableItem>
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