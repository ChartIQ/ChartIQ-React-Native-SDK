import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AddStudiesScreen } from '~/screens/studies/add-studies';
import { ActiveStudiesScreen } from '~/screens/studies/studies-list';
import { StudiesStack, StudiesStackParamList } from '~/shared/navigation.types';

const { Navigator, Screen } = createNativeStackNavigator<StudiesStackParamList>();

const SettingsNavigator: React.FC = () => {
  return (
    <Navigator>
      <Screen
        options={{ title: 'Active Studies' }}
        name={StudiesStack.Studies}
        component={ActiveStudiesScreen}
      />
      <Screen
        options={{ title: 'Add Studies' }}
        name={StudiesStack.AddStudy}
        component={AddStudiesScreen}
      />
    </Navigator>
  );
};

export default SettingsNavigator;
