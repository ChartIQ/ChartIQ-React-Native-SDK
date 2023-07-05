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
  onHUDChanged,
  ...props
}) => {
  useEffect(() => {
    RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnPullInitialData,
      (quote: { quoteFeedParam: ChartIQDatafeedParams }) => {
        onPullInitialData &&
          onPullInitialData({
            nativeEvent: { quoteFeedParam: quote.quoteFeedParam },
          });
      }
    );
    RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnPullUpdateData,
      (quote: { quoteFeedParam: ChartIQDatafeedParams }) => {
        onPullUpdateData &&
          onPullUpdateData({
            nativeEvent: { quoteFeedParam: quote.quoteFeedParam },
          });
      }
    );
    RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnPullPagingData,
      (quote: { quoteFeedParam: ChartIQDatafeedParams }) => {
        onPullPagingData &&
          onPullPagingData({
            nativeEvent: { quoteFeedParam: quote.quoteFeedParam },
          });
      }
    );
    RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnChartStart,
      () => {
        onStart && onStart({ nativeEvent: {} });
      }
    );
    RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnMeasureUpdate,
      (payload: string) => {
        onMeasureChanged &&
          onMeasureChanged({ nativeEvent: { measure: payload } });
      }
    );
    RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnHUDUpdate,
      (payload: CrosshairState) => {
        onHUDChanged && onHUDChanged({ nativeEvent: { hud: payload } });
      }
    );
    // NOTE: This event is not used in the app probably it is not needed
    RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnLayoutUpdate,
      (payload) => {
        // console.log('DispatchOnLayoutUpdate', payload);
      }
    );
    RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnSymbolUpdate,
      (payload) => {
        // console.log('DispatchOnSymbolUpdate', payload);
      }
    );
    RTVEventEmitter.addListener(
      IOSEventEmitterKeys.DispatchOnDrawingUpdate,
      (payload) => {
        // console.log('DispatchOnDrawingUpdate', payload);
      }
    );
  }, [
    onHUDChanged,
    onMeasureChanged,
    onPullInitialData,
    onPullPagingData,
    onPullUpdateData,
    onStart,
  ]);

  return <ChartIqWrapperViewComponent {...props} />;
};

export default ChartIQWrapperView;
