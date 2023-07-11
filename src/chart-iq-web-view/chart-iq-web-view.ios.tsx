import React, { useEffect } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';

import { ChartIQDatafeedParams, CrosshairState } from '../model';

import { ChartIqWrapperViewComponent } from './chart-iq-web-view.data';
import { ChartIqWrapperProps } from './chart-iq-web-view.types';

const { RTEEventEmitter } = NativeModules;

const RTVEventEmitter = new NativeEventEmitter(RTEEventEmitter);

enum IOSEventEmitterKeys {
  DispatchOnPullInitialData = 'DispatchOnPullInitialData',
  DispatchOnPullUpdateData = 'DispatchOnPullUpdateData',
  DispatchOnPullPagingData = 'DispatchOnPullPagingData',
  DispatchOnChartStart = 'DispatchOnChartStart',
  DispatchOnLayoutUpdate = 'DispatchOnLayoutUpdate',
  DispatchOnSymbolUpdate = 'DispatchOnSymbolUpdate',
  DispatchOnDrawingUpdate = 'DispatchOnDrawingUpdate',
  DispatchOnMeasureUpdate = 'DispatchOnMeasureUpdate',
  DispatchOnHUDUpdate = 'DispatchOnHUDUpdate',
}

const ChartIQWrapperView: React.FC<ChartIqWrapperProps> = ({
  onPullInitialData,
  onPullUpdateData,
  onPullPagingData,
  onStart,
  onMeasureChanged,
  ...props
}) => {
  useEffect(() => {
    const pullInitialSubscription = RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnPullInitialData,
      (quote: { quoteFeedParam: ChartIQDatafeedParams }) => {
        onPullInitialData &&
          onPullInitialData({
            nativeEvent: { quoteFeedParam: quote.quoteFeedParam },
          });
      }
    );
    const pullUpdateSubscription = RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnPullUpdateData,
      (quote: { quoteFeedParam: ChartIQDatafeedParams }) => {
        onPullUpdateData &&
          onPullUpdateData({
            nativeEvent: { quoteFeedParam: quote.quoteFeedParam },
          });
      }
    );
    const pullPagingSubscription = RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnPullPagingData,
      (quote: { quoteFeedParam: ChartIQDatafeedParams }) => {
        onPullPagingData &&
          onPullPagingData({
            nativeEvent: { quoteFeedParam: quote.quoteFeedParam },
          });
      }
    );
    const pullStartSubscription = RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnChartStart,
      () => {
        onStart && onStart({ nativeEvent: {} });
      }
    );
    const pullMeasureSubscription = RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnMeasureUpdate,
      (payload: string) => {
        onMeasureChanged &&
          onMeasureChanged({ nativeEvent: { measure: payload } });
      }
    );

    // NOTE: This event is not used in the app probably it is not needed
    const pullLayoutSubscription = RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnLayoutUpdate,
      (payload) => {
        // console.log('DispatchOnLayoutUpdate', payload);
      }
    );
    const pullSymbolUpdateSubscription = RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnSymbolUpdate,
      (payload) => {
        // console.log('DispatchOnSymbolUpdate', payload);
      }
    );
    const pullDrawingUpdateSubscription = RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnDrawingUpdate,
      (payload) => {
        // console.log('DispatchOnDrawingUpdate', payload);
      }
    );

    return () => {
      pullInitialSubscription.remove();
      pullUpdateSubscription.remove();
      pullPagingSubscription.remove();
      pullStartSubscription.remove();
      pullMeasureSubscription.remove();
      pullLayoutSubscription.remove();
      pullSymbolUpdateSubscription.remove();
      pullDrawingUpdateSubscription.remove();
    };
  }, []);

  return <ChartIqWrapperViewComponent {...props} />;
};

export default ChartIQWrapperView;
