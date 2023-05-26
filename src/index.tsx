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
import {
  DrawingParams,
  DrawingSettings,
  DrawingTool,
  StudyParameterModel,
} from '~/model';
import { ChartType } from '~/model/chart-type';
import { Signal } from '~/model/signals';
import { Study, StudyParameterType } from '~/model/study';
import { StudySimplified } from '~/model/study/study';

const { ChartIQWrapperModule } = NativeModules;

const LINKING_ERROR =
  "The package 'react-native-chart-iq-wrapper' doesn't seem to be linked. Make sure: \n\n" +
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
  onChartAggregationTypeChanged: (
    event: NativeSyntheticEvent<{ aggregationType: string }>
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

export async function getPeriodicity() {
  return ChartIQWrapperModule.getPeriodicity();
}

export async function getChartAggregationType() {
  const type = await ChartIQWrapperModule.getChartAggregationType();

  return type as string | null;
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

export async function getStudyList() {
  const response = await ChartIQWrapperModule.getStudyList();

  return JSON.parse(response) as Array<Study>;
}

export async function getExtendedHours(): Promise<boolean> {
  return await ChartIQWrapperModule.getExtendedHours();
}

export function setExtendedHours(value: boolean) {
  return ChartIQWrapperModule.setExtendedHours(value);
}

export function setTheme(theme: 'day' | 'night' | 'none') {
  return ChartIQWrapperModule.setTheme(theme);
}

export function setChartScale(scale: 'log' | 'linear') {
  return ChartIQWrapperModule.setChartScale(scale);
}

export async function getChartScale(): Promise<string> {
  return await ChartIQWrapperModule.getChartScale();
}

export async function getIsInvertYAxis(): Promise<boolean> {
  return await ChartIQWrapperModule.getIsInvertYAxis();
}

export function setIsInvertYAxis(value: boolean) {
  return ChartIQWrapperModule.setIsInvertYAxis(value);
}

export async function getActiveStudies() {
  const activeStudies = await ChartIQWrapperModule.getActiveStudies();

  return JSON.parse(activeStudies) as Study[];
}

export function addStudy(study: Study, isClone: boolean = false) {
  return ChartIQWrapperModule.addStudy(JSON.stringify(study), isClone);
}

export async function getStudyParameters(
  study: Study,
  type: StudyParameterType
) {
  const response = await ChartIQWrapperModule.getStudyParameters(
    JSON.stringify(study),
    type
  );

  return JSON.parse(response);
}

export function removeStudy(study: Study) {
  return ChartIQWrapperModule.removeStudy(JSON.stringify(study));
}

export function setStudyParameter(
  study: Study,
  parameter: StudyParameterModel
) {
  return ChartIQWrapperModule.setStudyParameter(
    JSON.stringify(study),
    JSON.stringify(parameter)
  );
}

export async function setStudyParameters(
  study: Study,
  parameter: StudyParameterModel[]
) {
  const response = await ChartIQWrapperModule.setStudyParameters(
    JSON.stringify(study),
    JSON.stringify(parameter)
  );
  return JSON.parse(response) as StudySimplified;
}

export async function getActiveSignals() {
  const response = await ChartIQWrapperModule.getActiveSignals();

  return JSON.parse(response) as Signal[];
}

export async function addSignalStudy(name: string) {
  const response = await ChartIQWrapperModule.addSignalStudy(name); // rename native method

  return JSON.parse(response) as Study;
}

export function addSignal(signal: Signal, editMode: boolean = false) {
  return ChartIQWrapperModule.addSignal(JSON.stringify(signal), editMode);
}

export function toggleSignal(signal: Signal) {
  return ChartIQWrapperModule.toggleSignal(JSON.stringify(signal));
}

export function removeSignal(signal: Signal) {
  return ChartIQWrapperModule.removeSignal(JSON.stringify(signal));
}

export async function getTranslations(languageCode: string) {
  const response = await ChartIQWrapperModule.getTranslations(languageCode);

  return JSON.parse(response);
}

export function setLanguage(languageCode: string) {
  return ChartIQWrapperModule.setLanguage(languageCode);
}
