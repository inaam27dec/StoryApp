//
//  StoryReadViewController.swift
//  TextToSpeech-AVSpeechSynthesizer
//
//  Created by Ahmad Rafiq on 8/26/22.
//  Copyright © 2022 huzaifa. All rights reserved.
//

import UIKit
import AVFoundation

class StoryReadViewController: UIViewController {
  
  @IBOutlet weak var titleLbl: UILabel!
  @IBOutlet weak var bookmarkBtn: UIButton!
  @IBOutlet weak var scrollView: UIScrollView!
  @IBOutlet weak var mainStackView: UIStackView!
  @IBOutlet weak var bottomStackView: UIStackView!
  @IBOutlet weak var playPauseButton: CircularButton!
  @IBOutlet weak var sliderView: UISlider!
  
  private var array = [DataModel]()
  private var currentArrayIndex = 0
  private var currentLine = 0
  private var isBackwardPressed = false
  private var isPlaying =  false
  private var screen = "C"
  
  private var player: AVPlayer?
  private var audioList = [AudioModelList]()
  
  var jsonStory: String = ""
  private var jsonContent = ""
  private var storyTitle: String = "Story Reading"
  private var isOriginalValueBookmarked = false
  private var isBookmarked = false
  private var isHighlighted = false
  private var isMaleVoice = false
  
  //MARK: - View life cycle
  override func viewDidLoad() {
    super.viewDidLoad()
    
    NotificationCenter.default.addObserver(self, selector: #selector(updateBookmark(notification:)), name: .updateBookmark, object: nil)
    parseData()
    titleLbl.text = storyTitle
    array = Common.shared.getDataModelFromJSON(jsonStr: jsonContent)
    addSubviews()
    downloadAudioLogic()
    setupBookmarkButton()
  }
  
  //MARK:- Setup Subviews
  private func addSubviews() {
    for (index, item) in array.enumerated() {
      if item.type == DataType.text.rawValue {
        let font = UIFont(name: "Helvetica", size: 17.0)!
        let lbl = Common.shared.getLabel(text: item.data, font: font)
        lbl.tag = index
        mainStackView.addArrangedSubview(lbl)
      } else if item.type == DataType.image.rawValue {
        let imgView = Common.shared.getImageView(url: item.data)
        mainStackView.addArrangedSubview(imgView)
      }
    }
  }
  
  //MARK: - Helper Methods
  private func parseData() {
    if !jsonStory.isEmpty {
      let parsedArray = jsonStory.components(separatedBy: "$$$")
      if parsedArray.count == 2 {
        
        jsonContent = parsedArray[1]
        let info = parsedArray[0]
        
        let components = info.components(separatedBy: ":")
        screen = components[0]
        storyTitle = components[1]
        isBookmarked = components[2].boolValue
        isOriginalValueBookmarked = isBookmarked
        isHighlighted = components[3].boolValue
        isMaleVoice = components[4].boolValue
      }
    }
  }
  
  @objc private func updateBookmark(notification: Notification) {
    hideProgressHud()
    if let userInfo = notification.userInfo {
      isBookmarked = userInfo[Constants.isBookmarked] as? Bool ?? false
      setupBookmarkButton()
    }
  }
  
  private func setupBookmarkButton() {
    if isBookmarked {
      if #available(iOS 13.0, *) {
        bookmarkBtn.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
      } else {
        // Fallback on earlier versions
        bookmarkBtn.setImage(UIImage(named: "bookmark"), for: .normal)
      }
    } else {
      if #available(iOS 13.0, *) {
        bookmarkBtn.setImage(UIImage(systemName: "bookmark"), for: .normal)
      } else {
        // Fallback on earlier versions
        bookmarkBtn.setImage(UIImage(named: "bookmark"), for: .normal)
      }
    }
  }
  
  private func scrollToCurrentParagraph() {
    if let lbl = mainStackView.arrangedSubviews.filter({$0.tag == currentArrayIndex}).first as? UILabel {
      self.scrollView.scrollToView(view: lbl, animated: true)
    }
  }
  
  private func ifStoryEnded() -> Bool {
    if currentArrayIndex < array.count {
      let maxLineNumber = array[currentArrayIndex].data.components(separatedBy: ".").count - 1 // here -1 means, total lines
      return ((currentArrayIndex == array.count - 1) && (currentLine == maxLineNumber - 1)) ? true : false
    } else {
      return true
    }
  }
  
  private func increaseIndexAndPlay(isImage: Bool = false, isNextParagraph: Bool = false) {
    if !ifStoryEnded() {
      let maxLineNumber = array[currentArrayIndex].data.components(separatedBy: ".").count - 1
      if isImage == false && isNextParagraph == false && currentLine < maxLineNumber - 1 {
        currentLine += 1
      } else {
        currentLine = 0
        currentArrayIndex += 1
      }
      scrollToReadingLbl()
      playButtonWasPressed(UIButton())
    }
  }
  
    private func decreaseIndexAndPlay() {
        if currentArrayIndex > 0 {
            //      currentLine = 0
            //      currentArrayIndex -= 1
            
            var isStoryEndsBackward = false
            if currentLine > 0 {
                currentLine -= 1
            } else {
                let arraySlice = array[0...currentArrayIndex - 1]
                if let item = arraySlice.last(where: {$0.type == DataType.text.rawValue}) {
                    let totalLines = item.data.components(separatedBy: ".").count - 1
                    currentLine = totalLines - 1
                    currentArrayIndex -= 1
                } else {
                    isStoryEndsBackward = true
                }
            }
            if isStoryEndsBackward {
                stopStory()
                sliderView.setValue(0.0, animated: true)
            } else {
                scrollToReadingLbl()
                playButtonWasPressed(UIButton())
            }
            
        } else {
            reset()
            stopStory()
        }
    }
  
  private func scrollToReadingLbl() {
    if let _ = mainStackView.arrangedSubviews.filter({$0.tag == currentArrayIndex}).first as? UILabel {
      scrollToCurrentParagraph()
      setupProgressBar()
    }
  }
  
    private func setupProgressBar() {
        var progressVal : Float = 0.0
        var totalCount = 0
        var currentCount = 0

        //calculating total count of sentences
        let textArray = array.filter({$0.type == DataType.text.rawValue})
        textArray.forEach { item in
            totalCount += item.sentences?.male?.count ?? 0
        }
        
        //calculating current count
        let arrayProcessedTillNow = array[0...currentArrayIndex - 1].filter({$0.type == DataType.text.rawValue})
        arrayProcessedTillNow.forEach { item in
            currentCount += item.sentences?.male?.count ?? 0
        }
        
        currentCount += currentLine
        
        progressVal = (Float(currentCount))/Float(totalCount)
        let progress = progressVal * 1
        sliderView.setValue(progress, animated: true)
        
//        let progressVal = (Float(currentArrayIndex) + 1.0)/Float(array.count)
//        let progress = progressVal * 1
//        sliderView.setValue(progress, animated: true)
    }
  
  private func reset() {
    isBackwardPressed = false
    isPlaying = false
    currentLine = 0
    currentArrayIndex = 0
  }
  
}

