import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DrawingSettings, DrawingTool } from '~/model';
import { Study } from '~/model/study';

export enum RootStack {
  Main = '[Root stack] Main',
  Studies = '[Root stack] Studies',
  Settings = '[Root stack] Settings',
  Drawings = '[Root stack] Drawings',
}

export type RootStackParamList = {
  [RootStack.Main]: undefined;
  [RootStack.Drawings]: undefined;
  [RootStack.Settings]: undefined;
  [RootStack.Studies]: undefined;
};

export enum DrawingsStack {
  DrawingToolsSettings = '[Root stack] DrawingToolsSettings',
  DrawingToolsFontFamily = '[Root stack] DrawingToolsFontFamily',
  DrawingToolsFontSizes = '[Root stack] DrawingToolsFontSizes',
  DrawingToolsFibonacci = '[Root stack] DrawingToolsFibonacci',
  DrawingToolsSTDDeviation = '[Root stack] DrawingToolsSTDDeviation',
  DrawingToolsImpulse = '[Root stack] DrawingToolsImpulse',
  DrawingToolCorrective = '[Root stack] DrawingToolCorrective',
  DrawingToolDecoration = '[Root stack] DrawingToolDecoration',
}

export type DrawingsStackParamList = {
  [DrawingsStack.DrawingToolsSettings]: {
    title: string;
    settings: DrawingSettings;
    name: DrawingTool;
  };
  [DrawingsStack.DrawingToolsFontFamily]: undefined;
  [DrawingsStack.DrawingToolsFontSizes]: undefined;
  [DrawingsStack.DrawingToolsFibonacci]: undefined;
  [DrawingsStack.DrawingToolsSTDDeviation]: undefined;
  [DrawingsStack.DrawingToolsImpulse]: undefined;
  [DrawingsStack.DrawingToolCorrective]: undefined;
  [DrawingsStack.DrawingToolDecoration]: undefined;
};

export enum SettingsStack {
  Settings = '[Settings stack] Settings',
  Languages = '[Settings stack] Languages',
}

export type SettingsStackParamList = {
  [SettingsStack.Settings]: undefined;
  [SettingsStack.Languages]: undefined;
};

export enum StudiesStack {
  Studies = '[Studies stack] Studies',
  AddStudy = '[Studies stack] AddStudy',
  StudyParameters = '[Studies stack] StudyParameters',
}

export type StudiesStackParamList = {
  [StudiesStack.Studies]: undefined;
  [StudiesStack.AddStudy]: undefined;
  [StudiesStack.StudyParameters]: { study: Study };
};

export type DrawingToolsNavigation = NativeStackNavigationProp<
  DrawingsStackParamList,
  DrawingsStack.DrawingToolsSettings
>;

export type SettingsNavigation = NativeStackNavigationProp<RootStackParamList, RootStack.Settings>;

export type DrawingToolsSettings = NativeStackNavigationProp<
  DrawingsStackParamList,
  | DrawingsStack.DrawingToolsFontFamily
  | DrawingsStack.DrawingToolsFontSizes
  | DrawingsStack.DrawingToolsFibonacci
  | DrawingsStack.DrawingToolsSTDDeviation
  | DrawingsStack.DrawingToolsImpulse
  | DrawingsStack.DrawingToolCorrective
  | DrawingsStack.DrawingToolDecoration
>;

export type DrawingToolsRoute = RouteProp<
  DrawingsStackParamList,
  DrawingsStack.DrawingToolsSettings
>;
