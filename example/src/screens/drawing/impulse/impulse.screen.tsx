import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { FlatList } from 'react-native';
import { ChartIQ, DrawingParams, Impulse } from 'react-native-chart-iq';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icons from '~/assets/icons';
import { DrawingContext } from '~/context/drawing-context/drawing.context';
import { useUpdateDrawingTool } from '~/shared/hooks/use-update-drawing-tool';
import { useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';

const items = Object.values(Impulse).map((value) => ({ name: value, value }));

const ImpulseScreen: React.FC = () => {
  const theme = useTheme();
  const { updateDrawingSettings } = useUpdateDrawingTool();
  const navigation = useNavigation();

  const {
    drawingSettings: {
      waveParameters: { impulse },
    },
  } = useContext(DrawingContext);

  const handlePress = (value: Impulse) => {
    navigation.goBack();

    setTimeout(() => {
      updateDrawingSettings((prevState) => ({
        ...prevState,
        waveParameters: {
          ...prevState.waveParameters,
          impulse: value,
        },
      }));

      ChartIQ.setDrawingParams(DrawingParams.IMPULSE, value);
    });
  };
  return (
    <SafeAreaView>
      <FlatList
        data={items}
        renderItem={({ item: { name, value } }) => (
          <ListItem onPress={() => handlePress(value)} title={name}>
            <Icons.check
              fill={theme.colors.colorPrimary}
              style={{ display: value === impulse ? 'flex' : 'none' }}
            />
          </ListItem>
        )}
        keyExtractor={(item) => item.value}
      />
    </SafeAreaView>
  );
};

export default ImpulseScreen;
