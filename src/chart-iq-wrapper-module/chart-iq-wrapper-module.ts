import { Platform, NativeModules } from 'react-native';

import {
  ChartType,
  DrawingParams,
  DrawingSettings,
  DrawingTool,
  TimeUnit,
} from '../enums';
import {
  ChartIQStudyParameterModel,
  CrosshairState,
  OHLCParams,
  Signal,
  Study,
  StudyParameter,
  StudyParameterResponse,
  StudyParameterType,
  StudySimplified,
} from '../interfaces';

const {
  ChartIQWrapperModule: AndroidModule,
  ChartIqWrapperViewManager: IOSModule,
} = NativeModules;

const ChartIQWrapperModule = Platform.select({
  ios: IOSModule,
  android: AndroidModule,
});

export async function setSymbol(symbol: string) {
  await ChartIQWrapperModule.setSymbol(symbol);
}

/**
 * Set data for the returned onPullInitialData quote feed params by it's id
 * @param {OHLCParams[]} data
 * @param {string} id - id of the quote feed
 * @returns void
 * @example
 * ChartIQ.setInitialData(data, id)
 */
export function setInitialData(data: OHLCParams[], id: string) {
  ChartIQWrapperModule.setInitialData(data, id);
}

/**
 * Set data for the returned onPullUpdateData quote feed params by it's id
 * @param {OHLCParams[]} data
 * @param {string} id - id of the quote feed
 * @returns void
 * @example
 * ChartIQ.setUpdateData(data, id)
 *   **/
export function setUpdateData(data: OHLCParams[], id: string) {
  ChartIQWrapperModule.setUpdateData(data, id);
}

/**
 * Set data for the returned onPullPagingData quote feed params by it's id
 * @param {OHLCParams[]} data
 * @param {string} id - id of the quote feed
 * @returns void
 * @example
 * ChartIQ.setPagingData(data, id)
 *   **/
export function setPagingData(data: OHLCParams[], id: string) {
  ChartIQWrapperModule.setPagingData(data, id);
}

/** Set periodicity
 * @param {number} period
 * @param {string} interval
 * @param {TimeUnit} timeUnit
 * @returns void
 * @example
 * ChartIQ.setPeriodicity(1, "1", TimeUnit.DAY)
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
 * @example
 * ChartIQ.enableCrosshairs()
 */
export function enableCrosshairs() {
  ChartIQWrapperModule.enableCrosshairs();
}

/**
 * Disable crosshairs
 * @return void
 * @example
 * ChartIQ.disableCrosshairs()
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
 * @example
 * ChartIQ.setChartType(ChartType.CANDLE)
 */
export function setChartType(type: ChartType) {
  ChartIQWrapperModule.setChartType(type);
}

/**
 * Get chart type
 * @returns {Promise<string>} chartType
 * @example
 * ChartIQ.getChartType()
 */
export function getChartType(): Promise<string> {
  return ChartIQWrapperModule.getChartType();
}

/**
 * Add series to chart
 * @param {string} symbol
 * @param {string} color
 * @param {boolean} isComparison
 * @returns {void}
 * @example
 * ChartIQ.addSeries("AAPL", "#ff0000", false)
 */
export function addSeries(
  symbol: string,
  color: string,
  isComparison: boolean
): void {
  ChartIQWrapperModule.addSeries(symbol, color, isComparison);
}

/**
 * Get current symbol
 * @returns {Promise<string[]>} symbol
 * @example
 * ChartIQ.getSymbol()
 */
export async function getSymbol(): Promise<string> {
  return await ChartIQWrapperModule.getSymbol();
}

/**
 * Get periodicity
 * @returns {Promise<{interval: string, periodicity: number, timeUnit: string}>} periodicity
 * @example
 * ChartIQ.getPeriodicity()
 */
export async function getPeriodicity(): Promise<{
  interval: string;
  periodicity: number;
  timeUnit: string;
}> {
  return (await ChartIQWrapperModule.getPeriodicity()) as {
    interval: string;
    periodicity: number;
    timeUnit: string;
  };
}

/**
 * Get chart aggregation type
 * @returns {Promise<string | null>} aggregationType
 * @example
 * ChartIQ.getChartAggregationType()
 */
export async function getChartAggregationType(): Promise<string | null> {
  const type = await ChartIQWrapperModule.getChartAggregationType();

  return (type as string) ?? null;
}

/**
 * Get chart compare symbols
 * @returns {Promise<string[]>} compareSymbols
 * @example
 * ChartIQ.getCompareSymbols()
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
 * @returns void
 * @example
 * ChartIQ.removeSeries("AAPL")
 */
