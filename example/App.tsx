import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer, Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DrawingContext, DrawingDispatchContext } from '~/context/drawing-context/drawing.context';
import { drawingInitialState, drawingReducer } from '~/context/drawing-context/drawing.reducer';
import {
  TranslationsContext,
  TranslationsDispatchContext,
} from '~/context/translations-context/translations.context';
import {
  translationsInitialState,
  translationsReducer,
} from '~/context/translations-context/translations.reducer';
import { RootNavigator } from '~/navigation';
import { useTheme } from '~/theme';

export default function App() {
  const [drawingState, dispatch] = React.useReducer(drawingReducer, drawingInitialState);
  const [translationsState, dispatchTranslations] = React.useReducer(
    translationsReducer,
    translationsInitialState,
  );

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
    <SafeAreaProvider>
      <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
        <ActionSheetProvider>
          <TranslationsContext.Provider value={translationsState}>
            <TranslationsDispatchContext.Provider value={dispatchTranslations}>
              <DrawingContext.Provider value={drawingState}>
                <DrawingDispatchContext.Provider value={dispatch}>
                  <NavigationContainer theme={navigationTheme}>
                    <BottomSheetModalProvider>
                      <RootNavigator />
                    </BottomSheetModalProvider>
                  </NavigationContainer>
                </DrawingDispatchContext.Provider>
              </DrawingContext.Provider>
            </TranslationsDispatchContext.Provider>
          </TranslationsContext.Provider>
        </ActionSheetProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
