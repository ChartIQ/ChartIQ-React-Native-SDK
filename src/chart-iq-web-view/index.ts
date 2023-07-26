import { Platform } from 'react-native';

import { ChartIqWrapperViewComponent } from './chart-iq-web-view.data';
import IOSChartIQView from './chart-iq-web-view.ios';
import { ChartIqWrapperProps } from './chart-iq-web-view.types';

const ChartIQView = Platform.select({
  android: ChartIqWrapperViewComponent,
  ios: IOSChartIQView,
}) as React.FC<ChartIqWrapperProps>;

export default ChartIQView;
export * from './chart-iq-web-view.types';
