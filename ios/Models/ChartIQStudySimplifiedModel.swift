import Foundation

public class ChartIQStudySimplidiedModel {
    public let studyName: String
    public let type: String?
    public let outputs: [String: Any]?
    public let nameParams: String
    public let originalName: String
    
    public init(studyName: String, type: String? = "", outputs: [String: Any]?, nameParams: String = "", originalName: String = "") {
        self.studyName = studyName
        self.type = type
        self.outputs = outputs
        self.nameParams = nameParams
        self.originalName = originalName
    }
    
    public func toDictionary() -> [String: Any] {
        return [
            "name": self.studyName,
            "shortName": self.studyName,
            "type": self.type ?? "",
            "fullName": self.studyName,
            "display": self.studyName,
            "nameParams": self.nameParams,
            "outputs": self.outputs as Any,
            "originalName": self.originalName
        ]
    }

    public func toJSONString() -> String {
        guard let data = try? JSONSerialization.data(withJSONObject: self.toDictionary(), options: .prettyPrinted),
              let stringValue = String(data: data, encoding: .utf8) else { return "" }
        return stringValue
    }
}
