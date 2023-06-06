import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { MainScreen } from '~/screens/root';
import { RootStack, RootStackParamList } from '~/shared/navigation.types';

import { DrawingsStackNavigator } from './drawings';
import { SettingStackNavigator } from './settings';
import { SignalsStackNavigator } from './signals';
import { StudiesStackNavigator } from './studies';

const { Navigator, Screen } = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Navigator>
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
    </Navigator>
  );
};

export default RootNavigator;
