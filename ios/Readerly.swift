//
//  Readerly.swift
//  Readerly
//
//  Created by Ahmad Rafiq on 8/29/22.
//

import Foundation
import UIKit

@objc(Readerly)
class Readerly: NSObject {
  
  @objc
  func openStoryReadingVC(_ jsonContent: String ) {
    DispatchQueue.main.async {
      print("This is testing of native code \(jsonContent)")
      if let topVC = UIApplication.shared.visibleViewController {
        Router.shared.openStoryReadViewController(jsonStory: jsonContent, controller: topVC)
      }
    }
  }
  
  @objc
  func getBookmarkStatus(_ isBookmarked: Bool ) {
    DispatchQueue.main.async {
      print("This is testing of native code \(isBookmarked)")
      NotificationCenter.default.post(name: .updateBookmark, object: nil, userInfo: [Constants.isBookmarked: isBookmarked])
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
