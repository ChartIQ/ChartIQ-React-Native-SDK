import { Platform, UIManager, requireNativeComponent } from 'react-native';

import { ChartIqWrapperProps } from './chart-iq-web-view.types';

const LINKING_ERROR =
  `The package 'react-native-chartiq' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", android: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ComponentName = 'ChartIqWrapperView';

const getNativeComponent = () => {
  if (UIManager.getViewManagerConfig(ComponentName) == null) {
    throw new Error(LINKING_ERROR);
  }
  return requireNativeComponent<ChartIqWrapperProps>(ComponentName);
};

export const ChartIqWrapperViewComponent = getNativeComponent();
