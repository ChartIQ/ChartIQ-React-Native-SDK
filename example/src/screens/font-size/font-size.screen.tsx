import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Pressable } from 'react-native';
import { setDrawingParams } from 'react-native-chart-iq-wrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawingParams } from '~/model';

import { useUpdateDrawingTool } from '~/shared/hooks/use-update-drawing-tool';
import { ListItem } from '~/ui/list-item';

const fontSizes = [
  {
    name: '8px',
    value: '8px',
  },
  {
    name: '10px',
    value: '10px',
  },
  {
    name: '12px',
    value: '12px',
  },
  {
    name: '13px',
    value: '13px',
  },
  {
    name: '14px',
    value: '14px',
  },
  {
    name: '16px',
    value: '16px',
  },
  {
    name: '20px',
    value: '20px',
  },
  {
    name: '28px',
    value: '28px',
  },
  {
    name: '36px',
    value: '36px',
  },
  {
    name: '48px',
    value: '48px',
  },
  {
    name: '64px',
    value: '64px',
  },
];

const FontSizeScreen: React.FC = () => {
  const { updateDrawingSettings } = useUpdateDrawingTool();
  const navigation = useNavigation();

  const handlePress = (value: string) => {
    updateDrawingSettings((prevState) => ({
      ...prevState,
      font: {
        ...prevState.font,
        size: value,
      },
    }));
    setDrawingParams(DrawingParams.SIZE, value);

    navigation.goBack();
  };
  return (
    <SafeAreaView>
      <FlatList
        data={fontSizes}
        renderItem={({ item: { name, value } }) => (
          <Pressable onPress={() => handlePress(value)}>
            <ListItem title={name} />
          </Pressable>
        )}
        keyExtractor={(item) => item.value}
      />
    </SafeAreaView>
  );
};

export default FontSizeScreen;
