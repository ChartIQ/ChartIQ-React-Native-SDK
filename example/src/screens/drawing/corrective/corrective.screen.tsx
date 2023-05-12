import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { FlatList, Pressable } from 'react-native';
import { setDrawingParams } from 'react-native-chart-iq-wrapper';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icons from '~/assets/icons';
import { DrawingContext } from '~/context/drawing-context/drawing.context';
import { Corrective, DrawingParams } from '~/model';
import { useUpdateDrawingTool } from '~/shared/hooks/use-update-drawing-tool';
import { useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';

const items = Object.values(Corrective).map((value) => ({ name: value, value }));

const CorrectiveScreen: React.FC = () => {
  const theme = useTheme();
  const { updateDrawingSettings } = useUpdateDrawingTool();
  const navigation = useNavigation();

  const {
    drawingSettings: { corrective },
  } = useContext(DrawingContext);

  const handlePress = (value: Corrective) => {
    navigation.goBack();

    setTimeout(() => {
      updateDrawingSettings((prevState) => ({
        ...prevState,
        corrective: value,
      }));
      setDrawingParams(DrawingParams.CORRECTIVE, value);
    });
  };

  return (
    <SafeAreaView>
      <FlatList
        data={items}
        renderItem={({ item: { name, value } }) => (
          <Pressable onPress={() => handlePress(value)}>
            <ListItem title={name}>
              <Icons.chevronRight
                fill={theme.colors.colorPrimary}
                style={{ display: value === corrective ? 'flex' : 'none' }}
              />
            </ListItem>
          </Pressable>
        )}
        keyExtractor={(item) => item.value}
      />
    </SafeAreaView>
  );
};

export default CorrectiveScreen;
