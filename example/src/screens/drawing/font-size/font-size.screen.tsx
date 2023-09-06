import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { FlatList } from 'react-native';
import { ChartIQ, DrawingParams } from 'react-native-chartiq';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icons from '~/assets/icons';
import { DrawingContext } from '~/context/drawing-context/drawing.context';
import { useUpdateDrawingTool } from '~/shared/hooks/use-update-drawing-tool';
import { useTheme } from '~/theme';
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
  const theme = useTheme();

  const {
    drawingSettings: {
      font: { size },
    },
  } = useContext(DrawingContext);

  const handlePress = (value: string) => {
    updateDrawingSettings((prevState) => ({
      ...prevState,
      font: {
        ...prevState.font,
        size: value,
      },
    }));
    ChartIQ.setDrawingParams(DrawingParams.SIZE, value);

    navigation.goBack();
  };
  return (
    <SafeAreaView>
      <FlatList
        data={fontSizes}
        renderItem={({ item: { name, value } }) => (
          <ListItem onPress={() => handlePress(value)} title={name}>
            <Icons.check
              fill={theme.colors.colorPrimary}
              style={{
                display: value.toLowerCase() === size.toLowerCase() ? 'flex' : 'none',
              }}
            />
          </ListItem>
        )}
        keyExtractor={(item) => item.value}
      />
    </SafeAreaView>
  );
};

export default FontSizeScreen;
