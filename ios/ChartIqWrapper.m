#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(ChartIqWrapperViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(url, NSString)
RCT_EXPORT_VIEW_PROPERTY(dataMethod, NSString)
RCT_EXPORT_VIEW_PROPERTY(onPullInitialData, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPullUpdateData, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPullPagingData, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStart, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMeasureChanged, RCTDirectEventBlock)

RCT_EXTERN_METHOD(setSymbol:(NSString *)symbol)
RCT_EXTERN_METHOD(setInitialData:(NSArray *)data id:(NSString *)id)
RCT_EXTERN_METHOD(setUpdateData:(NSArray *)data id:(NSString *)id)
RCT_EXTERN_METHOD(setPagingData:(NSArray *)data id:(NSString *)id)
RCT_EXTERN_METHOD(setPeriodicity:(double)period interval:(NSString *)interval timeUnit:(NSString *)timeUnit)
RCT_EXTERN_METHOD(setChartStyle:(NSString *)obj attr:(NSString *)attr value:(NSString *)value)
RCT_EXTERN_METHOD(setChartType:(NSString *)type)
RCT_EXTERN_METHOD(getSymbol:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getChartType:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getPeriodicity:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end 