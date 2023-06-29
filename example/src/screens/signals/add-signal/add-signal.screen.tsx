import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import {
  addSignal,
  addSignalStudy,
  getStudyList,
  removeStudy,
} from 'react-native-chart-iq-wrapper';
import { TextInput } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';

import Icons from '~/assets/icons';
import { Condition } from '~/model/signals/condition';
import { Signal, SignalJoiner } from '~/model/signals/signal';
import { Study } from '~/model/study';
import { formatStudyName } from '~/shared/helpers';
import { useTranslations } from '~/shared/hooks/use-translations';
import { SignalsStack, SignalsStackParamList } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';
import { SelectFromList } from '~/ui/select-from-list';
import { SelectOptionFromListMethods } from '~/ui/select-from-list/select-from-list.component';
import { SwipableItem } from '~/ui/swipable-item';

import ConditionItem from './components/condition-item/condition-item.component';
import { JoinSelector } from './components/join-selector';

const SELECT_STUDY = 'Select study';
const DESCRIPTION_PLACEHOLDER = 'Description will appear in an infobox when the signal is clicked.';

interface AddSignalProps
  extends NativeStackScreenProps<SignalsStackParamList, SignalsStack.AddSignal> {}

const AddSignal: React.FC<AddSignalProps> = ({ navigation, route: { params } }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { translations, translationMap } = useTranslations();
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
  const [descriptionPlaceholder, setDescriptionPlaceholder] = useState(DESCRIPTION_PLACEHOLDER);

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
        .map((item) => ({ ...item, name: translationMap[item.name] ?? item.name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
  }, [translationMap]);

  useEffect(() => {
    get();
  }, [get]);

  const handleSelectStudy = () => {
    selectFromListRef.current?.open({
      data: studies.map(({ name }) => ({ key: name, value: name })),
      selected: selectedStudy?.name ?? '',
      id: SELECT_STUDY,
      title: 'Select study',
    });
  };

  const handleStudyChange = async ({ value }: { value: string }) => {
    const item = studies.find((item) => item.name === value) ?? null;
    const study = await addSignalStudy(item?.shortName ?? '');

    if (selectedStudy && selectedStudy.name !== study?.name) {
      removeStudy(selectedStudy);
      setConditions(new Map());
    }

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
            {translations.Save}
          </Text>
        ),
      });
    } else {
      navigation.setOptions({
        headerRight: () => (
          <Text disabled={true} style={styles.saveButtonDisabled} onPress={handleSave}>
            {translations.Save}
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
    translations.Save,
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

  useEffect(() => {
    if (selectedStudy && !isEdit) {
      navigation.setOptions({
        headerLeft: () => {
          return (
            <Text
              style={styles.saveButton}
              onPress={() => {
                removeStudy(selectedStudy);
                navigation.goBack();
              }}
            >
              {translations.cancel}
            </Text>
          );
        },
      });
    }
  }, [
    isEdit,
    navigation,
    selectedStudy,
    styles.saveButton,
    styles.saveButtonDisabled,
    translations.cancel,
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
              <Text style={styles.text}>Description</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={2}
                defaultValue={description}
                placeholder={descriptionPlaceholder}
                onChangeText={setDescription}
                placeholderTextColor={theme.colors.placeholder}
                onFocus={() => {
                  setDescriptionPlaceholder('');
                }}
                onBlur={() => {
                  setDescriptionPlaceholder(DESCRIPTION_PLACEHOLDER);
                }}
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
            placeholderTextColor={theme.colors.placeholder}
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
          title={formatStudyName(selectedStudy.name)}
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
                  isOvershoot: true,
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

      <SelectFromList
        filtered
        ref={selectFromListRef}
        onChange={handleStudyChange}
        showHeader={false}
      />
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
      fontSize: 16,
    },
    descriptionTitle: {
      color: theme.colors.cardSubtitle,
    },
    text: {
      color: theme.colors.buttonText,
    },
    textInput: {
      padding: 0,
      color: theme.colors.cardSubtitle,
    },
    saveButton: {
      color: theme.colors.colorPrimary,
      textTransform: 'capitalize',
    },
    saveButtonDisabled: {
      color: theme.colors.cardSubtitle,
    },
  });

export default AddSignal;
