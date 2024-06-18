import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, TransitionPresets, createStackNavigator } from '@react-navigation/stack';

import Root from '../../src/screens/root/root.screen';
import { SettingStackNavigator } from '../../src/navigation/settings';
import { DrawingsStackNavigator } from '../../src/navigation/drawings';
import { StudiesStackNavigator } from '../../src/navigation/studies';
import { SignalsStackNavigator } from '../../src/navigation/signals';
import Test from '../Test';
const Stack = createStackNavigator();

const Navigation = () => {


  // Transitions options
  const options = {
    ...TransitionPresets.ScaleFromCenterAndroid,
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    headerShown: false,

  };

  // UI Rendering starts from here
  return (
    // Routes stack
    <NavigationContainer

    >
      <Stack.Navigator
        initialRouteName='Test'
      >


        <Stack.Screen
          name="Root"
          component={Root}
          options={() => options} />

        <Stack.Screen
          name="Test"
          component={Test}
          options={() => options} />




        <Stack.Screen options={() => options} name="[Root stack] Studies" component={StudiesStackNavigator} />
        <Stack.Screen options={() => options} name="[Root stack] Settings" component={SettingStackNavigator} />
        <Stack.Screen options={() => options} name="[Root stack] Drawings" component={DrawingsStackNavigator} />
        <Stack.Screen options={() => options} name="[Root stack] Signals" component={SignalsStackNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default React.memo(Navigation);