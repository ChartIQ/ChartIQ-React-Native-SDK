import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';

import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawingContext, DrawingDispatchContext } from '~/context/drawing-context/drawing.context';
import { drawingInitialState, drawingReducer } from '~/context/drawing-context/drawing.reducer';
import { RootNavigator } from '~/navigation';

export default function App() {
  const [drawingState, dispatch] = React.useReducer(drawingReducer, drawingInitialState);

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
      <KeyboardAvoidingView
        style={StyleSheet.absoluteFillObject}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 0}
        enabled={Platform.OS === 'ios' ? true : false}
      >
        <ActionSheetProvider>
          <DrawingContext.Provider value={drawingState}>
            <DrawingDispatchContext.Provider value={dispatch}>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </DrawingDispatchContext.Provider>
          </DrawingContext.Provider>
        </ActionSheetProvider>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}
