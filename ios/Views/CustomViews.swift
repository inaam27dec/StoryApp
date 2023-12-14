//
//  CustomViews.swift
//  TextToSpeech-AVSpeechSynthesizer
//
//  Created by Ahmad on 28/08/2022.
//  Copyright © 2022 huzaifa. All rights reserved.
//

import UIKit

class CircularButton: UIButton {
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    setupView()
  }
  
  required init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
    setupView()
  }
  
  private func setupView() -> Void {
    
    layer.cornerRadius = frame.height/2
    layer.masksToBounds = true
    clipsToBounds = true
  }
}


class PurpleRoundedButton: UIButton {
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    setupView()
  }
  
  required init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
    setupView()
  }
  
  private func setupView() -> Void {
    
    layer.cornerRadius = 8
    layer.masksToBounds = true
    clipsToBounds = true
    backgroundColor = Colors.Purple
    setTitleColor(.white, for: .normal)
  }
}
