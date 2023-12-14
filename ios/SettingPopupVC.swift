//
//  SettingPopupVC.swift
//  Readerly
//
//  Created by Ahmad Rafiq on 9/27/22.
//

import UIKit

protocol SettingPopupVCDelegate: AnyObject {
  func getHighlightedSetting(value: Bool)
}

class SettingPopupVC: UIViewController {
  
  @IBOutlet weak var bgView: UIView!
  @IBOutlet weak var mainView: UIView!
  @IBOutlet weak var titleLabel: UILabel!
  @IBOutlet weak var toggleSwitch: UISwitch!
  
  weak var delegate : SettingPopupVCDelegate?
  
  var headingTitle = ""
  var selectedValue = false
  
  //MARK: - View life cycle
  override func viewDidLoad() {
    super.viewDidLoad()
    configureView()
  }
  
  func configureView() -> Void {
    titleLabel.text = headingTitle
    toggleSwitch.setOn(selectedValue, animated: true)
    
    mainView.roundWithCorners(corners: [.layerMinXMinYCorner,.layerMaxXMinYCorner], radius: 10)

  }
  
  override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    UIView.animate(withDuration: 0.5, delay: 0.0, options: UIView.AnimationOptions.curveEaseIn, animations: {
      self.bgView.backgroundColor = Colors.BLACK.withAlphaComponent(0.7)
      
    }, completion: nil)
  }
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    navigationController?.navigationBar.isHidden = true
    UIView.animate(withDuration: 0.5, delay: 0.0, options: UIView.AnimationOptions.curveEaseIn, animations: {
      self.bgView.backgroundColor = Colors.BLACK.withAlphaComponent(0.7)
      
    }, completion: nil)
  }
  
  override func viewWillDisappear(_ animated: Bool) {
    UIView.animate(withDuration: 0.1, delay: 0.0, options: UIView.AnimationOptions.transitionCrossDissolve, animations: {
      self.bgView.backgroundColor = Colors.BLACK.withAlphaComponent(0.0)
    }, completion: nil)
  }
  
  //MARK: - IBActions
  @IBAction func switchValueWasChanged(_ sender: UISwitch) {
    selectedValue = sender.isOn
  }
  
  @IBAction func viewWasTapped(_ sender: UITapGestureRecognizer) {
    dismiss(animated: true, completion: nil)
  }
  
  @IBAction func closeButtonWasPressed(_ sender: Any) {
    dismiss(animated: true, completion: {
      self.delegate?.getHighlightedSetting(value: self.selectedValue)
    })
  }
  
}
