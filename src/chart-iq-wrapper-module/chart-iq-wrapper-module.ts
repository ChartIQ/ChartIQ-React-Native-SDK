import { Platform, NativeModules } from 'react-native';

import {
  DrawingParams,
  DrawingSettings,
  DrawingTool,
  OHLCParams,
  StudyParameter,
  StudyParameterResponse,
  TimeUnit,
  ChartType,
  Signal,
  Study,
  StudyParameterType,
  StudySimplified,
  CrosshairState,
  ChartIQStudyParameterModel,
} from '../model';

const {
  ChartIQWrapperModule: AndroidModule,
  ChartIqWrapperViewManager: IOSModule,
} = NativeModules;

const ChartIQWrapperModule = Platform.select({
  ios: IOSModule,
  android: AndroidModule,
});

/**
 * Set data for the returned onPullInitialData quote feed params by it's id
 *   **/
export function setInitialData(data: OHLCParams[], id: string) {
  ChartIQWrapperModule.setInitialData(data, id);
}

/**
 * Set data for the returned onPullUpdateData quote feed params by it's id
 *
 * @param {OHLCParams[]} data
 * @param id string
 * @returns void
 *   **/
export function setUpdateData(data: OHLCParams, id: string) {
  ChartIQWrapperModule.setUpdateData(data, id);
}

/**
 * Set data for the returned onPullPagingData quote feed params by it's id
 * @param data OHLCParams[]
 * @param id string
 * @returns void
 *   **/
export function setPagingData(data: OHLCParams[], id: string) {
  ChartIQWrapperModule.setPagingData(data, id);
}

/**
 * Set symbol by it's name
 * @param symbol string
 * @returns void
 */
export function setSymbol(symbol: string) {
  ChartIQWrapperModule.setSymbol(symbol);
}

/** Set periodicity
 * @param period number
 * @param interval string
 * @param timeUnit TimeUnit
 * @returns void
 */
export function setPeriodicity(
  period: number,
  interval: string,
  timeUnit: TimeUnit
) {
  ChartIQWrapperModule.setPeriodicity(period, interval, timeUnit);
}

/** Set chart style
 * @param obj string
 * @param attr string
 * @param value string
 * @returns void
 */
export function setChartStyle(obj: string, attr: string, value: string) {
  ChartIQWrapperModule.setChartStyle(obj, attr, value);
}

/**
 * Enable crosshairs
 * @return void
 */
export function enableCrosshairs() {
  ChartIQWrapperModule.enableCrosshairs();
}

/**
 * Disable crosshairs
 * @return void
 */
