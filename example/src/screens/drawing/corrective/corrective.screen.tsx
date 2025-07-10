import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { FlatList } from 'react-native';
import { ChartIQ, Corrective, DrawingParams } from 'react-native-chartiq';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icons from '~/assets/icons';
import { DrawingContext } from '~/context/drawing-context/drawing.context';
import { useUpdateDrawingTool } from '~/shared/hooks/use-update-drawing-tool';
import { useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';

const items = Object.values(Corrective).map((value) => ({ name: value, value }));

const CorrectiveScreen: React.FC = () => {
  const theme = useTheme();
  const { updateDrawingSettings } = useUpdateDrawingTool();
  const navigation = useNavigation();

  const {
    drawingSettings: {
      waveParameters: { corrective },
    },
  } = useContext(DrawingContext);

  const handlePress = (value: Corrective) => {
    navigation.goBack();

    setTimeout(() => {
      updateDrawingSettings((prevState) => ({
        ...prevState,
        waveParameters: {
          ...prevState.waveParameters,
          corrective: value,
        },
      }));
      ChartIQ.setDrawingParams(DrawingParams.CORRECTIVE, value);
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
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ display: value === corrective ? 'flex' : 'none' }}
            />
          </ListItem>
        )}
        keyExtractor={(item) => item.value}
      />
    </SafeAreaView>
  );
};

export default CorrectiveScreen;
