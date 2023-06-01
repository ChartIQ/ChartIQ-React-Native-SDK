#import <React/RCTViewManager.h>
#import "RCTEventDispatcher.h"

@interface RCT_EXTERN_MODULE(ChartIqWrapperViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(url, NSString)

RCT_EXTERN_METHOD(setInitialData: (NSString *))
RCT_EXTERN_METHOD(setUpdateData: (NSString *))
RCT_EXTERN_METHOD(setPagingData: (NSString *))


@end

