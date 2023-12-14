//
//  Common.swift
//  TextToSpeech-AVSpeechSynthesizer
//
//  Created by Ahmad Rafiq on 8/26/22.
//  Copyright © 2022 huzaifa. All rights reserved.
//

import UIKit
import AVFoundation

class Common {
  static let shared = Common()
  
  func getDataModelFromJSON(jsonStr: String) -> [DataModel] {
    let list = getJsonModel(jsonStr: jsonStr)
    
    var dataModelList = [DataModel]()
    list.forEach { model in
      var femaleAudioList = [AVURLAsset?]()
      var maleAudioList = [AVURLAsset?]()
      model.sentences?.female?.forEach({ mp3Str in
        femaleAudioList.append(nil)
      })
      model.sentences?.male?.forEach({ mp3Str in
        maleAudioList.append(nil)
      })
      let dataModel = DataModel(type: model.type, data: model.data, sentences: model.sentences, femaleAudioList: femaleAudioList, maleAudioList: maleAudioList)
      dataModelList.append(dataModel)
    }
    
    return dataModelList
  }
  
  func getJsonModel(jsonStr: String)  -> [JsonModel] {
    //      if let url = Bundle.main.url(forResource: "storySample", withExtension: "json") {
    do {
      let data = Data(jsonStr.utf8)
      let scheduleData = try JSONDecoder().decode(JsonModelList.self, from: data)
      print(scheduleData)
      return scheduleData.data
    } catch {
      print("error:\(error)")
      return []
    }
    //      }
  }
  
  func getLabel(text:String, font:UIFont) -> UILabel {
    let label:UILabel = UILabel()
    label.numberOfLines = 0
    label.lineBreakMode = NSLineBreakMode.byWordWrapping
    label.font = font
    label.text = text
    
    label.sizeToFit()
    return label
  }
  
  func getImageView(url:String) -> UIImageView {
    let imgView:UIImageView = UIImageView()
    imgView.contentMode = .scaleAspectFill
    imgView.clipsToBounds = true
    imgView.layer.borderColor = UIColor.black.cgColor
    imgView.layer.borderWidth = 1.0
    imgView.heightAnchor.constraint(equalToConstant: 250).isActive = true
    if let url = URL(string: url){
      imgView.sd_setImageWithURLWithFade(url: url, placeholderImage:Icons.RECTANGLE_PLACEHOLDER)
    } else {
      imgView.image = Icons.RECTANGLE_PLACEHOLDER
    }
    
    return imgView
  }
}
