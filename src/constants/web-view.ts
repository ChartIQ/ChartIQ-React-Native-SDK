import { Platform } from 'react-native';

export const WEB_VIEW_SOURCE = Platform.select({
  ios: 'https://mobiletrade.hankotrade.com/charts/sample-template-native-sdk.html',
  android: 'https://mobiletrade.hankotrade.com/charts/sample-template-native-sdk.html',
}) as string;
