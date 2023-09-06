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
import { ChevronBack } from '~/ui/back-chevron';

const { Navigator, Screen } = createNativeStackNavigator<DrawingsStackParamList>();

const DrawingsNavigator: React.FC = () => {
  return (
    <Navigator>
      <Screen
        name={DrawingsStack.DrawingToolsSettings}
        component={DrawingToolSettingsScreen}
        options={{ headerTitleAlign: 'center', headerLeft: ChevronBack }}
      />
      <Screen
        options={{ title: 'Select font family', headerTitleAlign: 'center' }}
        name={DrawingsStack.DrawingToolsFontFamily}
        component={FontFamilyScreen}
      />
      <Screen
        options={{ title: 'Select font size', headerTitleAlign: 'center' }}
        name={DrawingsStack.DrawingToolsFontSizes}
        component={FontSizesScreen}
      />
      <Screen
        options={{ title: 'Fibonacci settings', headerTitleAlign: 'center' }}
        name={DrawingsStack.DrawingToolsFibonacci}
        component={FibonacciSettings}
      />
      <Screen
        options={{ title: 'Std Deviations Settings', headerTitleAlign: 'center' }}
        name={DrawingsStack.DrawingToolsSTDDeviation}
        component={STDDeviationsSettingsScreen}
      />
      <Screen
        options={{ title: 'Impulse', headerTitleAlign: 'center' }}
        name={DrawingsStack.DrawingToolsImpulse}
        component={ImpulseScreen}
      />
      <Screen
        options={{ title: 'Corrective', headerTitleAlign: 'center' }}
        name={DrawingsStack.DrawingToolCorrective}
        component={Corrective}
      />
      <Screen
        options={{ title: 'Decoration', headerTitleAlign: 'center' }}
        name={DrawingsStack.DrawingToolDecoration}
        component={DecorationScreen}
      />
    </Navigator>
  );
};

export default DrawingsNavigator;
