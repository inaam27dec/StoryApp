//
//  UIApplication+Extension.swift
//  Readerly
//
//  Created by Ahmad Rafiq on 8/29/22.
//

import UIKit

extension UIApplication {
  
  var visibleViewController : UIViewController? {
//      return windows.first?.rootViewController?.topMostViewController
    return UIApplication.shared.keyWindow?.rootViewController
  }
  
//  class func getTopViewController(base: UIViewController? = UIApplication.shared.windows.first?.rootViewController) -> UIViewController? {
//
//      if let nav = base as? UINavigationController {
//          return getTopViewController(base: nav.visibleViewController)
//          
//      } else if let tab = base as? UITabBarController, let selected = tab.selectedViewController {
//          return getTopViewController(base: selected)
//
//      } else if let presented = base?.presentedViewController {
//          return getTopViewController(base: presented)
//      }
//      return base
//  }
}
