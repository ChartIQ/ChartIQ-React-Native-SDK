import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AddStudiesScreen } from '../../screens/studies/add-studies';
import { ActiveStudiesScreen } from '../../screens/studies/studies-list';
import { StudyParametersScreen } from '../../screens/studies/study-parameters';
import { StudiesStack, StudiesStackParamList } from '../../shared/navigation.types';
import { BackButton } from '../../ui/back-button';

const { Navigator, Screen } = createNativeStackNavigator<StudiesStackParamList>();

const StudiesNavigator: React.FC = () => {
  return (
    <Navigator>
      <Screen
        options={{
          title: 'Active Studies',
          headerLeft: BackButton,
          headerTitleAlign: 'center',
        }}
        name={StudiesStack.Studies}
        component={ActiveStudiesScreen}
      />
      <Screen
        options={{
          title: 'Add Studies',
          headerLeft: BackButton,
          headerTitleAlign: 'center',
        }}
        name={StudiesStack.AddStudy}
        component={AddStudiesScreen}
      />
      <Screen name={StudiesStack.StudyParameters} component={StudyParametersScreen} />
    </Navigator>
  );
};

export default StudiesNavigator;