export function disableCrosshairs() {
  ChartIQWrapperModule.disableCrosshairs();
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

/**
 * Get chart type
 * @returns Promise<string>
 */
export function getChartType(): Promise<string> {
  return ChartIQWrapperModule.getChartType();
}

/**
 * Add series to chart
 * @param symbol string
 * @param color string
 * @param isComparison boolean
 * @returns {void}
 */
export function addSeries(
  symbol: string,
  color: string,
  isComparison: boolean
) {
  ChartIQWrapperModule.addSeries(symbol, color, isComparison);
}

/**
 * Get current symbol
 * @returns {Promise<string[]>} symbol
 */
export async function getSymbol(): Promise<string> {
  return await ChartIQWrapperModule.getSymbol();
}

/**
 * Get periodicity
 */
export async function getPeriodicity() {
  return (await ChartIQWrapperModule.getPeriodicity()) as {
    interval: string;
    periodicity: number;
    timeUnit: string;
  };
}

/**
 * Get chart aggregation type
 */
export async function getChartAggregationType() {
  const type = await ChartIQWrapperModule.getChartAggregationType();

  return (type as string) ?? null;
}

/**
 * Get chart compare symbols
 */
export async function getActiveSeries(): Promise<
  Array<{
    color: string;
    symbolName: string;
  }>
> {
  return await ChartIQWrapperModule.getActiveSeries();
}

/**
 * Remove series by it's name
 * @param symbol string
 */
export function removeSeries(symbol: string) {
  ChartIQWrapperModule.removeSeries(symbol);
}

/**
 * Set chart aggregation type
 * @param type string
 */
export function setAggregationType(type: string) {
  ChartIQWrapperModule.setAggregationType(type);
}

/**
 * Enable drawing
 * @param {string} tool
 * @returns void
 */
export function enableDrawing(tool: string) {
  ChartIQWrapperModule.enableDrawing(tool);
}

/**
 * Disable drawing
 * @returns void
 */
export function disableDrawing() {
  return ChartIQWrapperModule.disableDrawing();
}

/**
 * Get drawing parameters
 * @param tool string
 *
 */
export async function getDrawingParams(tool: string): Promise<DrawingSettings> {
  const response = await ChartIQWrapperModule.getDrawingParams(tool);
  if (Platform.OS === 'ios') {
    return response;
  }
  return JSON.parse(response);
}

/**
 * Set drawing parameters
 * @param parameterName DrawingParams
 * @param value string
 */
export function setDrawingParams(parameterName: DrawingParams, value: string) {
  return ChartIQWrapperModule.setDrawingParams(parameterName, value);
}

/**
 * Get drawing parameters
 * @param parameterName DrawingParams
 * @returns void
 */
export function clearDrawing() {
  ChartIQWrapperModule.clearDrawing();
}

/**
 * Get drawing parameters
 * @param parameterName DrawingParams
 * @returns void
 */
export function restoreDefaultDrawingConfig(
  tool: DrawingTool,
  all: boolean = false
) {
  ChartIQWrapperModule.restoreDefaultDrawingConfig(tool, all);
}

/**
 * Undo drawing
 * @returns {Promise}
 */
export async function undoDrawing(): Promise<boolean> {
  return ChartIQWrapperModule.undoDrawing();
}

/** */
export async function redoDrawing(): Promise<boolean> {
  return ChartIQWrapperModule.redoDrawing();
}

/** */
export async function getStudyList() {
  return (await ChartIQWrapperModule.getStudyList()) as Array<Study>;
}

/** */
export async function getExtendedHours(): Promise<boolean> {
  return await ChartIQWrapperModule.getExtendedHours();
}

/** */
export function setExtendedHours(value: boolean) {
  return ChartIQWrapperModule.setExtendedHours(value);
}

/** */
export function setTheme(theme: 'day' | 'night' | 'none') {
  return ChartIQWrapperModule.setTheme(theme);
}

/** */
export function setChartScale(scale: 'log' | 'linear') {
  return ChartIQWrapperModule.setChartScale(scale);
}

/** */
export async function getChartScale(): Promise<string> {
  return await ChartIQWrapperModule.getChartScale();
}

/** */
export async function getIsInvertYAxis(): Promise<boolean> {
  return await ChartIQWrapperModule.getIsInvertYAxis();
}

/** */
export function setIsInvertYAxis(value: boolean) {
  return ChartIQWrapperModule.setIsInvertYAxis(value);
}

/** */
export async function getActiveStudies() {
  return (await ChartIQWrapperModule.getActiveStudies()) as Study[];
}

/** */
export function addStudy(study: Study, isClone: boolean = false) {
  return ChartIQWrapperModule.addStudy(study, isClone);
}

/** */
export async function getStudyParameters(
  study: Study,
  type: StudyParameterType
) {
  const response = await ChartIQWrapperModule.getStudyParameters(study, type);

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

/** */
export function removeStudy(study: Study) {
  return ChartIQWrapperModule.removeStudy(study);
}

/** */
export function setStudyParameter(
  study: Study,
  parameter: ChartIQStudyParameterModel
) {
  return ChartIQWrapperModule.setStudyParameter(study, parameter);
}

/** */
export async function setStudyParameters(
  study: Study,
  parameter: ChartIQStudyParameterModel[]
) {
  const response = await ChartIQWrapperModule.setStudyParameters(
    study,
    parameter
  );

  if (Platform.OS === 'ios') {
    return response as StudySimplified;
  }

  return JSON.parse(response) as StudySimplified;
}

/** */
export async function getActiveSignals() {
  const response = await ChartIQWrapperModule.getActiveSignals();
  if (Platform.OS === 'ios') {
    return response;
  }
  return JSON.parse(response) as Signal[];
}

/**
 * Add signal study by study shortName
 * @param name string
 */
export async function addSignalStudy(name: string) {
  const response = await ChartIQWrapperModule.addSignalStudy(name);
  if (Platform.OS === 'ios') {
    return response as Study;
  }
  return JSON.parse(response) as Study;
}

/** */
export function addSignal(signal: Signal, editMode: boolean = false) {
  ChartIQWrapperModule.addSignal(signal, editMode);
}

/** */
export function toggleSignal(signal: Signal) {
  ChartIQWrapperModule.toggleSignal(signal);
}

/** */
export function removeSignal(signal: Signal) {
  return ChartIQWrapperModule.removeSignal(signal);
}

/** */
export async function getTranslations(languageCode: string) {
  const response = await ChartIQWrapperModule.getTranslations(languageCode);

  if (Platform.OS === 'ios') {
    return response;
  }
  return JSON.parse(response);
}

/** */
export function setLanguage(languageCode: string) {
  return ChartIQWrapperModule.setLanguage(languageCode);
}
