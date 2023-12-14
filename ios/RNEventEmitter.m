//
//  RNEventEmitter.m
//  Readerly
//
//  Created by Monisa Hassan on 8/31/22.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(RNEventEmitter, RCTEventEmitter)
  RCT_EXTERN_METHOD(supportedEvents)
@end
