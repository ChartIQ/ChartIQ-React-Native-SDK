import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { addStudy, getActiveStudies, removeStudy } from 'react-native-chart-iq-wrapper';

import Icons from '~/assets/icons';
import images from '~/assets/images';
import { Study } from '~/model/study';
import { StudiesStack, StudiesStackParamList } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';
import { SwipableItem } from '~/ui/swipable-item';

const Studies: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation =
    useNavigation<
      NativeStackNavigationProp<
        StudiesStackParamList,
        StudiesStack.AddStudy | StudiesStack.StudyParameters
      >
    >();
  const [activeStudies, setActiveStudies] = useState<Study[]>([]);

  const handleAddStudies = useCallback(() => {
    navigation.navigate(StudiesStack.AddStudy);
  }, [navigation]);

  const get = useCallback(async () => {
    const response = await getActiveStudies();

    setActiveStudies(response);
  }, [setActiveStudies]);

  useFocusEffect(
    useCallback(() => {
      get();
    }, [get]),
  );

  useEffect(() => {
    if (activeStudies.length !== 0) {
      navigation.setOptions({
        headerRight: () => (
          <Pressable onPress={handleAddStudies}>
            <Text style={styles.headerButton}>Add</Text>
          </Pressable>
        ),
      });
    }
  }, [activeStudies, handleAddStudies, navigation, styles.buttonText, styles.headerButton]);

  const navigateStudyParams = (study: Study) => {
    navigation.navigate(StudiesStack.StudyParameters, { study });
  };

  const handleRemove = (study: Study) => {
    removeStudy(study);
    get();
  };

  const handleClone = (study: Study) => {
    addStudy(study, true);
    get();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={activeStudies}
        contentContainerStyle={{ flex: 1 }}
        renderItem={({ item }) => {
          const [name, value] = item.name.split(' (', 2);
          return (
            <SwipableItem
              rightActionButtons={[
                {
                  key: 'study-item-remove',
                  onPress: () => {
                    handleRemove(item);
                  },
                  title: 'Remove',
                  backgroundColor: theme.colors.error,
                  color: theme.colors.primaryButtonText,
                },
                {
                  key: 'study-item-clone',
                  onPress: () => {
                    handleClone(item);
                  },
                  title: 'Clone',
                  backgroundColor: theme.colors.favoriteBackground,
                  color: theme.colors.primaryButtonText,
                },
              ]}
            >
              <ListItem
                onPress={() => navigateStudyParams(item)}
                titleComponent={
                  <View>
                    <Text style={styles.studyName}>{name}</Text>
                    <Text style={styles.studyValue}>{`(${value}`}</Text>
                  </View>
                }
              >
                <Icons.chevronRight fill={theme.colors.cardSubtitle} />
              </ListItem>
            </SwipableItem>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Image
              style={styles.image}
              source={
                theme.isDark ? images.activeStudiesEmpty.dark : images.activeStudiesEmpty.light
              }
            />
            <Text style={styles.description}>No Active Studies to display yet</Text>
            <Pressable onPress={handleAddStudies} style={styles.button}>
              <Text style={styles.buttonText}>Add Studies</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'space-between',
    },
    image: {
      marginBottom: 32,
    },
    emptyView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    description: {
      fontSize: 20,
      color: theme.colors.cardSubtitle,
      marginBottom: 40,
    },
    button: {
      backgroundColor: theme.colors.colorPrimary,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      width: '80%',
    },
    buttonText: {
      fontSize: 16,
      color: theme.colors.primaryButtonText,
    },
    headerButton: {
      color: theme.colors.colorPrimary,
    },
    studyName: {
      fontSize: 16,
    },
    studyValue: {
      fontSize: 14,
      color: theme.colors.cardSubtitle,
    },
  });

export default Studies;
