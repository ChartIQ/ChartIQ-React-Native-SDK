import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { FlatList } from 'react-native';
import { ChartIQ, Decoration, DrawingParams } from 'react-native-chart-iq-wrapper';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icons from '~/assets/icons';
import { DrawingContext } from '~/context/drawing-context/drawing.context';
import { useUpdateDrawingTool } from '~/shared/hooks/use-update-drawing-tool';
import { useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';

const items = Object.values(Decoration).map((value) => ({ name: value, value }));

const CorrectiveScreen: React.FC = () => {
  const theme = useTheme();
  const { updateDrawingSettings } = useUpdateDrawingTool();
  const navigation = useNavigation();

  const {
    drawingSettings: {
      waveParameters: { decoration },
    },
  } = useContext(DrawingContext);

  const handlePress = (value: Decoration) => {
    navigation.goBack();

    setTimeout(() => {
      updateDrawingSettings((prevState) => ({
        ...prevState,
        waveParameters: {
          ...prevState.waveParameters,
          decoration: value,
        },
      }));
      ChartIQ.setDrawingParams(DrawingParams.DECORATION, value);
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
              style={{
                display: value.toLowerCase() === decoration.toLowerCase() ? 'flex' : 'none',
              }}
            />
          </ListItem>
        )}
        keyExtractor={(item) => item.value}
      />
    </SafeAreaView>
  );
};

export default CorrectiveScreen;
