import { createStore, combineReducers } from 'redux';
import reducer from '../reducer/reducer';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'DATA',

  ],
}
const rootReducer = combineReducers({
  DATA: reducer,


});


const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer)
export const persistor = persistStore(store)
