import React, { useEffect, useReducer } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import Navigation from './src/nav/Navigation';
import { DrawingContext, DrawingDispatchContext } from './src/context/drawing-context/drawing.context';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { TranslationsContext, TranslationsDispatchContext } from './src/context/translations-context/translations.context'
import { translationsInitialState, translationsReducer } from './src/context/translations-context/translations.reducer';
import { drawingInitialState, drawingReducer } from './src/context/drawing-context/drawing.reducer';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { store } from './src/store/store/store';
import SafeAreaStatusBar from './src/statusbar/safeAreaStatusBar';

const App = (props) => {
  const [drawingState, dispatch] = useReducer(drawingReducer, drawingInitialState);
  const [translationsState, dispatchTranslations] = useReducer(
    translationsReducer,
    translationsInitialState,
  );


  useEffect(() => {
    console.log('Hi', props)
    props?.navigation?.navigate('Root')
  }, [])


  return (

    <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
      <SafeAreaStatusBar />

      <ActionSheetProvider>
        <TranslationsContext.Provider value={translationsState}>
          <TranslationsDispatchContext.Provider value={dispatchTranslations}>
            <Provider store={store} >
              <SafeAreaView style={{ flex: 1 }} >
                <StatusBar
                  translucent={true}
                  animated={false}
                  barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
                  backgroundColor={Colors.status_bar}
                  hidden={false}
                  showHideTransition={false}
                />
                <DrawingContext.Provider value={drawingState}>
                  <DrawingDispatchContext.Provider value={dispatch}>
                    <BottomSheetModalProvider>
                      <Navigation />
                    </BottomSheetModalProvider>
                  </DrawingDispatchContext.Provider>
                </DrawingContext.Provider>
              </SafeAreaView>
            </Provider>
          </TranslationsDispatchContext.Provider>
        </TranslationsContext.Provider>
      </ActionSheetProvider>
    </GestureHandlerRootView>

  );
}
export default App;
