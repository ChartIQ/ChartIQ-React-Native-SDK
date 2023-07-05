import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { FlatList } from 'react-native';
import { ChartIQ, DrawingParams } from 'react-native-chart-iq-wrapper';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icons from '~/assets/icons';
import { DrawingContext } from '~/context/drawing-context/drawing.context';
import { useUpdateDrawingTool } from '~/shared/hooks/use-update-drawing-tool';
import { useTheme } from '~/theme';
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
  const theme = useTheme();
  const navigation = useNavigation();
  const {
    drawingSettings: {
      font: { family },
    },
  } = useContext(DrawingContext);

  const handlePress = (value: string) => {
    updateDrawingSettings((prevState) => ({
      ...prevState,
      font: {
        ...prevState.font,
        family: value,
      },
    }));
    ChartIQ.setDrawingParams(DrawingParams.FAMILY, value);

    navigation.goBack();
  };
  return (
    <SafeAreaView>
      <FlatList
        data={fontFamilies}
        renderItem={({ item: { name, value } }) => (
          <ListItem onPress={() => handlePress(value)} title={name}>
            <Icons.check
              fill={theme.colors.colorPrimary}
              style={{
                display: value.toLowerCase() === family.toLowerCase() ? 'flex' : 'none',
              }}
            />
          </ListItem>
        )}
        keyExtractor={(item) => item.value}
      />
    </SafeAreaView>
  );
};

export default FontFamilyScreen;
