//
//  UIScrollView+Extension.swift
//  TextToSpeech-AVSpeechSynthesizer
//
//  Created by Ahmad on 28/08/2022.
//  Copyright © 2022 huzaifa. All rights reserved.
//

import UIKit

extension UIScrollView {
    
    func scrollToView(view:UIView, animated: Bool) {
        if let origin = view.superview {
            // Get the Y position of your child view
            let childStartPoint = origin.convert(view.frame.origin, to: self)
            // Scroll to a rectangle starting at the Y of your subview, with a height of the scrollview
            self.scrollRectToVisible(CGRect(x:0, y:childStartPoint.y,width: 1,height: self.frame.height), animated: animated)
        }
    }
}
