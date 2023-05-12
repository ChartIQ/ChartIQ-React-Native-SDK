import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Corrective } from '~/screens/drawing/corrective';
import { DecorationScreen } from '~/screens/drawing/decoration';
import { DrawingToolSettingsScreen } from '~/screens/drawing/drawing-tool-settings';
import { FibonacciSettings } from '~/screens/drawing/fibonacci-settings';
import { FontFamilyScreen } from '~/screens/drawing/font-family';
import { FontSizesScreen } from '~/screens/drawing/font-size';
import { ImpulseScreen } from '~/screens/drawing/impulse';
import { STDDeviationsSettingsScreen } from '~/screens/drawing/std-deviation-settings';
import { DrawingsStack, DrawingsStackParamList } from '~/shared/navigation.types';

const { Navigator, Screen } = createNativeStackNavigator<DrawingsStackParamList>();

const DrawingsNavigator: React.FC = () => {
  return (
    <Navigator>
      <Screen name={DrawingsStack.DrawingToolsSettings} component={DrawingToolSettingsScreen} />
      <Screen
        options={{ title: 'Select font family' }}
        name={DrawingsStack.DrawingToolsFontFamily}
        component={FontFamilyScreen}
      />
      <Screen
        options={{ title: 'Select font size' }}
        name={DrawingsStack.DrawingToolsFontSizes}
        component={FontSizesScreen}
      />
      <Screen
        options={{ title: 'Fibonacci settings' }}
        name={DrawingsStack.DrawingToolsFibonacci}
        component={FibonacciSettings}
      />
      <Screen
        options={{ title: 'Std Deviations Settings' }}
        name={DrawingsStack.DrawingToolsSTDDeviation}
        component={STDDeviationsSettingsScreen}
      />
      <Screen
        options={{ title: 'Impulse' }}
        name={DrawingsStack.DrawingToolsImpulse}
        component={ImpulseScreen}
      />
      <Screen
        options={{ title: 'Corrective' }}
        name={DrawingsStack.DrawingToolCorrective}
        component={Corrective}
      />
      <Screen
        options={{ title: 'Decoration' }}
        name={DrawingsStack.DrawingToolDecoration}
        component={DecorationScreen}
      />
    </Navigator>
  );
};

export default DrawingsNavigator;
