# ChartIQ-React-Native-SDK

React Native SDK for the [ChartIQ JavaScript library](https://documentation.chartiq.com).

The ChartIQ React Native SDK supports a basic charting application. This SDK can be extended to support more elaborate implementations by adding code to invoke ChartIQ library functions directly or by creating a bridge file similar to *nativeSdkBridge.js* (in the *mobile/js* folder of your ChartIQ library). 

Contact us at <support@chartiq.com> to request sample code and guidance on how to extend the SDK.

## Requirements

- A copy of the ChartIQ JavaScript library (works best with version 9.0.0).
  - If you do not have a copy of the library or need a different version, please contact your account manager or visit our <a href="https://pages.marketintelligence.spglobal.com/ChartIQ-Follow-up-Request.html" target="_blank">Request Follow-Up Site</a>.

- React Native 0.71.7
- Android 8.1 Oreo (API level 27) or later
- iOS 10.3 or later

## App

The [example](https://github.com/ChartIQ/ChartIQ-React-Native-SDK/tree/main/example) folder of this repository contains both Android and iOS app that was built using the SDK. Customize the apps to quickly create your own React Native charting application.

**App screen shots**

<table>
  <tr>
    <td><img src="https://github.com/ChartIQ/ChartIQ-Android-SDK/blob/main/screenshots/Candle_Chart.png?raw=true" alt="Candle chart" width="200" height="440"/></td>
    <td><img src="https://github.com/ChartIQ/ChartIQ-Android-SDK/blob/main/screenshots/Chart_with_Studies.png?raw=true" alt="Chart with studies" width="200" height="440"/></td>
    <td><img src="https://github.com/ChartIQ/ChartIQ-Android-SDK/blob/main/screenshots/Chart_Styles_and_Types.png?raw=true" alt="Chart styles and types" width="200" height="440"/></td>
  </tr>
</table>

## Getting started

> While it's possible to use [`npm`](https://github.com/npm/cli), the tooling is built around [`yarn`](https://classic.yarnpkg.com/), so you'll have an easier time if you use `yarn` for development.

```sh
yarn add @chartiq/react-native-chartiq
```

or

```sh
npm i @chartiq/react-native-chartiq
```

## IOS installation additional step

Go to the ios folder and run pod install

```sh
cd ios
pod install
```

## Quick start guide

To get started with the project, run `yarn` in the root directory to install the required dependencies for each package:

```sh
yarn
```

While developing you can run the [example app](/example/) to test your changes. Any changes you make in your library's JavaScript code will be reflected in the example app without a rebuild. If you change any native code, then you'll need to rebuild the example app.

Import the library and provide a remote url to the ChartIQ library and set the dataMethod to either "pull" or "push" depending on how you want to provide data to the chart.

```js
import { ChartIqWrapperView } from 'react-native-chartiq';

// ...

<ChartIQView
  url={WEB_VIEW_SOURCE} // url to ChartIQ JS library
  dataMethod="pull"
  onStart={() => {
    // do something when chart is ready e.g. set symbol, theme etc.
  }}
  style={styles.chartIq}
/>;
```

To start the packager:

```sh
yarn example start
```

To run the example app on Android:

```sh
yarn example android
```

To run the example app on iOS:

```sh
yarn example ios
```

## API documentation

The React Native sdk utilizes the existing mobile sdk that we have to offer.

- [React Native SDK](https://documentation.chartiq.com/react-native-sdk/)

- [Android SDK](https://documentation.chartiq.com/android-sdk/)

- [iOS SDK](https://documentation.chartiq.com/ios-sdk/)

- [ChartIQ JavaScript library](https://documentation.chartiq.com)

## Questions and support

Contact our development support team at <support@chartiq.com>.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

Apache2

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
