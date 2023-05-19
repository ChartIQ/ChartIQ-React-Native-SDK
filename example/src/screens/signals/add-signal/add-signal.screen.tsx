import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { addStudySignal, getStudyList } from 'react-native-chart-iq-wrapper';
import { TextInput } from 'react-native-gesture-handler';

import Icons from '~/assets/icons';
import { Study } from '~/model/study';
import { SignalsStack, SignalsStackParamList } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';
import { SelectFromList } from '~/ui/select-from-list';
import { SelectOptionFromListMethods } from '~/ui/select-from-list/select-from-list.component';

const SELECT_STUDY = 'Select study';

interface AddSignalProps
  extends NativeStackScreenProps<SignalsStackParamList, SignalsStack.AddSignal> {}

const AddSignal: React.FC<AddSignalProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const selectFromListRef = React.useRef<SelectOptionFromListMethods>(null);
  const [studies, setStudies] = useState<Study[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);

  const get = useCallback(async () => {
    const studiesList = await getStudyList();
    setStudies(studiesList);
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  const handleSelectStudy = () => {
    selectFromListRef.current?.open(
      studies.map(({ name }) => ({ key: name, value: name })),
      '',
      SELECT_STUDY,
    );
  };

  const handleStudyChange = (value: string, _: string) => {
    const study = studies.find((item) => item.name === value) ?? null;
    setSelectedStudy(study);
  };

  const handleChangeStudyParams = async () => {
    if (selectedStudy === null) return;
    const study = await addStudySignal(selectedStudy.name);

    navigation.navigate(SignalsStack.ChangeStudyParameters, { study });
  };

  const handleAddCondition = () => {
    if (selectedStudy) navigation.navigate(SignalsStack.AddCondition, { study: selectedStudy });
  };

  return (
    <View style={styles.container}>
      {selectedStudy === null ? (
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

          <ListItem
            onPress={handleSelectStudy}
            title="Change study"
            textStyle={styles.selectStudy}
          />

          <ListItem
            style={styles.firstListItem}
            onPress={handleAddCondition}
            title="Add Condition"
            textStyle={styles.selectStudy}
          />
        </>
      )}
      <View style={styles.firstListItem}>
        <ListItem
          titleComponent={
            <View>
              <Text>Description</Text>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Description will appear in an infobox when the signal is clicked."
              />
            </View>
          }
        />
        <ListItem title="Name">
          <TextInput style={styles.textInput} placeholder="Enter name" />
        </ListItem>
      </View>
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
  });

export default AddSignal;
