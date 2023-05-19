import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AddStudiesScreen } from '~/screens/studies/add-studies';
import { ActiveStudiesScreen } from '~/screens/studies/studies-list';
import { StudyParametersScreen } from '~/screens/studies/study-parameters';
import { StudiesStack, StudiesStackParamList } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';

const { Navigator, Screen } = createNativeStackNavigator<StudiesStackParamList>();

const StudiesNavigator: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  return (
    <Navigator>
      <Screen
        options={{
          title: 'Active Studies',
          headerLeft: () => {
            return (
              <Pressable onPress={navigation.goBack}>
                <Text style={styles.text}>Cancel</Text>
              </Pressable>
            );
          },
          headerTitleAlign: 'center',
        }}
        name={StudiesStack.Studies}
        component={ActiveStudiesScreen}
      />
      <Screen
        options={{
          title: 'Add Studies',
          headerLeft: () => {
            return (
              <Pressable onPress={navigation.goBack}>
                <Text style={styles.text}>Cancel</Text>
              </Pressable>
            );
          },
          headerTitleAlign: 'center',
        }}
        name={StudiesStack.AddStudy}
        component={AddStudiesScreen}
      />
      <Screen name={StudiesStack.StudyParameters} component={StudyParametersScreen} />
    </Navigator>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    text: {
      color: theme.colors.colorPrimary,
      padding: 8,
    },
  });

export default StudiesNavigator;
