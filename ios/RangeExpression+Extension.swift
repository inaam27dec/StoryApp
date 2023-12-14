//
//  RangeExpression+Extension.swift
//  Readerly
//
//  Created by Ahmad Rafiq on 9/16/22.
//

import Foundation

extension RangeExpression where Bound == String.Index  {
    func nsRange<S: StringProtocol>(in string: S) -> NSRange { .init(self, in: string) }
}
