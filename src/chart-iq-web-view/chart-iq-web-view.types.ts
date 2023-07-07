import { ViewStyle, ViewProps } from 'react-native';

import { ChartIQDatafeedParams, CrosshairState } from 'src/model';
export type ChartIQNativeEvent<T> = { nativeEvent: T };
export type QuoteFeedEvent = ChartIQNativeEvent<{
  quoteFeedParam: ChartIQDatafeedParams;
}>;
export type OnStartEvent = ChartIQNativeEvent<{}>;
export type OnMeasureChangeEvent = ChartIQNativeEvent<{ measure: string }>;
export type OnChartTypeChangeEvent = ChartIQNativeEvent<{ chartType: string }>;
export type On = ChartIQNativeEvent<{ chartType: string }>;
export type OnHudChangeEvent = ChartIQNativeEvent<{ hud: CrosshairState }>;

export interface ChartIqWrapperProps extends ViewProps {
  url: string;
  style?: ViewStyle;
  onPullInitialData?: (event: QuoteFeedEvent) => Promise<void>;
  onPullUpdateData?: (event: QuoteFeedEvent) => Promise<void>;
  onPullPagingData?: (event: QuoteFeedEvent) => Promise<void>;
  onMeasureChanged?: (event: OnMeasureChangeEvent) => void;
  onStart?: (event: OnStartEvent) => void;
}
