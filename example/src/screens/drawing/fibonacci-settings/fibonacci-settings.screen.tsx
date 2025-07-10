import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { encode } from 'base-64';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ChartIQ, DrawingParams } from 'react-native-chartiq';
import { TextInput } from 'react-native-gesture-handler';

import Icons from '~/assets/icons';
import { defaultHitSlop } from '~/constants';
import { DrawingContext } from '~/context/drawing-context/drawing.context';
import { useUpdateDrawingTool } from '~/shared/hooks/use-update-drawing-tool';
import { DrawingsStack, DrawingsStackParamList } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';

export interface FibonacciSettingsProps
  extends NativeStackScreenProps<DrawingsStackParamList, DrawingsStack.DrawingToolsFibonacci> {}

const FibonacciSettings: React.FC<FibonacciSettingsProps> = ({ route }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const height = useHeaderHeight();
  const { updateDrawingSettings } = useUpdateDrawingTool();
  const filterNegative = route.params?.filterNegative;
  const {
    drawingSettings: { fibs },
  } = useContext(DrawingContext);
  const [customFib, setCustomFib] = useState<string>('');

  const [settings, setSettings] = useState(() =>
    fibs
      .sort((a, b) => a.level - b.level)
      .filter((item) => (filterNegative ? item.level >= 0 : true)),
  );
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

    ChartIQ.setDrawingParams(DrawingParams.FIBS, fibParams);

    navigation.goBack();
  }, [navigation, settings, updateDrawingSettings]);

  const HeaderRight = useCallback(
    () => (
      <Pressable hitSlop={defaultHitSlop} onPress={handleSave}>
        <Text style={styles.text}>Save</Text>
      </Pressable>
    ),
    [handleSave, styles.text],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
    });
  }, [HeaderRight, navigation]);

  const handleAdd = useCallback(() => {
    const value = Number(Number(customFib).toFixed(2));
    setCustomFib('');
    setSettings((prevState) => {
      if (isNaN(value)) {
        return prevState;
      }
      if (prevState.find((item) => item.level === value)) {
        return prevState;
      }

      return prevState.concat({ level: Number(Number(customFib).toFixed(2)), display: true });
    });
  }, [customFib]);

  const onTextChange = useCallback((text: string) => {
    setCustomFib(text);
  }, []);

  const Footer = useMemo(
    () => (
      <View style={styles.footerContainer}>
        <TextInput
          keyboardType="numbers-and-punctuation"
          onChangeText={onTextChange}
          style={styles.textInput}
          value={customFib}
          placeholderTextColor={theme.colors.placeholder}
          placeholder="Custom %"
        />
        <Pressable onPress={() => handleAdd()} style={styles.button}>
          <Text>Add</Text>
        </Pressable>
      </View>
    ),
    [
      customFib,
      handleAdd,
      onTextChange,
      styles.button,
      styles.footerContainer,
      styles.textInput,
      theme.colors.placeholder,
    ],
  );
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : undefined}
      keyboardVerticalOffset={height}
      style={styles.container}
    >
      <FlatList
        data={settings}
        renderItem={({ item: { display, level } }) => (
          <ListItem onPress={() => handlePress(level)} title={`${level.toFixed(2)} %`}>
            {display ? <Icons.check fill={theme.colors.colorPrimary} /> : null}
          </ListItem>
        )}
        keyExtractor={(item) => item.level.toString()}
        ListFooterComponent={Footer}
      />
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    text: {
      color: theme.colors.colorPrimary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    footerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 40,
      flex: 1,
    },
    textInput: {
      height: 45,
      flex: 1,
      borderWidth: 1,
      color: theme.colors.buttonText,
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

export default FibonacciSettings;