extension StoryReadViewController {
  //MARK: - Play/Pause/Stop, forward/backward functionality
  private func pauseStory() {
    player?.pause()
    if #available(iOS 13.0, *) {
      playPauseButton.setImage(UIImage(systemName: "play.fill"), for: .normal)
    } else {
      // Fallback on earlier versions
    }
  }
  
  private func stopStory() {
    pauseStory()
    player?.replaceCurrentItem(with: nil)
    player = nil
  }
  
  private func playStory() {
    if #available(iOS 13.0, *) {
      playPauseButton.setImage(UIImage(systemName: "pause.fill"), for: .normal)
    } else {
      // Fallback on earlier versions
    }
    playVoice()
    highlightLine()
  }
  
  private func playVoice() {
    let isPaused = !(isPlaying)
    let playerTime = player?.currentTime().seconds ?? 0
    
    if isPaused && playerTime != 0 {
      player?.play()
    } else {
      let type = array[currentArrayIndex].type
      if type == DataType.image.rawValue {
        if !ifStoryEnded() {
          if isBackwardPressed {
            decreaseIndexAndPlay()
          } else {
            increaseIndexAndPlay(isImage: true)
          }
        }
      } else {
        playSound()
      }
    }
  }
  
  private func playSound() {
    do {
      try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
      try AVAudioSession.sharedInstance().setActive(true)
    } catch let error {
      print(error.localizedDescription)
    }
    
    var downloadedAsset: AVURLAsset?
    if isMaleVoice {
      downloadedAsset = array[currentArrayIndex].maleAudioList?[currentLine]
    } else {
      downloadedAsset = array[currentArrayIndex].femaleAudioList?[currentLine]
    }
    
    if let asset = downloadedAsset {
      let playerItem = AVPlayerItem(asset: asset)
      player = AVPlayer(playerItem: playerItem)
      player?.addObserver(self, forKeyPath: "rate", options: NSKeyValueObservingOptions(rawValue: NSKeyValueObservingOptions.new.rawValue | NSKeyValueObservingOptions.old.rawValue), context: nil)
      player?.volume = 1
      
      guard let player = player else { return }
      NotificationCenter.default
        .addObserver(self,
                     selector: #selector(playerDidFinishPlaying),
                     name: .AVPlayerItemDidPlayToEndTime,
                     object: player.currentItem
        )
      player.rate = 1
      player.play()
    }
  }
  
  //MARK: - IBActions
  @IBAction func highlightButtonWasPressed(_ sender: Any) {
    stopStory()
    Router.shared.openSettingPopupVC(title: "Highlight", selectedValue: isHighlighted, controller: self)
  }
  
  @IBAction func voiceButtonWasPressed(_ sender: Any) {
    stopStory()
    let isGrandpa = isMaleVoice
    let isGrandma = !isMaleVoice
    Router.shared.openVoiceSettingPopupVC(isGrandpa: isGrandpa, isGrandma: isGrandma, controller: self)
  }
  
  @IBAction func backButtonWasPressed(_ sender: Any) {
    stopStory()
    fireEvent(isBackPress: true)
  }
  
  @IBAction func bookmarkButtonWasPressed(_ sender: Any) {
    stopStory()
    isBookmarked = !isBookmarked
    setupBookmarkButton()
    let str = isBookmarked ? "Saved to bookmark...!" : "Removed from bookmark...!"
    self.view.showToast(message: str)
  }
  
  @IBAction func playButtonWasPressed(_ sender: Any) {
    if currentArrayIndex < array.count {
      let isPaused = !(isPlaying)
      if isPaused {
        playStory()
      } else {
        pauseStory()
      }
    }
  }
  
  @IBAction func fastForwardButtonWasPressed(_ sender: Any) {
    isBackwardPressed = false
    stopStory()
//    playNextPreviousItem(isNextParaprah: true)
    playNextPreviousItem(isNextParaprah: false)
  }
  
  @IBAction func fastBackwardButtonWasPressed(_ sender: Any) {
    isBackwardPressed = true
    stopStory()
//    playNextPreviousItem(isNextParaprah: true)
    playNextPreviousItem(isNextParaprah: false)
  }
  
}

