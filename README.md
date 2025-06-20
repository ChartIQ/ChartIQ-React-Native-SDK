# ChartIQ-React-Native-SDK

React Native SDK for the [ChartIQ JavaScript library](https://documentation.chartiq.com).

The ChartIQ React Native SDK supports a basic charting application. This SDK can be extended to support more elaborate implementations by adding code to invoke ChartIQ library functions directly or by creating a bridge file similar to _nativeSdkBridge.js_ (in the _mobile/js_ folder of your ChartIQ library).

Contact us at <support@chartiq.com> to request sample code and guidance on how to extend the SDK.

## Requirements

- A copy of the ChartIQ JavaScript library (works best with version 9.8.0).
  - If you do not have a copy of the library or need a different version, please contact your account manager or visit our <a href="https://pages.marketintelligence.spglobal.com/ChartIQ-Follow-up-Request.html" target="_blank">Request Follow-Up Site</a>.

- React Native 0.77.2
- Android 8.1 Oreo (API level 27) or later
- iOS 10.3 or later

**Important:** This SDK requires additional configuration to be able to work with the remote npm registry introduced in version 9.5.1.

## App

The [example](https://github.com/ChartIQ/ChartIQ-React-Native-SDK/tree/main/example) folder of this repository contains both Android and iOS app that was built using the SDK. Customize the apps to quickly create your own React Native charting application.

### Known issues

- Macs with Apple silicon processors have issues building the example app with flipper enabled.
  In order to fix this, you need either to update FlipperTransportTypes.h including the following line:
  ```
  #include <functional>
  ```
  or to disable Flipper in the example app installing pods with the following command:
  ```
  NO_FLIPPER=1 pod install
  ```

**App screen shots**

<table>
  <tr>
    <td><img src="https://github.com/ChartIQ/ChartIQ-Android-SDK/blob/main/screenshots/Candle_Chart.png?raw=true" alt="Candle chart" width="200" height="440"/></td>
    <td><img src="https://github.com/ChartIQ/ChartIQ-Android-SDK/blob/main/screenshots/Chart_with_Studies.png?raw=true" alt="Chart with studies" width="200" height="440"/></td>
    <td><img src="https://github.com/ChartIQ/ChartIQ-Android-SDK/blob/main/screenshots/Chart_Styles_and_Types.png?raw=true" alt="Chart styles and types" width="200" height="440"/></td>
  </tr>
</table>


## Run example app

While it's possible to use [`npm`](https://github.com/npm/cli), the tooling is built around [`yarn`](https://classic.yarnpkg.com/), so you'll have an easier time if you use `yarn` for development.

To get started with the provided example project, run `yarn` in the root directory to install the required dependencies for each package:

```sh
yarn
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

### iOS installation additional steps

This project has been tested using Cocoapods 1.16.2.

If you are testing the iOS example app on a physical device you might have to install the `ios-deploy` package.
 
```sh
yarn global add ios-deploy
```

While developing you can run the [example app](https://github.com/ChartIQ/ChartIQ-React-Native-SDK/tree/main/example) to test your changes. Any changes you make in your library's JavaScript code will be reflected in the example app without a rebuild. If you change any native code, then you'll need to rebuild the example app.

## Using ChartIQ React Native module

We offer a [npm module](https://www.npmjs.com/package/@chartiq/react-native-chartiq) that contains the project source SDK along with the necessary mobile bridge code for Android and iOS. 

```sh
yarn add @chartiq/react-native-chartiq
```

or

```sh
npm i @chartiq/react-native-chartiq
```

Import the library into your project, provide a url to your deployed [ChartIQ app](https://documentation.chartiq.com/tutorial-Quick%20Start.html) in the ChartIQView component, and set the dataMethod to either "pull" or "push", depending on how you want to provide data to the chart.

```js
import {ChartIQView} from '@chartiq/react-native-chartiq';

// ...

// sample styles for webview
const createStyles = () =>
  StyleSheet.create({
    box: {
      flex: 1,
    },
    chartIQ: {
      flex: 1,
    }
  });

const stylesTest = createStyles();

// ...

// Create the webview component
<View style={stylesTest.box}>
	<ChartIQView
        url="WEB_VIEW_SOURCE" // url to ChartIQ JS library
        dataMethod="pull"
        //onStart={initChart}
        //onPullInitialData={onPullInitialData}
        //onPullUpdateData={onPullUpdateData}
        //onPullPagingData={onPullPagingData}
        //onMeasureChanged={onMeasureChanged}
        style={stylesTest.chartIQ}
	/>
 </View>
```

Now this will get you a blank chart when you launch your app as there is no data being passed in yet. As you see the data methods and onStart methods are commented out in the example above. Those will be further explored in our upcoming user guide, but in the meantime you can follow what we are doing in our own [example app](https://github.com/ChartIQ/ChartIQ-React-Native-SDK/blob/main/example/src/screens/root/root.screen.tsx#L119).

### Android Note
When you install the ChartIQ sdk module you might have to set `allowBackup` in the AndroidManifest.xml file for your project, if it's not already set.

```js
tools:replace="android:allowBackup"
android:allowBackup="false"
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

See the [contributing guide](https://github.com/ChartIQ/ChartIQ-React-Native-SDK/tree/main/CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

Apache2

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
