import { Platform, NativeModules } from 'react-native';

import {
  DrawingParams,
  DrawingSettings,
  DrawingTool,
  OHLCParams,
  StudyParameter,
  StudyParameterModel,
  StudyParameterResponse,
  TimeUnit,
  ChartType,
  Signal,
  Study,
  StudyParameterType,
  StudySimplified,
} from '../model';

const {
  ChartIQWrapperModule: AndroidModule,
  ChartIqWrapperViewManager: IOSModule,
} = NativeModules;

const ChartIQWrapperModule = Platform.select({
  ios: IOSModule,
  android: AndroidModule,
});

export function setInitialData(data: OHLCParams[], id: string) {
  return ChartIQWrapperModule.setInitialData(data, id);
}

export function setUpdateData(data: OHLCParams[], id: string) {
  return ChartIQWrapperModule.setUpdateData(data, id);
}

export function setPagingData(data: OHLCParams[], id: string) {
  return ChartIQWrapperModule.setPagingData(data, id);
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

export async function getHudDetails() {
  return (await ChartIQWrapperModule.getHudDetails()) as CrosshairState;
}

/**
 * Set chart type
 * @param type ChartType
 * @returns void
 */
export function setChartType(type: ChartType) {
  ChartIQWrapperModule.setChartType(type);
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
  return (await ChartIQWrapperModule.getPeriodicity()) as {
    interval: string;
    periodicity: number;
    timeUnit: string;
  };
}

export async function getChartAggregationType() {
  const type = await ChartIQWrapperModule.getChartAggregationType();

  return (type as string) ?? null;
}

export async function getActiveSeries(): Promise<
  Array<{
    color: string;
    symbolName: string;
  }>
> {
  return await ChartIQWrapperModule.getActiveSeries();
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
  if (Platform.OS === 'ios') {
    return response;
  }
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
  return (await ChartIQWrapperModule.getStudyList()) as Array<Study>;
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
  return (await ChartIQWrapperModule.getActiveStudies()) as Study[];
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

  if (Platform.OS == 'ios') {
    return response;
  }

  const data = JSON.parse(response) as StudyParameterResponse[];

  return data.map((item) => {
    const value = JSON.parse(item.fieldValue);
    return {
      ...value,
      fieldType: item.fieldType,
    } as StudyParameter;
  });
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

  if (Platform.OS === 'ios') {
    return response as StudySimplified;
  }

  return JSON.parse(response) as StudySimplified;
}

export async function getActiveSignals() {
  const response = await ChartIQWrapperModule.getActiveSignals();
  if (Platform.OS === 'ios') {
    return response;
  }
  return JSON.parse(response) as Signal[];
}

export async function addSignalStudy(name: string) {
  const response = await ChartIQWrapperModule.addSignalStudy(name);
  if (Platform.OS === 'ios') {
    return response as Study;
  }
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

  if (Platform.OS === 'ios') {
    return response;
  }
  return JSON.parse(response);
}

export function setLanguage(languageCode: string) {
  return ChartIQWrapperModule.setLanguage(languageCode);
}
