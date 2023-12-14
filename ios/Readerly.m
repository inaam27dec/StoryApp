//
//  Readerly.m
//  Readerly
//
//  Created by Ahmad Rafiq on 8/29/22.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface
RCT_EXTERN_MODULE(Readerly, NSObject)
RCT_EXTERN_METHOD(openStoryReadingVC: (NSString*)jsonContent )
RCT_EXTERN_METHOD(getBookmarkStatus: (Bool)isBookmarked)
//RCT_EXPORT_METHOD(callbackMethod:(RCTResponseSenderBlock)callback){
////Do native operation
//  NSDictionary *resultsDict = [NSDictionary dictionaryWithObjectsAndKeys: @"count",@"20", nil];
//  callback(@[[NSNull null] ,resultsDict ]);
//}
RCT_EXTERN_METHOD(callbackMethod:(RCTResponseSenderBlock)callback)
//RCT_EXTERN_METHOD(storyEnds: (RCTPromiseResolveBlock)resolve (RCTPromiseRejectBlock)reject )
@end
