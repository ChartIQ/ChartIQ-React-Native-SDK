import { Platform, UIManager, requireNativeComponent } from 'react-native';

import { ChartIqWrapperProps } from './chart-iq-web-view.types';

export const LINKING_ERROR =
  "The package 'react-native-chart-iq-wrapper' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ComponentName = 'ChartIqWrapperView';

export const ChartIqWrapperViewComponent =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<ChartIqWrapperProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
