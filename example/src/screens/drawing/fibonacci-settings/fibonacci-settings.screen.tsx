import { useNavigation } from '@react-navigation/native';
import { encode } from 'base-64';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { setDrawingParams } from 'react-native-chart-iq-wrapper';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icons from '~/assets/icons';
import { DrawingContext } from '~/context/drawing-context/drawing.context';
import { DrawingParams } from '~/model';
import { useUpdateDrawingTool } from '~/shared/hooks/use-update-drawing-tool';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';

const FontFamilyScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { updateDrawingSettings } = useUpdateDrawingTool();
  const {
    drawingSettings: { fibs },
  } = useContext(DrawingContext);

  const [settings, setSettings] = useState(() => fibs);
  const navigation = useNavigation();

  const handlePress = (level: number) => {
    setSettings((prevState) => {
      const newState = prevState.map((item) => {
        if (item.level === level) {
          return { ...item, display: !item.display };
        }
        return item;
      });
      return newState;
    });
  };

  const handleSave = useCallback(() => {
    updateDrawingSettings((prevState) => {
      return {
        ...prevState,
        fibs: settings,
      };
    });

    // NOTE: setDrawingParams in case of "fibs" takes a stringified and encoded string, thus I encode it here
    const fibParams = encode(JSON.stringify(settings));

    setDrawingParams(DrawingParams.FIBS, fibParams);

    navigation.goBack();
  }, [navigation, settings, updateDrawingSettings]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleSave}>
          <Text style={styles.text}>Save</Text>
        </Pressable>
      ),
    });
  }, [handleSave, navigation, styles.text, theme.colors.colorPrimary]);

  return (
    <SafeAreaView>
      <FlatList
        data={settings}
        renderItem={({ item: { display, level } }) => (
          <ListItem onPress={() => handlePress(level)} title={`${level.toFixed(2)} %`}>
            {display ? <Icons.check fill={theme.colors.colorPrimary} /> : null}
          </ListItem>
        )}
        keyExtractor={(item) => item.level.toString()}
        ListFooterComponent={() => (
          <View style={styles.footerContainer}>
            <TextInput style={styles.textInput} placeholder="Custom %" />
            <Pressable style={styles.button}>
              <Text>Add</Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    text: {
      color: theme.colors.colorPrimary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    footerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 40,
    },
    textInput: {
      height: 45,
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundSecondary,
      paddingLeft: 16,
    },
    button: {
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 28,
      backgroundColor: theme.colors.colorPrimary,
    },
  });

export default FontFamilyScreen;
