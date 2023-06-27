#import <React/RCTViewManager.h>
#import "RCTEventDispatcher.h"

@interface RCT_EXTERN_MODULE(ChartIqWrapperViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(url, NSString)

RCT_EXTERN_METHOD(setInitialData: (NSArray *)data)
RCT_EXTERN_METHOD(setUpdateData: (NSArray *)data)
RCT_EXTERN_METHOD(setPagingData: (NSArray *)data)

RCT_EXTERN_METHOD(setSymbol: (NSString *)symbol)
RCT_EXTERN_METHOD(setPeriodicity: (double)period interval: (NSString *)interval timeUnit: (NSString*)timeUnit)
RCT_EXTERN_METHOD(setChartStyle: (NSString *)obj (NSString *)attr (NSString *)value)
RCT_EXTERN_METHOD(setChartType: (NSString *)type)
RCT_EXTERN_METHOD(setAggregationType: (NSString *)type)

RCT_EXTERN_METHOD(getSymbol: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getChartType: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getPeriodicity: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getChartAggregationType: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getActiveSeries: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(addSeries: (NSString *)symbol color: (NSString *)color isComparison: (BOOL)isComparison)

RCT_EXTERN_METHOD(removeSeries: (NSString *)symbol)
RCT_EXTERN_METHOD(enableDrawing: (NSString *)tool)
RCT_EXTERN_METHOD(disableDrawing)
RCT_EXTERN_METHOD(getDrawingParams: (NSString *)tool resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setDrawingParams: (NSString *)parameterName value: (NSString *)value)
RCT_EXTERN_METHOD(clearDrawing)
RCT_EXTERN_METHOD(restoreDefaultDrawingConfig: (NSString *)tool (BOOL *)all)
RCT_EXTERN_METHOD(undoDrawing: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(redoDrawing: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getStudyList: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getExtendedHours: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setExtendedHours: (BOOL *)value)
RCT_EXTERN_METHOD(setTheme: (NSString *)theme)
RCT_EXTERN_METHOD(setChartScale: (NSString *)scale)
RCT_EXTERN_METHOD(getChartScale: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getIsInvertYAxis: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setIsInvertYAxis: (BOOL *)value)
RCT_EXTERN_METHOD(getActiveStudies: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(enableCrosshairs)
RCT_EXTERN_METHOD(disableCrosshairs)

RCT_EXTERN_METHOD(addStudy: (NSString *)study isClone:(BOOL)isClone)
RCT_EXTERN_METHOD(removeStudy: (NSString *)study)
RCT_EXTERN_METHOD(getStudyParameters: (NSString *)study studyParameterType: (NSString *)studyParameterType resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setStudyParameter: (NSString *)study parameter:(NSString *)parameter)
RCT_EXTERN_METHOD(setStudyParameters: (NSString *)study parameters:(NSString *)parameters resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setLanguage: (NSString *)languageCode)
RCT_EXTERN_METHOD(getTranslations: (NSString *)languageCode resolver:(RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getActiveSignals: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(addSignalStudy: (NSString *)studyName resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(addSignal: (NSString *)signal editMode:(BOOL)editMode resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(toggleSignal: (NSString *)signal)
RCT_EXTERN_METHOD(removeSignal: (NSString *)signal)

@end

