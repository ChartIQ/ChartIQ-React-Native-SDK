import { Platform } from 'react-native';

export const WEB_VIEW_SOURCE = Platform.select({
  ios: 'https://mobile.demo.chartiq.com/ios/3.3.0/sample-template-native-sdk.html',
  android: 'https://mobile.demo.chartiq.com/android/3.3.0/sample-template-native-sdk.html',
}) as string;
