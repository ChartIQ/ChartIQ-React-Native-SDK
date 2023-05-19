import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { ActiveSignalsScreen } from '~/screens/signals/active-signals';
import { AddConditionScreen } from '~/screens/signals/add-condition';
import { AddSignalScreen } from '~/screens/signals/add-signal';
import { ChangeStudyParametersScreen } from '~/screens/signals/change-study-parameters';
import { SignalsStackParamList, SignalsStack } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';

const { Navigator, Screen } = createNativeStackNavigator<SignalsStackParamList>();

const SignalsNavigator: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  return (
    <Navigator>
      <Screen
        options={{
          title: 'SignalIQ',
          headerLeft: () => (
            <Pressable onPress={navigation.goBack}>
              <Text style={styles.text}>Cancel</Text>
            </Pressable>
          ),
          headerTitleAlign: 'center',
        }}
        name={SignalsStack.Signals}
        component={ActiveSignalsScreen}
      />
      <Screen
        options={{
          title: 'New Signal',
          headerLeft: () => {
            const navigation = useNavigation();

            return (
              <Pressable onPress={navigation.goBack}>
                <Text style={styles.text}>Cancel</Text>
              </Pressable>
            );
          },
          headerTitleAlign: 'center',
        }}
        name={SignalsStack.AddSignal}
        component={AddSignalScreen}
      />
      <Screen
        options={{
          headerLeft: () => {
            const navigation = useNavigation();

            return (
              <Pressable onPress={navigation.goBack}>
                <Text style={styles.text}>Cancel</Text>
              </Pressable>
            );
          },
          headerTitleAlign: 'center',
        }}
        name={SignalsStack.ChangeStudyParameters}
        component={ChangeStudyParametersScreen}
      />
      <Screen
        options={{
          headerLeft: () => {
            const navigation = useNavigation();

            return (
              <Pressable onPress={navigation.goBack}>
                <Text style={styles.text}>Cancel</Text>
              </Pressable>
            );
          },
          headerTitleAlign: 'center',
        }}
        name={SignalsStack.AddCondition}
        component={AddConditionScreen}
      />
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

export default SignalsNavigator;
