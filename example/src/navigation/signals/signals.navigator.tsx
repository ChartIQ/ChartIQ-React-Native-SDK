import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { ActiveSignalsScreen } from '~/screens/signals/active-signals';
import { AddConditionScreen } from '~/screens/signals/add-condition';
import { AddSignalScreen } from '~/screens/signals/add-signal';
import { ChangeStudyParametersScreen } from '~/screens/signals/change-study-parameters';
import { SignalsStackParamList, SignalsStack } from '~/shared/navigation.types';
import { BackButton } from '~/ui/back-button';

const { Navigator, Screen } = createNativeStackNavigator<SignalsStackParamList>();

const SignalsNavigator: React.FC = () => {
  return (
    <Navigator>
      <Screen
        options={{
          title: 'SignalIQ',
          headerLeft: BackButton,
          headerTitleAlign: 'center',
        }}
        name={SignalsStack.Signals}
        component={ActiveSignalsScreen}
      />
      <Screen
        options={{
          title: 'New Signal',
          headerLeft: BackButton,
          headerTitleAlign: 'center',
        }}
        name={SignalsStack.AddSignal}
        component={AddSignalScreen}
      />
      <Screen
        options={{
          headerLeft: BackButton,
          headerTitleAlign: 'center',
        }}
        name={SignalsStack.ChangeStudyParameters}
        component={ChangeStudyParametersScreen}
      />
      <Screen
        options={{
          headerLeft: BackButton,
          headerTitleAlign: 'center',
        }}
        name={SignalsStack.AddCondition}
        component={AddConditionScreen}
      />
    </Navigator>
  );
};

export default SignalsNavigator;