extension StoryReadViewController : AVAudioPlayerDelegate {
  private func clearAllHighlighting() {
    mainStackView.arrangedSubviews.forEach { lbl in
      if lbl.isKind(of: UILabel.self) {
        let label = lbl as? UILabel
        let attributedStr = NSMutableAttributedString(string: label?.text ?? "")
        if let nsRange = attributedStr.string.nsRange(of: attributedStr.string) {
          attributedStr.removeAttribute(NSAttributedString.Key.backgroundColor, range: nsRange)
          label?.attributedText = attributedStr
        }
      }
    }
  }
  
  private func clearColorStr() {
    if isHighlighted {
      if let lbl = mainStackView.arrangedSubviews.filter({$0.tag == currentArrayIndex}).first as? UILabel {
        let attributedStr = NSMutableAttributedString(string: array[currentArrayIndex].data)
        if let nsRange = attributedStr.string.nsRange(of: attributedStr.string) {
          attributedStr.removeAttribute(NSAttributedString.Key.backgroundColor, range: nsRange)
          lbl.attributedText = attributedStr
        }
      }
    }
  }
  
  @objc private func playerDidFinishPlaying() {
    isBackwardPressed = false
    stopStory()
    // Write code to play next audio.
    playNextPreviousItem()
  }
  
  private func playNextPreviousItem(isNextParaprah: Bool = false) {
    clearColorStr()
    if isBackwardPressed {
      decreaseIndexAndPlay()
      scrollToCurrentParagraph()
    } else {
      if ifStoryEnded() {
        stopStory()
        sliderView.setValue(1.0, animated: true)
        Timer.scheduledTimer(withTimeInterval: 0.3, repeats: false) { [weak self] t in
              guard let `self` = self else { return }
              DispatchQueue.main.async {
                  self.fireEvent(isBackPress: false)
              }
          }
      } else {
        increaseIndexAndPlay(isImage: false, isNextParagraph: isNextParaprah)
      }
    }
  }
  
