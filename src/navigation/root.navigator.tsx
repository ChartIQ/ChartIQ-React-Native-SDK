import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';


import { DrawingsStackNavigator } from './drawings';
import { SettingStackNavigator } from './settings';
import { SignalsStackNavigator } from './signals';
import { StudiesStackNavigator } from './studies';
import { MainScreen } from '../screens/root';
import { RootStack, RootStackParamList } from '../shared/navigation.types';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC<any> = ({ symbol }) => {
  return (
    <Navigator>
      {/* <Screen options={{ headerShown: false }} initialParams={{ 'symbol': symbol }} name={RootStack.Main} component={MainScreen} /> */}
      <Screen name={RootStack.Main} options={{ headerShown: false }}>
        {(props) => <MainScreen symbolName={symbol} {...props} />}
      </Screen>
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
