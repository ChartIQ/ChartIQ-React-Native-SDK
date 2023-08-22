import { useHeaderHeight } from '@react-navigation/elements';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { ChartIQ, Study, Signal, SignalJoiner, Condition } from 'react-native-chart-iq';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

import Icons from '~/assets/icons';
import { edges } from '~/constants';
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
  const { width: screenWidth } = useWindowDimensions();
  const { translations, translationMap } = useTranslations();
  const selectFromListRef = React.useRef<SelectOptionFromListMethods>(null);
  const [studies, setStudies] = useState<Study[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const addCondition = params?.addCondition;
  const changedStudy = params?.changeStudy?.study;
  const signalForEdit = params?.signalForEdit?.signal;
  const isEdit = params.isEdit ?? false;
  const [conditions, setConditions] = useState<Map<string, Condition>>(new Map());
  const [joiner, setJoiner] = useState<SignalJoiner>(SignalJoiner.OR);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [descriptionPlaceholder, setDescriptionPlaceholder] = useState(DESCRIPTION_PLACEHOLDER);
  const height = useHeaderHeight();

  const onStudyChange = useCallback(async () => {
    if (changedStudy) {
      setSelectedStudy(changedStudy);

      setConditions((prevState) => {
        const newConditions = new Map(prevState);

        newConditions.forEach((condition, key) => {
          let leftInd = condition.leftIndicator;
          let rightInd = condition.rightIndicator;
          Object.entries(changedStudy.outputs).forEach(([key, value]: [string, unknown]) => {
            if (value && condition.leftIndicator.includes(value as string)) {
              leftInd = key;
            }
            if (value && condition?.rightIndicator?.includes(value as string)) {
              rightInd = key;
            }
          });

          newConditions.set(key, {
            ...condition,
            leftIndicator: leftInd,
            rightIndicator: rightInd,
          });
        });

        return newConditions;
      });
    }
  }, [changedStudy]);

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
    const studiesList = await ChartIQ.getStudyList();

    setStudies(
      studiesList
        .filter(({ signalIQExclude }) => !signalIQExclude)
        .map((item) => ({ ...item, name: translationMap[item.display] ?? item.display }))
        .sort((a, b) => a.display.localeCompare(b.display)),
    );
  }, [translationMap]);

  useEffect(() => {
    get();
  }, [get]);

  const handleSelectStudy = () => {
    selectFromListRef.current?.open({
      data: studies.map(({ display }) => ({ key: display, value: display })),
      selected: selectedStudy?.display ?? '',
      id: SELECT_STUDY,
      title: SELECT_STUDY,
    });
  };

  const handleStudyChange = async ({ value }: { value: string }) => {
    const item = studies.find((item) => item.display === value) ?? null;
    const study = await ChartIQ.addSignalStudy(item?.shortName ?? '');

    if (selectedStudy) {
      ChartIQ.removeStudy(selectedStudy);
      setConditions(new Map());
    }

    setSelectedStudy(study);
  };

  const handleChangeStudyParams = async () => {
    if (selectedStudy === null) return;

    navigation.navigate(SignalsStack.ChangeStudyParameters, { study: selectedStudy, isEdit });
  };

  const handleAddCondition = (id: string, index: number, input?: Condition) => {
    if (selectedStudy)
      navigation.navigate(SignalsStack.AddCondition, {
        study: selectedStudy,
        condition: input,
        id,
        index,
        joiner,
        isEdit,
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

      ChartIQ.addSignal(signal, isEdit);
      navigation.goBack();
    }
  }, [conditions, description, isEdit, joiner, name, navigation, selectedStudy]);

  const data = Array.from(conditions).map(([id, condition]) => ({ id, condition }));

  useEffect(() => {
    const enabled = selectedStudy && conditions.size > 0 && name.length > 0;
    navigation.setOptions({
      headerRight: () => (
        <Pressable disabled={!enabled} onPress={handleSave}>
          <Text style={enabled ? styles.saveButton : styles.saveButtonDisabled}>
            {translations.Save}
          </Text>
        </Pressable>
      ),
    });
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
      navigation.setOptions({
        headerTitle: 'Edit Signal',
      });
    }
  }, [navigation, signalForEdit]);

  useEffect(() => {
    if (selectedStudy && !isEdit) {
      navigation.setOptions({
        headerLeft: () => {
          return (
            <Pressable
              onPress={() => {
                navigation.goBack();

                if (!isEdit) {
                  ChartIQ.removeStudy(selectedStudy);
                }
              }}
            >
              <Text style={styles.saveButton}>{translations.cancel}</Text>
            </Pressable>
          );
        },
      });
    }
  }, [isEdit, navigation, selectedStudy, styles.saveButton, translations.cancel]);

  const ListFooterComponent = (
    <>
      {selectedStudy ? (
        <ListItem
          onPress={() => handleAddCondition(uuid.v4() as string, data.length)}
          title="Add Condition"
          textStyle={styles.selectStudy}
          topBorder={data.length === 0}
        />
      ) : null}
      <View style={styles.firstListItem}>
        <ListItem
          topBorder
          containerStyle={{ backgroundColor: theme.colors.backgroundSecondary }}
          titleComponent={
            <View>
              <Text style={styles.text}>Description</Text>
              <TextInput
                style={[
                  styles.multilineInput,
                  {
                    width: screenWidth - 32,
                  },
                ]}
                multiline
                numberOfLines={2}
                keyboardType="default"
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
          bottomBorderStyles={styles.bottomBorder}
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

  const ListHeaderComponent = (
    <View style={styles.firstListItem}>
      {selectedStudy === null ? (
        <ListItem
          title={SELECT_STUDY}
          textStyle={styles.selectStudy}
          onPress={handleSelectStudy}
          topBorder
        />
      ) : (
        <>
          <ListItem
            topBorder
            onPress={handleChangeStudyParams}
            title={formatStudyName(selectedStudy.name)}
            containerStyle={{ backgroundColor: theme.colors.backgroundSecondary }}
            bottomBorderStyles={!isEdit ? styles.bottomBorder : {}}
          >
            <Icons.chevronRight fill={theme.colors.cardSubtitle} />
          </ListItem>

          {!isEdit ? (
            <>
              <ListItem
                onPress={handleSelectStudy}
                title="Change Study"
                textStyle={styles.selectStudy}
              />
              <View style={styles.space32} />
            </>
          ) : null}
        </>
      )}
    </View>
  );

  const handleDeleteCondition = (id: string) => {
    setConditions((conditions) => {
      const newConditions = new Map(conditions);
      newConditions.delete(id);

      return newConditions;
    });
  };

  return (
    <SafeAreaView edges={edges} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : undefined}
        keyboardVerticalOffset={height}
        style={styles.container}
      >
        <FlatList
          data={data}
          renderItem={({ item: { condition, id }, index }) => (
            <>
              {isEdit && index === 0 ? <View style={styles.space32} /> : null}
              <SwipableItem
                removable
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
          contentContainerStyle={{ paddingBottom: 124 }}
        />

        <SelectFromList
          filtered
          ref={selectFromListRef}
          onChange={handleStudyChange}
          showHeader
          withSaveButton
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    firstListItem: {
      marginTop: 32,
      backgroundColor: theme.colors.backgroundSecondary,
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
    multilineInput: {
      minHeight: 40,
      color: theme.colors.buttonText,
    },
    saveButton: {
      color: theme.colors.colorPrimary,
      textTransform: 'capitalize',
    },
    saveButtonDisabled: {
      color: theme.colors.cardSubtitle,
    },
    footerContainer: {
      paddingBottom: 24,
    },
    bottomBorder: {
      marginLeft: 16,
    },
    space32: {
      height: 32,
      backgroundColor: theme.colors.background,
    },
  });

export default AddSignal;
