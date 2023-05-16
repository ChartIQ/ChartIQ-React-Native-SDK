import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { ListRenderItemInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import { addStudy, getActiveStudies, getStudyList } from 'react-native-chart-iq-wrapper';
import { FlatList } from 'react-native-gesture-handler';

import Icons from '~/assets/icons';
import { Study } from '~/model/study';
import { StudiesStackParamList } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';
import { Input } from '~/ui/input';
import { ListItem } from '~/ui/list-item';

const AddStudies: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [studies, setStudies] = useState<Study[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set<number>());
  const navigation = useNavigation<NativeStackNavigationProp<StudiesStackParamList>>();

  const get = useCallback(async () => {
    const studiesList = await getStudyList();
    setStudies(studiesList);
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  const handleSelect = useCallback(async () => {
    const activeStudies = await getActiveStudies();

    selected.forEach((index) => {
      const study = studies[index];
      if (study !== undefined) {
        const isClone = activeStudies.some((item) => study.name === item.name);

        addStudy(study, isClone);
      }
    });

    navigation.goBack();
  }, [navigation, selected, studies]);

  const onPress = useCallback(
    (index: number) => () => {
      setSelected((prevState) => {
        const newState = new Set(prevState);

        if (newState.has(index)) {
          newState.delete(index);
        } else {
          newState.add(index);
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
        <Pressable onPress={handleSelect}>
          <Text style={styles.done}>Done</Text>
        </Pressable>
      ),
    });
  }, [handleSelect, navigation, selected, styles.done]);

  const renderItem = ({ item: { name }, index }: ListRenderItemInfo<Study>) => {
    const isSelected = selected.has(index);
    return (
      <Pressable onPress={onPress(index)} android_ripple={{ color: theme.colors.colorPrimary }}>
        <ListItem title={name}>
          {isSelected ? (
            <Icons.check width={18} height={18} fill={theme.colors.colorPrimary} />
          ) : null}
        </ListItem>
      </Pressable>
    );
  };

  const filtered = studies.filter((item) => item.name.includes(search));

  return (
    <View style={styles.container}>
      <Input
        onChange={(input) => {
          setSearch(input);
        }}
      />
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={({ name }) => name}
        extraData={selected}
      />
    </View>
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
