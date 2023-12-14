//
//  DataModel.swift
//  TextToSpeech-AVSpeechSynthesizer
//
//  Created by Ahmad Rafiq on 8/26/22.
//  Copyright © 2022 huzaifa. All rights reserved.
//

import Foundation
import AVFoundation

// MARK: - DataModel
struct JsonModelList : Codable {
    let data: [JsonModel]
}

// MARK: - Datum
struct JsonModel : Codable {
    let type: String
    let data: String
    let sentences: SentenceModel?
    
    enum CodingKeys: String, CodingKey {
        case type = "type"
        case data = "data"
        case sentences = "sentences"
    }
}

struct SentenceModel: Codable {
    let female, male: [String]?
}

enum TypeEnum: String, Codable {
    case image = "image"
    case text = "text"
}








struct DataModel {
  let type: String
  let data: String
  let sentences: SentenceModel?
  var femaleAudioList: [AVURLAsset?]?
  var maleAudioList: [AVURLAsset?]?
  
  enum CodingKeys: String, CodingKey {
    case type = "type"
    case data = "data"
    case sentences = "sentences"
    case femaleAudioList = "femaleAudioList"
    case maleAudioList = "maleAudioList"
  }
}

// MARK: - Address
struct AddressModel: Codable {
    let permanentAddress, currentAddress: String

    enum CodingKeys: String, CodingKey {
        case permanentAddress = "Permanent address"
        case currentAddress = "current Address"
    }
}

struct AudioModelList {
    let index: Int
    let audioList: [AVURLAsset]
}
