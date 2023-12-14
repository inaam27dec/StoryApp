//
//  RNEventEmitter.swift
//  Readerly
//
//  Created by Monisa Hassan on 8/31/22.
//

import Foundation
@objc(RNEventEmitter)
open class RNEventEmitter: RCTEventEmitter {

  public static var emitter: RCTEventEmitter!

  override init() {
    super.init()
    RNEventEmitter.emitter = self
  }

  open override func supportedEvents() -> [String] {
    ["onCPress","onBPress","onSPress", "onCBackPress","onBBackPress","onSBackPress"]
  }
}
