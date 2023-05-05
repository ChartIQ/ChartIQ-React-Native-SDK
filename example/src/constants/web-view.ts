import { Platform } from 'react-native';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';

const uri = Platform.select({
  ios: 'https://mobile.demo.chartiq.com/ios/3.3.0/sample-template-native-sdk.html',
  android: 'https://mobile.demo.chartiq.com/android/3.2.0/sample-template-native-sdk.html',
}) as string;

export const WEB_VIEW_SOURCE: WebViewSource = {
  uri: uri,
};
