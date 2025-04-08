import React from 'react';
import {
  NativeModules,
  NativeEventEmitter,
  requireNativeComponent,
  ViewProps,
} from 'react-native';

import { ChartIQDatafeedParams } from '../interfaces';
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

const ComponentName = 'ChartIqWrapperView';

// @ts-ignore
const ChartIQWrapperView = requireNativeComponent(ComponentName);

export default ChartIQWrapperView;