  private func fireEvent(isBackPress: Bool) {
    let result = isOriginalValueBookmarked != isBookmarked
    dismiss(animated: false) {
      if isBackPress {
        switch self.screen {
        case "C":
          RNEventEmitter.emitter.sendEvent(withName: "onCBackPress", body: result)
        case "B":
          RNEventEmitter.emitter.sendEvent(withName: "onBBackPress", body: result)
        default:
          RNEventEmitter.emitter.sendEvent(withName: "onSBackPress", body: result)
        }
      } else {
        switch self.screen {
        case "C":
          RNEventEmitter.emitter.sendEvent(withName: "onCPress", body: result)
        case "B":
          RNEventEmitter.emitter.sendEvent(withName: "onBPress", body: result)
        default:
          RNEventEmitter.emitter.sendEvent(withName: "onSPress", body: result)
        }
      }
    }
  }
  
  private func highlightLine() {
    if isHighlighted {
      if let lbl = mainStackView.arrangedSubviews.filter({$0.tag == currentArrayIndex}).first as? UILabel {
        let completeParagraph = NSMutableAttributedString(string: array[currentArrayIndex].data)
        let attributedStr = NSMutableAttributedString(string: array[currentArrayIndex].data.components(separatedBy: ".")[currentLine])
        if let nsRange = completeParagraph.string.nsRange(of: attributedStr.string) {
          completeParagraph.addAttribute(NSAttributedString.Key.backgroundColor, value: UIColor.yellow, range: nsRange)
          lbl.attributedText = completeParagraph
        }
      }
    }
  }
  
  override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
    if keyPath == "rate" {
      if player?.rate == 1  {
        print("Playing")
        isPlaying = true
      }else{
        print("Stop")
        isPlaying = false
      }
    }
  }
  
}

extension StoryReadViewController {
  private func downloadAudioLogic() {
    
    for (index, model) in array.enumerated() {
      if model.type != "image" {
        var mp3List = [String]()
        if isMaleVoice {
          mp3List = model.sentences?.male ?? []
        } else {
          mp3List = model.sentences?.female ?? []
        }
        for (mp3Index, mp3Str) in mp3List.enumerated() {
          downloadAudio(arrayIndex: index, lineIndex: mp3Index, mp3Str: mp3Str)
        }
      }
    }
  }
  
  private func downloadAudio(arrayIndex: Int, lineIndex: Int, mp3Str: String) {
    
    let asset = AVURLAsset(url: URL(string: mp3Str)!)
    let statusKey = "tracks"
    showProgressHud()
    
    asset.loadValuesAsynchronously(forKeys: [statusKey]) {
      var error: NSError? = nil
      
      DispatchQueue.main.async {
        self.hideProgressHud()
        let status : AVKeyValueStatus = asset.statusOfValue(forKey: statusKey, error: &error)
        if status == AVKeyValueStatus.loaded {
          
          print("downloaded arrayIndex = \(arrayIndex) lineIndex = \(lineIndex)")
          if self.isMaleVoice {
            self.array[arrayIndex].maleAudioList?[lineIndex] = asset
          } else {
            self.array[arrayIndex].femaleAudioList?[lineIndex] = asset
          }
          
        }
      }
    }
  }
}

extension StoryReadViewController : SettingPopupVCDelegate {
  func getHighlightedSetting(value: Bool) {
    isHighlighted = value
    if isHighlighted == false {
      clearAllHighlighting()
    }
  }
  
}

extension StoryReadViewController : VoiceSettingPopupVCDelegate {
  func getSelectedVoiceSetting(isGrandpa: Bool, isGrandma: Bool) {
    isMaleVoice = isGrandpa
    var isNeedToDownload = false
    
    if isMaleVoice {
      if let item = array.filter({$0.type == DataType.text.rawValue}).first {
        let result = (item.maleAudioList?.first as? AVURLAsset)
        isNeedToDownload = (result == nil) ? true : false
      }
    } else {
      if let item = array.filter({$0.type == DataType.text.rawValue}).first {
        let result = (item.femaleAudioList?.first as? AVURLAsset)
        isNeedToDownload = (result == nil) ? true : false
      }
    }
    
    if isNeedToDownload {
      downloadAudioLogic()
    }
  }
}
