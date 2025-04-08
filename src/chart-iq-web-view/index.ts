import { Platform } from 'react-native';

import { ChartIqWrapperViewComponent } from './chart-iq-web-view.data';
import IOSChartIQView from './chart-iq-web-view.ios';
import { ChartIqWrapperProps } from './chart-iq-web-view.types';

/**
 * ChartIQView is a wrapper component for ChartIQ charting library.
 * @param props
 * @returns {React.FC<ChartIqWrapperProps>}
 * @example
 * import { ChartIQView } from 'react-native-chartiq';
 * ...
 *
 * <ChartIQView
 * url={url}
 * />
 */
const ChartIQView = Platform.OS === 'ios' ? IOSChartIQView : ChartIqWrapperViewComponent;

export default ChartIQView;
export * from './chart-iq-web-view.types';
