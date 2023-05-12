import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SettingsScreen } from '~/screens/settings/chart-settings';
import { SelectLanguageScreen } from '~/screens/settings/select-language';
import { SettingsStack, SettingsStackParamList } from '~/shared/navigation.types';

const { Navigator, Screen } = createNativeStackNavigator<SettingsStackParamList>();

const SettingsNavigator: React.FC = () => {
  return (
    <Navigator>
      <Screen
        options={{ title: 'Settings' }}
        name={SettingsStack.Settings}
        component={SettingsScreen}
      />
      <Screen
        options={{ title: 'Language' }}
        name={SettingsStack.Languages}
        component={SelectLanguageScreen}
      />
    </Navigator>
  );
};

export default SettingsNavigator;
