import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
  NativeSyntheticEvent,
  NativeModules,
  ViewProps,
} from 'react-native';
import { TimeUnit } from '~/constants';
import { DrawingParams, DrawingSettings, DrawingTool } from '~/model';
import { ChartType } from '~/model/chart-type';

const { ChartIQWrapperModule } = NativeModules;

const LINKING_ERROR =
  `The package 'react-native-chart-iq-wrapper' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

interface ChartIqWrapperProps extends ViewProps {
  style: ViewStyle;
  onPullInitialData: (
    event: NativeSyntheticEvent<{ quoteFeedParam: string }>
  ) => Promise<void>;
  onPullUpdateData: (
    event: NativeSyntheticEvent<{ quoteFeedParam: string }>
  ) => Promise<void>;
  onPullPagingData: (
    event: NativeSyntheticEvent<{ quoteFeedParam: string }>
  ) => Promise<void>;
  onChartTypeChanged: (
    event: NativeSyntheticEvent<{ chartType: string }>
  ) => void;
  onHUDChanged: (event: NativeSyntheticEvent<{ hud: string }>) => void;
  onMeasureChanged: (event: NativeSyntheticEvent<{ measure: string }>) => void;
}

const ComponentName = 'ChartIqWrapperView';

export const ChartIqWrapperView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<ChartIqWrapperProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

export function setInitialData(data: string) {
  return ChartIQWrapperModule.setInitialData(data);
}

export function setUpdateData(data: string) {
  return ChartIQWrapperModule.setUpdateData(data);
}

export function setPagingData(data: string) {
  return ChartIQWrapperModule.setPagingData(data);
}

export function setSymbol(symbol: string) {
  return ChartIQWrapperModule.setSymbol(symbol);
}

export function setPeriodicity(
  period: number,
  interval: string,
  timeUnit: TimeUnit
) {
  return ChartIQWrapperModule.setPeriodicity(period, interval, timeUnit);
}

export function setChartStyle(obj: string, attr: string, value: string) {
  return ChartIQWrapperModule.setChartStyle(obj, attr, value);
}

export function enableCrosshairs() {
  return ChartIQWrapperModule.enableCrosshairs();
}

export function disableCrosshairs() {
  return ChartIQWrapperModule.disableCrosshairs();
}

export function setChartType(type: ChartType) {
  return ChartIQWrapperModule.setChartType(type);
}

export function getChartType(): Promise<string> {
  return ChartIQWrapperModule.getChartType();
}

export function addSeries(
  symbol: string,
  color: string,
  isComparison: boolean
) {
  return ChartIQWrapperModule.addSeries(symbol, color, isComparison);
}

export async function getSymbol(): Promise<string> {
  return await ChartIQWrapperModule.getSymbol();
}

export async function getPeriodicity(): Promise<string> {
  return await ChartIQWrapperModule.getPeriodicity();
}

export async function getChartAggregationType(): Promise<string> {
  return await ChartIQWrapperModule.getChartAggregationType();
}

export async function getActiveSeries(): Promise<
  Array<{
    color: string;
    symbolName: string;
  }>
> {
  const response = await ChartIQWrapperModule.getActiveSeries();

  return JSON.parse(response);
}

export function removeSeries(symbol: string) {
  return ChartIQWrapperModule.removeSeries(symbol);
}

export function setAggregationType(type: string) {
  return ChartIQWrapperModule.setAggregationType(type);
}

export function enableDrawing(tool: string) {
  return ChartIQWrapperModule.enableDrawing(tool);
}
export function disableDrawing() {
  return ChartIQWrapperModule.disableDrawing();
}

export async function getDrawingParams(tool: string): Promise<DrawingSettings> {
  const response = await ChartIQWrapperModule.getDrawingParams(tool);

  return JSON.parse(response);
}

export function setDrawingParams(parameterName: DrawingParams, value: string) {
  return ChartIQWrapperModule.setDrawingParams(parameterName, value);
}

export function clearDrawing() {
  return ChartIQWrapperModule.clearDrawing();
}
export function restoreDefaultDrawingConfig(
  tool: DrawingTool,
  all: boolean = false
) {
  return ChartIQWrapperModule.restoreDefaultDrawingConfig(tool, all);
}

export async function undoDrawing(): Promise<boolean> {
  return ChartIQWrapperModule.undoDrawing();
}

export async function redoDrawing(): Promise<boolean> {
  return ChartIQWrapperModule.redoDrawing();
}
