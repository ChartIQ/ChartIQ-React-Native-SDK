import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { ListRenderItemInfo, Pressable, StyleSheet, Text } from 'react-native';
import { ChartIQ, Study } from 'react-native-chartiq';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

import Icons from '~/assets/icons';
import { defaultHitSlop, edges } from '~/constants';
import { useTranslations } from '~/shared/hooks/use-translations';
import { StudiesStackParamList } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';
import { Input } from '~/ui/input';
import { ListItem } from '~/ui/list-item';

const AddStudies: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [studies, setStudies] = useState<Study[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set<string>());
  const navigation = useNavigation<NativeStackNavigationProp<StudiesStackParamList>>();
  const { translationMap } = useTranslations();

  const get = useCallback(async () => {
    const studiesList = await ChartIQ.getStudyList();
    const translatedStudies = studiesList
      .map((item) => ({
        ...item,
        display: translationMap[item.display] ?? item.display,
      }))
      .sort((a, b) => a.display.localeCompare(b.display));
    setStudies(translatedStudies);
  }, [translationMap]);

  useEffect(() => {
    get();
  }, [get]);

  const handleSelect = useCallback(async () => {
    const activeStudies = await ChartIQ.getActiveStudies();
    selected.forEach((display) => {
      const study = studies.find((item) => item.display === display);

      if (study !== undefined) {
        const isClone = activeStudies.some((item) => study.display === item.display);
        ChartIQ.addStudy({ ...study, uniqueId: uuid.v4() as string }, isClone);
      }
    });

    navigation.goBack();
  }, [navigation, selected, studies]);

  const onPress = useCallback(
    (name: string) => () => {
      setSelected((prevState) => {
        const newState = new Set(prevState);

        if (newState.has(name)) {
          newState.delete(name);
        } else {
          newState.add(name);
        }

        return newState;
      });
    },
    [],
  );

  useEffect(() => {
    if (selected.size === 0) {
      navigation.setOptions({
        headerRight: () => null,
      });
      return;
    }

    navigation.setOptions({
      headerRight: () => (
        <Pressable hitSlop={defaultHitSlop} onPress={handleSelect}>
          <Text style={styles.done}>Done</Text>
        </Pressable>
      ),
    });
  }, [handleSelect, navigation, selected, styles.done]);

  const renderItem = ({ item: { display } }: ListRenderItemInfo<Study>) => {
    const isSelected = selected.has(display);
    return (
      <ListItem onPress={onPress(display)} title={display}>
        {isSelected ? (
          <Icons.check width={18} height={18} fill={theme.colors.colorPrimary} />
        ) : null}
      </ListItem>
    );
  };

  const filtered = studies.filter((item) =>
    item.display.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView edges={edges} style={styles.container}>
      <Input
        onChange={(input) => {
          setSearch(input);
        }}
        handleClear={() => setSearch('')}
        autofocus={false}
      />
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={({ display }) => display}
        extraData={selected}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    done: {
      color: theme.colors.colorPrimary,
    },
  });

export default AddStudies;
