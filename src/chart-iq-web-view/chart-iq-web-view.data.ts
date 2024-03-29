import { Platform, UIManager, requireNativeComponent } from 'react-native';

import { ChartIqWrapperProps } from './chart-iq-web-view.types';

export const LINKING_ERROR =
  "The package 'react-native-chartiq' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ComponentName = 'ChartIqWrapperView';

export const ChartIqWrapperViewComponent: React.FC<ChartIqWrapperProps> =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<ChartIqWrapperProps>(ComponentName)
    : ((() => {
        throw new Error(LINKING_ERROR);
      }) as any);
