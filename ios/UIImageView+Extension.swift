//
//  UIImageView+Extension.swift
//  TextToSpeech-AVSpeechSynthesizer
//
//  Created by Ahmad Rafiq on 8/26/22.
//  Copyright © 2022 huzaifa. All rights reserved.
//

import UIKit
import SDWebImage

extension UIImageView {
    public func sd_setImageWithURLWithFade(url: URL!, placeholderImage placeholder: UIImage!)
    {
        self.sd_setImage(with: url, placeholderImage: placeholder,options: SDWebImageOptions(rawValue: 0)) { (image, error, cacheType, url) -> Void in
            
            if let downLoadedImage = image
            {
                if cacheType == .none
                {
                    self.alpha = 0
                    UIView.transition(with: self, duration: 0.4, options: UIView.AnimationOptions.transitionCrossDissolve, animations: { () -> Void in
                        self.image = downLoadedImage
                        self.alpha = 1
                    }, completion: nil)
                }
            }
            else
            {
                self.image = placeholder
            }
        }
    }
}
