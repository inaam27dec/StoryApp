//
//  UIViewController+Extension.swift
//  Readerly
//
//  Created by Ahmad Rafiq on 8/29/22.
//

import UIKit
import MBProgressHUD

extension UIViewController {
  var topMostViewController: UIViewController {
      switch self {
      case is UINavigationController:
          return (self as! UINavigationController).visibleViewController?.topMostViewController ?? self
      case is UITabBarController:
          return (self as! UITabBarController).selectedViewController?.topMostViewController ?? self
      default:
          return presentedViewController?.topMostViewController ?? self
      }
  }
  
  func showProgressHud(title:String = "Loading Story...") -> Void {
      let progressHud = MBProgressHUD.showAdded(to: view, animated: true)
      progressHud.label.text = title
  }

  func hideProgressHud() -> Void {
      DispatchQueue.main.async {
          MBProgressHUD.hide(for: self.view , animated: true)
      }
  }
}
