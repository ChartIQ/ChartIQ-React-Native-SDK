import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { SettingsScreen } from '~/screens/settings/chart-settings';
import { useTranslations } from '~/shared/hooks/use-translations';
import { SettingsStack, SettingsStackParamList } from '~/shared/navigation.types';
import { ChevronBack } from '~/ui/back-chevron';

const { Navigator, Screen } = createNativeStackNavigator<SettingsStackParamList>();

const SettingsNavigator: React.FC = () => {
  const { translations } = useTranslations();
  return (
    <Navigator>
      <Screen
        options={{
          title: translations.Settings,
          headerTitleAlign: 'center',
          headerLeft: ChevronBack,
        }}
        name={SettingsStack.Settings}
        component={SettingsScreen}
      />
    </Navigator>
  );
};

export default SettingsNavigator;
