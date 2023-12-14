//
//  Router.swift
//  TextToSpeech-AVSpeechSynthesizer
//
//  Created by Ahmad Rafiq on 8/26/22.
//  Copyright © 2022 huzaifa. All rights reserved.
//

import Foundation
import UIKit

class Router {
  static let shared = Router()
  
//  func openStoryReadViewController1(controller: UIViewController) {
//    let control = Storyboards.MAIN.instantiateViewController(withIdentifier: StoryReadViewController.className) as! StoryReadViewController
//    controller.present(control, animated: false, completion: nil)
//  }
  
  func openStoryReadViewController(jsonStory: String, controller:UIViewController) -> Void {
    let control = Storyboards.MAIN.instantiateViewController(withIdentifier: StoryReadViewController.className) as! StoryReadViewController
    control.jsonStory = jsonStory
    controller.present(getNavigationController(controller: control), animated: true, completion: nil)
  }
  
  func openSettingPopupVC(title: String, selectedValue: Bool, controller:UIViewController) -> Void {
    let control = Storyboards.POPUPS.instantiateViewController(withIdentifier: SettingPopupVC.className) as! SettingPopupVC
    control.delegate = controller.self as? SettingPopupVCDelegate
    control.headingTitle = title
    control.selectedValue = selectedValue
    controller.present(getNavigationController(controller: control), animated: true, completion: nil)
  }
  
  func openVoiceSettingPopupVC(isGrandpa:Bool, isGrandma: Bool, controller:UIViewController) -> Void {
    let control = Storyboards.POPUPS.instantiateViewController(withIdentifier: VoiceSettingPopupVC.className) as! VoiceSettingPopupVC
    control.delegate = controller.self as? VoiceSettingPopupVCDelegate
    control.isGrandpa = isGrandpa
    control.isGrandma = isGrandma
    controller.present(getNavigationController(controller: control), animated: true, completion: nil)
  }
  
  func getNavigationController(controller:UIViewController) -> UINavigationController {
    let navigationController = UINavigationController(rootViewController: controller)
    navigationController.navigationBar.shadowImage = UIImage()
    navigationController.navigationBar.isHidden = true
    navigationController.navigationBar.backgroundColor = UIColor.clear
    navigationController.modalPresentationStyle = .overFullScreen
    return navigationController
  }
}