export function removeSeries(symbol: string) {
  ChartIQWrapperModule.removeSeries(symbol);
}

/**
 * Set chart aggregation type
 * @param {string} type
 * @returns {void}
 * @example
 * ChartIQ.setAggregationType(ChartAggregationType.Kagi)
 */
export function setAggregationType(type: string): void {
  ChartIQWrapperModule.setAggregationType(type);
}

/**
 * Enable drawing
 * @param {string} tool
 * @returns void
 * @example
 * ChartIQ.enableDrawing(DrawingTool.ANNOTATION)
 */
export function enableDrawing(tool: string) {
  ChartIQWrapperModule.enableDrawing(tool);
}

/**
 * Disable drawing
 * @returns {void}
 * @example
 * ChartIQ.disableDrawing()
 */
export function disableDrawing(): void {
  return ChartIQWrapperModule.disableDrawing();
}

/**
 * Get drawing parameters
 * @param {DrawingTool | string} tool
 * @returns {Promise<DrawingSettings>} drawingParams
 * @example
 * ChartIQ.getDrawingParams(DrawingTool.ANNOTATION)
 */
export async function getDrawingParams(
  tool: DrawingTool | string
): Promise<DrawingSettings> {
  const response = await ChartIQWrapperModule.getDrawingParams(tool);
  if (Platform.OS === 'ios') {
    return response;
  }
  return JSON.parse(response);
}

/**
 * Set drawing parameters
 * @param {DrawingParams | string} parameterName
 * @param {string} value
 * @returns {void}
 * @example
 * ChartIQ.setDrawingParams(DrawingParams.LINE_COLOR, "#ff0000")
 */
export function setDrawingParams(
  parameterName: DrawingParams,
  value: string
): void {
  ChartIQWrapperModule.setDrawingParams(parameterName, value);
}

/**
 * Clears drawing
 * @returns void
 * @example
 * ChartIQ.clearDrawing()
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
 * @returns {Promise<boolean>}
 * @example
 * ChartIQ.undoDrawing()
 */
export async function undoDrawing(): Promise<boolean> {
  return ChartIQWrapperModule.undoDrawing();
}

/**
 * Redo drawing
 * @returns {Promise<boolean>}
 * @example
 * ChartIQ.redoDrawing()
 */
export async function redoDrawing(): Promise<boolean> {
  return ChartIQWrapperModule.redoDrawing();
}

/**
 * Get study list
 * @returns {Promise<Study[]>} studyList
 * @example
 * ChartIQ.getStudyList()
 */
export async function getStudyList(): Promise<Study[]> {
  return (await ChartIQWrapperModule.getStudyList()) as Array<Study>;
}

/**
 * Get extended hours
 * @returns {Promise<boolean>} extendedHours
 * @example
 * ChartIQ.getExtendedHours()
 */
export async function getExtendedHours(): Promise<boolean> {
  return await ChartIQWrapperModule.getExtendedHours();
}

/**
 * Set extended hours
 * @param {boolean} value
 * @returns {void}
 * @example
 * ChartIQ.setExtendedHours(true)
 */
export function setExtendedHours(value: boolean): void {
  return ChartIQWrapperModule.setExtendedHours(value);
}

/**
 * Set chart theme
 * @param {'day' | 'night' | 'none'} theme
 * @returns {void}
 * @example
 * ChartIQ.setTheme('day')
 */
export function setTheme(theme: 'day' | 'night' | 'none'): void {
  return ChartIQWrapperModule.setTheme(theme);
}

/**
 * Get chart theme
 * @param {'log' | 'linear'} scale
 * @returns {void}
 * @example
 * ChartIQ.setChartScale('log')
 */
export function setChartScale(scale: 'log' | 'linear'): void {
  return ChartIQWrapperModule.setChartScale(scale);
}

/**
 * Get chart scale
 * @returns {Promise<string>} scale
 * @example
 * ChartIQ.getChartScale()
 */
export async function getChartScale(): Promise<string> {
  return await ChartIQWrapperModule.getChartScale();
}

/**
 * Get is inverting y axis
 * @returns {Promise<boolean>} isInvertingYAxis
 * @example
 * ChartIQ.getIsInvertYAxis()
 */
export async function getIsInvertYAxis(): Promise<boolean> {
  return await ChartIQWrapperModule.getIsInvertYAxis();
}

/**
 * Set is inverting y axis
 * @param {boolean} value
 * @returns {void}
 * @example
 * ChartIQ.setIsInvertYAxis(true)
 */
