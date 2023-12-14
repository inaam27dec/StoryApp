//
//  VoiceSettingPopupVC.swift
//  Readerly
//
//  Created by Ahmad Rafiq on 10/4/22.
//

import UIKit

protocol VoiceSettingPopupVCDelegate: AnyObject {
    func getSelectedVoiceSetting(isGrandpa: Bool, isGrandma: Bool)
}

class VoiceSettingPopupVC: UIViewController {
    
    @IBOutlet weak var bgView: UIView!
    @IBOutlet weak var mainView: UIView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var grandpaSwitch: UISwitch!
    @IBOutlet weak var grandmaSwitch: UISwitch!
    
    weak var delegate : VoiceSettingPopupVCDelegate?
    
    var isGrandpa = false
    var isGrandma = false
    
    //MARK: - View life cycle
    override func viewDidLoad() {
        super.viewDidLoad()
        configureView()
    }
    
    func configureView() -> Void {
        grandpaSwitch.setOn(isGrandpa, animated: true)
        grandmaSwitch.setOn(isGrandma, animated: true)

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
    @IBAction func grandpaSwitchValueWasChanged(_ sender: UISwitch) {
        isGrandpa = sender.isOn
        isGrandma = !isGrandpa
        configureView()
    }
    
    @IBAction func grandmaSwitchValueWasChanged(_ sender: UISwitch) {
        isGrandma = sender.isOn
        isGrandpa = !isGrandma
        configureView()
    }
    
    @IBAction func viewWasTapped(_ sender: UITapGestureRecognizer) {
        dismiss(animated: true, completion: nil)
    }
    
    @IBAction func closeButtonWasPressed(_ sender: Any) {
        dismiss(animated: true, completion: {
            self.delegate?.getSelectedVoiceSetting(isGrandpa: self.isGrandpa, isGrandma: self.isGrandma)
        })
    }
    
}
