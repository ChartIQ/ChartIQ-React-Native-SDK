# react-native-chart-iq-wrapper

react-native-chart-iq-wrapper

## Installation

```sh
npm install react-native-chart-iq
```

or

```sh
yarn add react-native-chart-iq
```

## IOS installation additional step

Go to the ios folder and run pod install

```sh
cd ios
pod install
```

## Quick start guide

1. Import the library and provide a remote url to the ChartIQ library and set the dataMethod to either "pull" or "push" depending on how you want to provide data to the chart.

```js
import { ChartIqWrapperView } from 'react-native-chart-iq';

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

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
