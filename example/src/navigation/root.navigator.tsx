import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import CorrectiveScreen from '~/screens/corrective/corrective.screen';
import { DecorationScreen } from '~/screens/decoration';
import { DrawingToolSettingsScreen } from '~/screens/drawing-tool-settings';
import { FibonacciSettings } from '~/screens/fibonacci-settings';
import { FontFamilyScreen } from '~/screens/font-family';
import FontSizeScreen from '~/screens/font-size/font-size.screen';
import { ImpulseScreen } from '~/screens/impulse';
import { MainScreen } from '~/screens/root';
import { STDDeviationsSettingsScreen } from '~/screens/std-deviation-settings';
import { RootStack, RootStackParamList } from '~/shared/navigation.types';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Navigator>
      <Screen options={{ headerShown: false }} name={RootStack.Main} component={MainScreen} />
      <Screen name={RootStack.DrawingToolsSettings} component={DrawingToolSettingsScreen} />
      <Screen
        options={{ title: 'Select font family' }}
        name={RootStack.DrawingToolsFontFamily}
        component={FontFamilyScreen}
      />
      <Screen
        options={{ title: 'Select font size' }}
        name={RootStack.DrawingToolsFontSizes}
        component={FontSizeScreen}
      />
      <Screen
        options={{ title: 'Fibonacci settings' }}
        name={RootStack.DrawingToolsFibonacci}
        component={FibonacciSettings}
      />
      <Screen
        options={{ title: 'Std Deviations Settings' }}
        name={RootStack.DrawingToolsSTDDeviation}
        component={STDDeviationsSettingsScreen}
      />
      <Screen
        options={{ title: 'Impulse' }}
        name={RootStack.DrawingToolsImpulse}
        component={ImpulseScreen}
      />
      <Screen
        options={{ title: 'Corrective' }}
        name={RootStack.DrawingToolCorrective}
        component={CorrectiveScreen}
      />
      <Screen
        options={{ title: 'Decoration' }}
        name={RootStack.DrawingToolDecoration}
        component={DecorationScreen}
      />
    </Navigator>
  );
};

export default RootNavigator;
