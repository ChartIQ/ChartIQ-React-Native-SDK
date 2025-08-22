import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { MainScreen } from '~/screens/root';
import { TestRigScreen } from '~/screens/test-rig';
import { RootStack, RootStackParamList } from '~/shared/navigation.types';

import { DrawingsStackNavigator } from './drawings';
import { SettingStackNavigator } from './settings';
import { SignalsStackNavigator } from './signals';
import { StudiesStackNavigator } from './studies';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  // Flag to start app in Test Rig screen
  const shouldStartInTestRig = false;

  return (
    <Navigator initialRouteName={shouldStartInTestRig ? RootStack.TestRig : RootStack.Main}>
      <Screen options={{ headerShown: false }} name={RootStack.Main} component={MainScreen} />
      <Screen
        options={{ headerShown: false }}
        name={RootStack.Settings}
        component={SettingStackNavigator}
      />
      <Screen
        options={{ headerShown: false }}
        name={RootStack.Drawings}
        component={DrawingsStackNavigator}
      />
      <Screen
        options={{ headerShown: false }}
        name={RootStack.Studies}
        component={StudiesStackNavigator}
      />
      <Screen
        options={{ headerShown: false }}
        name={RootStack.Signals}
        component={SignalsStackNavigator}
      />
      <Screen
        options={{ headerShown: true, headerTitle: 'Test Rig' }}
        name={RootStack.TestRig}
        component={TestRigScreen}
      />
    </Navigator>
  );
};

export default RootNavigator;
