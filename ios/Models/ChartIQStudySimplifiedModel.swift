//
//  ChartIQStudySimplifiedModel.swift
//  chartiq_flutter_sdk
//
//  Created by user on 20.06.2023.
//

import Foundation

public class ChartIQStudySimplidiedModel {
    public let studyName: String
    public let type: String?
    public let outputs: [String: Any]?
    
    public init(studyName: String, type: String? = "", outputs: [String: Any]?) {
        self.studyName = studyName
        self.type = type
        self.outputs = outputs
    }
    
    public func toDictionary() -> [String: Any] {
        return [
            "name": studyName,
            "shortName": studyName,
            "type": type ?? "",
            "fullName": studyName,
            "outputs": self.outputs as Any,
        ]
    }

    public func toJSONString() -> String {
        guard let data = try? JSONSerialization.data(withJSONObject: self.toDictionary(), options: .prettyPrinted),
              let stringValue = String(data: data, encoding: .utf8) else { return "" }
        return stringValue
    }
}
