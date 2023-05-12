import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer, Theme } from '@react-navigation/native';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';

import { DrawingContext, DrawingDispatchContext } from '~/context/drawing-context/drawing.context';
import { drawingInitialState, drawingReducer } from '~/context/drawing-context/drawing.reducer';
import { RootNavigator } from '~/navigation';
import { i18n } from '~/localization';
import { useTheme } from '~/theme';

export default function App() {
  const [drawingState, dispatch] = React.useReducer(drawingReducer, drawingInitialState);
  const { colors, isDark } = useTheme();
  const navigationTheme: Theme = {
    colors: {
      background: colors.background,
      border: colors.border,
      card: colors.background,
      notification: colors.colorPrimary,
      primary: colors.colorPrimary,
      text: colors.buttonText,
    },
    dark: isDark,
  };
  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
      <KeyboardAvoidingView
        style={StyleSheet.absoluteFillObject}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 0}
        enabled={Platform.OS === 'ios' ? true : false}
      >
        <I18nextProvider i18n={i18n}>
          <ActionSheetProvider>
            <DrawingContext.Provider value={drawingState}>
              <DrawingDispatchContext.Provider value={dispatch}>
                <NavigationContainer theme={navigationTheme}>
                  <RootNavigator />
                </NavigationContainer>
              </DrawingDispatchContext.Provider>
            </DrawingContext.Provider>
          </ActionSheetProvider>
        </I18nextProvider>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}
