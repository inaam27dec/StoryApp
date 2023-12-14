//
//  UIView+Extension.swift
//  Readerly
//
//  Created by Ahmad Rafiq on 9/27/22.
//

import UIKit

extension UIView {
  func roundWithCorners(corners:CACornerMask, radius: CGFloat) {
      if #available(iOS 11.0, *) {
          self.layer.cornerRadius = radius
          self.layer.maskedCorners = corners
      } else {
          print("not able to round specific corner")
      }
  }
  
  func showToast(message : String, font: UIFont = .systemFont(ofSize: 12.0)) {
      let toastLabel = UILabel(frame: CGRect(x: 10, y: self.frame.size.height/2, width: self.frame.width - 20, height: 35))
      toastLabel.backgroundColor = UIColor.black.withAlphaComponent(0.8)
      toastLabel.textColor = UIColor.white
      toastLabel.font = font
      toastLabel.textAlignment = .center;
      toastLabel.text = message
      toastLabel.alpha = 1.0
      toastLabel.layer.cornerRadius = 10;
      toastLabel.clipsToBounds  =  true
      self.addSubview(toastLabel)
      UIView.animate(withDuration: 1, delay: 1.0, options: .curveEaseOut, animations: {
           toastLabel.alpha = 0.0
      }, completion: {(isCompleted) in
          toastLabel.removeFromSuperview()
      })
  }
}
