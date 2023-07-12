import ChartIQ

public extension ChartIQ.ChartIQStudy {
    func toDictionary() -> [String: Any?] {
        return [
            "name": name as Any,
            "attributes": [:] as [String: Any],
            "nameParams": nameParams as Any,
            "shortName": shortName,
            "centerLine": 0.0 as Double,
            "customRemoval": false,
            "deferUpdate": false,
            "display": fullName.isEmpty ? nil : fullName,
            "fullName": fullName,
            "originalName": originalName,
            "uniqueId": uniqueId,
            "overlay": false,
            "underlay": false,
            "yAxis": nil,
            "signalIQExclude": signalIQExclude,
            "inputs": inputs,
            "outputs": outputs,
            "parameters": parameters,
        ]
    }

    func toStudySimplified() -> ChartIQStudySimplidiedModel {
        return ChartIQStudySimplidiedModel(
            studyName: self.fullName,
            outputs: self.outputs
        )
    }
}

extension [String: Any] {
    public func toChartIQStudy() -> ChartIQStudy? {
        if let shortName = self["shortName"] as? String,
           let fullName = self["fullName"] as? String,
           let originalName = self["originalName"] as? String
        {
            return ChartIQStudy(shortName: shortName,
                                fullName: fullName,
                                originalName: originalName,
                                uniqueId: self["uniqueId"] as? String ?? UUID().uuidString,
                                inputs: self["inputs"] as? [String: Any]? ?? nil,
                                outputs: self["outputs"] as? [String: Any]? ?? nil,
                                parameters: self["parameters"] as? [String: Any]? ?? nil,
                                signalIQExclude: self["signalIQExclude"] as? Bool ?? false)
        }
        return nil
    }
}

public extension [ChartIQ.ChartIQStudy] {
    func toDictionary() -> [[String: Any?]] {
        return self.map { study in
            study.toDictionary()
        }
    }
}