export function setIsInvertYAxis(value: boolean): void {
  return ChartIQWrapperModule.setIsInvertYAxis(value);
}

/**
 * Get active studies
 * @returns {Promise<Study[]>} activeStudies
 * @example
 * ChartIQ.getActiveStudies()
 */
export async function getActiveStudies(): Promise<Study[]> {
  return (await ChartIQWrapperModule.getActiveStudies()) as Study[];
}

/**
 * Add study
 * @param {Study} study
 * @param {boolean} isClone
 * @returns {Promise<Study>} study
 * @example
 * ChartIQ.addStudy(study)
 */
export function addStudy(
  study: Study,
  isClone: boolean = false
): Promise<Study> {
  return ChartIQWrapperModule.addStudy(study, isClone);
}

/**
 * Get study parameters
 * @param {Study} study
 * @param {StudyParameterType} type
 * @returns {Promise<StudyParameter[]>} studyParameters
 */
export async function getStudyParameters(
  study: Study,
  type: StudyParameterType
): Promise<StudyParameter[]> {
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

/**
 * Remove study
 * @param {Study} study
 * @returns {Promise<void>}
 * @example
 * ChartIQ.removeStudy(study)
 */
export function removeStudy(study: Study): Promise<void> {
  return ChartIQWrapperModule.removeStudy(study);
}

/**
 * Set study parameter
 * @param {Study} study
 * @param {ChartIQStudyParameterModel} parameter
 * @returns {Promise<Study>}
 * @example
 * ChartIQ.setStudyParameters(study, parameters)
 */
export async function setStudyParameter(
  study: Study,
  parameter: ChartIQStudyParameterModel
): Promise<Study> {
  return await ChartIQWrapperModule.setStudyParameter(study, parameter);
}

/**
 * Set study parameters
 * @param {Study} study
 * @param {ChartIQStudyParameterModel[]} parameter
 * @returns {Promise<StudySimplified>} study
 * @example
 * ChartIQ.setStudyParameters(study, parameters)
 */
export async function setStudyParameters(
  study: Study,
  parameter: ChartIQStudyParameterModel[]
): Promise<StudySimplified> {
  return (await ChartIQWrapperModule.setStudyParameters(
    study,
    parameter
  )) as StudySimplified;
}

/**
 * Get active signals
 * @returns {Promise<Signal[]>} signals
 * @example
 * ChartIQ.getActiveSignals()
 */
export async function getActiveSignals(): Promise<Signal[]> {
  const response = await ChartIQWrapperModule.getActiveSignals();
  if (Platform.OS === 'ios') {
    return response;
  }
  return JSON.parse(response) as Signal[];
}

/**
 * Add signal study by study shortName
 * @param name string
 * @returns {Promise<Study>} study
 * @example
 * ChartIQ.addSignalStudy("ADX")
 */
export async function addSignalStudy(name: string): Promise<Study> {
  const response = await ChartIQWrapperModule.addSignalStudy(name);
  if (Platform.OS === 'ios') {
    return response as Study;
  }
  return JSON.parse(response) as Study;
}

/**
 * Add signal
 * @param {Signal} signal
 * @param {boolean} editMode
 * @returns {void}
 * @example
 * ChartIQ.addSignal(signal)
 */
export function addSignal(signal: Signal, editMode: boolean = false): void {
  ChartIQWrapperModule.addSignal(signal, editMode);
}

/**
 * Toggle signal
 * @param {Signal} signal
 * @returns {void}
 * @example
 * ChartIQ.toggleSignal(signal)
 */
export function toggleSignal(signal: Signal): void {
  ChartIQWrapperModule.toggleSignal(signal);
}

/**
 * Remove signal
 * @param {Signal} signal
 * @returns {void}
 * @example
 * ChartIQ.removeSignal(signal)
 */
export function removeSignal(signal: Signal): void {
  return ChartIQWrapperModule.removeSignal(signal);
}

/**
 * Get translations map by language code
 * @param {string} languageCode
 * @returns {Promise<Record<string, string>>} translations
 * @example
 * ChartIQ.getTranslations("en-US")
 */
export async function getTranslations(
  languageCode: string
): Promise<Record<string, string>> {
  const response = await ChartIQWrapperModule.getTranslations(languageCode);

  if (Platform.OS === 'ios') {
    return response;
  }
  return JSON.parse(response);
}

/**
 * Set language
 * @param {string} languageCode
 * @returns {void}
 * @example
 * ChartIQ.setLanguage("en-US")
 */
export function setLanguage(languageCode: string): void {
  return ChartIQWrapperModule.setLanguage(languageCode);
}
