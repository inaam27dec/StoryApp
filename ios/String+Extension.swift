//
//  String+Extension.swift
//  Readerly
//
//  Created by Ahmad Rafiq on 9/20/22.
//

import Foundation

extension String {
//  func ranges(of substring: String, options: CompareOptions = [], locale: Locale? = nil) -> Range<Index>? {
//    var range: Range<Index>?
//    if let rng = range(of: substring, options: options, range: (range?.upperBound ?? self.startIndex)..<self.endIndex, locale: locale) {
//      range = rng
//      //              ranges.append(range)
//    }
//    return range
//  }
  
  func nsRange<S: StringProtocol>(of string: S, options: String.CompareOptions = [], range: Range<Index>? = nil, locale: Locale? = nil) -> NSRange? {
    self.range(of: string,
               options: options,
               range: range ?? startIndex..<endIndex,
               locale: locale ?? .current)?
      .nsRange(in: self)
  }
  
  var boolValue: Bool {
      return (self as NSString).boolValue
  }
}
