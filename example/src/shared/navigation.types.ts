import { DrawingSettings } from '@chart-iq/chart-iq-sdk/src/model/drawingtool/drawing-settings';
import { DrawingTool } from '@chart-iq/chart-iq-sdk/src/model/drawingtool/drawingtools';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export enum RootStack {
  Main = '[Root stack] Main',
  DrawingToolsSettings = '[Root stack] DrawingToolsSettings',
  DrawingToolsFontFamily = '[Root stack] DrawingToolsFontFamily',
  DrawingToolsFontSizes = '[Root stack] DrawingToolsFontSizes',
  DrawingToolsFibonacci = '[Root stack] DrawingToolsFibonacci',
  DrawingToolsSTDDeviation = '[Root stack] DrawingToolsSTDDeviation',
  DrawingToolsImpulse = '[Root stack] DrawingToolsImpulse',
  DrawingToolCorrective = '[Root stack] DrawingToolCorrective',
  DrawingToolDecoration = '[Root stack] DrawingToolDecoration',
}

export type RootStackParamList = {
  [RootStack.Main]: undefined;
  [RootStack.DrawingToolsSettings]: { title: string; settings: DrawingSettings; name: DrawingTool };
  [RootStack.DrawingToolsFontFamily]: undefined;
  [RootStack.DrawingToolsFontSizes]: undefined;
  [RootStack.DrawingToolsFibonacci]: undefined;
  [RootStack.DrawingToolsSTDDeviation]: undefined;
  [RootStack.DrawingToolsImpulse]: undefined;
  [RootStack.DrawingToolCorrective]: undefined;
  [RootStack.DrawingToolDecoration]: undefined;
};

export type DrawingToolsNavigation = NativeStackNavigationProp<
  RootStackParamList,
  RootStack.DrawingToolsSettings
>;

export type DrawingToolsSettings = NativeStackNavigationProp<
  RootStackParamList,
  | RootStack.DrawingToolsFontFamily
  | RootStack.DrawingToolsFontSizes
  | RootStack.DrawingToolsFibonacci
  | RootStack.DrawingToolsSTDDeviation
  | RootStack.DrawingToolsImpulse
  | RootStack.DrawingToolCorrective
  | RootStack.DrawingToolDecoration
>;

export type DrawingToolsRoute = RouteProp<RootStackParamList, RootStack.DrawingToolsSettings>;
