import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList } from 'react-native';
import { setDrawingParams } from 'react-native-chart-iq-wrapper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DrawingParams } from '~/model';
import { useUpdateDrawingTool } from '~/shared/hooks/use-update-drawing-tool';
import { ListItem } from '~/ui/list-item';

const fontFamilies = [
  {
    name: 'Courier',
    value: 'Courier',
  },
  {
    name: 'Default',
    value: 'Default',
  },
  {
    name: 'Garamond',
    value: 'Garamond',
  },
  {
    name: 'Helvetica',
    value: 'Helvetica',
  },
  {
    name: 'Palatino',
    value: 'Palatino',
  },
  {
    name: 'Times New Roman',
    value: 'Times New Roman',
  },
];

const FontFamilyScreen: React.FC = () => {
  const { updateDrawingSettings } = useUpdateDrawingTool();
  const navigation = useNavigation();

  const handlePress = (value: string) => {
    updateDrawingSettings((prevState) => ({
      ...prevState,
      font: {
        ...prevState.font,
        family: value,
      },
    }));
    setDrawingParams(DrawingParams.FAMILY, value);

    navigation.goBack();
  };
  return (
    <SafeAreaView>
      <FlatList
        data={fontFamilies}
        renderItem={({ item: { name, value } }) => (
          <ListItem onPress={() => handlePress(value)} title={name} />
        )}
        keyExtractor={(item) => item.value}
      />
    </SafeAreaView>
  );
};

export default FontFamilyScreen;
