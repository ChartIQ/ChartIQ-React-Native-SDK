import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { FlatList, Pressable } from 'react-native';
import { setDrawingParams } from 'react-native-chart-iq-wrapper';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icons from '~/assets/icons';
import { DrawingContext } from '~/context/drawing-context/drawing.context';
import { DrawingParams, Impulse } from '~/model';
import { useUpdateDrawingTool } from '~/shared/hooks/use-update-drawing-tool';
import { useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';

const items = Object.values(Impulse).map((value) => ({ name: value, value }));

const ImpulseScreen: React.FC = () => {
  const theme = useTheme();
  const { updateDrawingSettings } = useUpdateDrawingTool();
  const navigation = useNavigation();

  const {
    drawingSettings: { impulse },
  } = useContext(DrawingContext);

  const handlePress = (value: Impulse) => {
    navigation.goBack();

    setTimeout(() => {
      updateDrawingSettings((prevState) => ({
        ...prevState,
        impulse: value,
      }));

      setDrawingParams(DrawingParams.IMPULSE, value);
    });
  };
  return (
    <SafeAreaView>
      <FlatList
        data={items}
        renderItem={({ item: { name, value } }) => (
          <ListItem onPress={() => handlePress(value)} title={name}>
            <Icons.chevronRight
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
