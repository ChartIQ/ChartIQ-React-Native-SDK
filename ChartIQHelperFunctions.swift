import ChartIQ

struct ChartIQHelperFunctions {
    static func parseSignal(signal: String) -> ChartIQSignal? {
        if let data = signal.data(using: .utf8) {
            do {
                guard let parsedSignal = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] else {
                    return nil
                }
                guard let name = parsedSignal["name"] as? String else {
                    print("parseSignal: error while parsing name")
                    return nil
                }
                guard let conditions = parsedSignal["conditions"] as? [[String: Any]] else {
                    print("parseSignal: error while parsing conditions")
                    return nil
                }
                guard let formattedConditions = formatConditions(conditions: conditions) else {
                    print("parseSignal: Error while formatting conditions")
                    return nil
                }
                guard let joiner = parsedSignal["joiner"] as? String else {
                    print("parseSignal: error while parsing joiner")
                    return nil
                }
                guard let study = parsedSignal["study"] as? [String: Any] else {
                    print("parseSignal: error while parsing study")
                    return nil
                }
                guard let disabled = parsedSignal["disabled"] as? Bool else {
                    print("parseSignal: error while parsing disabled")
                    return nil
                }
                guard let description = parsedSignal["description"] as? String else {
                    print("parseSignal: error while parsing description")
                    return nil
                }
                
                
                
                guard let chartIQStudy = formatStudy(study: study)else{
                    print("parseSignal: error while creating study")
                    return nil
                }
                let chartIQSignalJoiner = joiner == "AND" ? ChartIQSignalJoiner.and : ChartIQSignalJoiner.or
                let chartIQSignal =  ChartIQSignal(
                    study: chartIQStudy,
                    conditions: formattedConditions,
                    joiner: chartIQSignalJoiner,
                    name: name,
                    signalDescription: description
                    )
                print("parseSignal: SUCCESSS! \(chartIQSignal.name)")
                return chartIQSignal
            } catch {
                print("parseSignal: \(error.localizedDescription)")
            }
        }
        
        return nil
    }
    
    static func formatStudy(study: [String: Any]) -> ChartIQStudy?{
        guard let shortName = study["shortName"] as? String else {
            return nil
        }
        guard let fullName = study["name"] as? String else {
            return nil
        }
        guard let inputs = study["inputs"] as? [String: Any] else {
            return nil
        }
        guard let outputs = study["outputs"] as? [String: Any] else {
            return nil
        }
        guard let parameters = study["parameters"] as? [String: Any] else {
            return nil
        }
        
        return ChartIQStudy(shortName: shortName,
                            fullName: fullName,
                            originalName: shortName,
                            uniqueId: "",
                            inputs: inputs,
                            outputs: outputs,
                            parameters: parameters,
                            signalIQExclude: false
        )
    }
    
    static func formatConditions(conditions: [[String: Any]]) -> [ChartIQCondition]?{
        var parsedConditions: [ChartIQCondition] = []
        for condition in conditions {
            guard let leftIndicator = condition["leftIndicator"] as? String else {
                print("parseSignal: leftIndicator parse error")
                return nil
            }
            
            guard let operatorValue = condition["signalOperator"] as? String else {
                print("parseSignal: operator parse error")
                return nil
            }
            
            let signalOperator = formatOperator(signalOperator: operatorValue)
            guard let rightIndicator = condition["leftIndicator"] as? String else {
                print("parseSignal: rightIndicator parse error")
                return nil
            }
            guard let merkerOptionsDictionary = condition["markerOption"] as? [String: Any] else {
                print("parseSignal: merkerOptions parse error")
                return nil
            }
            
            guard let markerOptions = formatMerker(merker: merkerOptionsDictionary) else {
                print("parseSignal: markerOption error while formatting marker options")
                return nil
            }
            
            parsedConditions.append(ChartIQCondition(
                leftIndicator: leftIndicator,
                operator: signalOperator,
                rightIndicator: rightIndicator,
                markerOptions: markerOptions))
        }
        return parsedConditions
    }
    
    static func formatOperator(signalOperator: String) -> ChartIQSignalOperator {
        switch signalOperator {
        case "GREATER_THAN": return ChartIQSignalOperator.isGreaterThan
        case "CROSSES": return ChartIQSignalOperator.crosses
        case "EQUAL_TO": return ChartIQSignalOperator.isEqualTo
        case "CROSSES_ABOVE": return ChartIQSignalOperator.crossesAbove
        case "CROSSES_BELOW": return ChartIQSignalOperator.crossesBelow
        case "TURNS_UP": return ChartIQSignalOperator.turnsUp
        case "TURNS_DOWN": return ChartIQSignalOperator.turnsDown
        case "INCREASES": return ChartIQSignalOperator.increases
        case "DECREASES": return ChartIQSignalOperator.decreases
        case "DOES_NOT_CHANGE": return ChartIQSignalOperator.doesNotChange
        default: return ChartIQSignalOperator.doesNotChange
        }
    }
    
    static func formatMerker(merker: [String: Any]) -> ChartIQMarkerOptions?{
        guard let type = merker["type"] as? String else {
            print("parseSignal: merkerOptions type parse error")
            return nil
        }
        guard let color = merker["color"] as? String else {
            print("parseSignal: merkerOptions type parse error")
            return nil
        }
        guard let signalShape = merker["signalShape"] as? String else {
            print("parseSignal: merkerOptions signalShape parse error")
            return nil
        }
        guard let label = merker["label"] as? String else {
            print("parseSignal: merkerOptions label parse error")
            return nil
        }
        guard let signalSize = merker["signalSize"] as? String else {
            print("parseSignal: merkerOptions signalSize parse error")
            return nil
        }
        guard let signalPosition = merker["signalPosition"] as? String else {
            print("parseSignal: merkerOptions signalPosition parse error")
            return nil
        }
        
        guard let markerType = ChartIQSignalMarkerType(stringValue: type.lowercased())else{
            print("parseSignal: merkerOptions: error while creating markerType")
            return nil
        }
        let merkerColor = UIColor(hexString: color)
        guard let chartIQSignalShape = ChartIQSignalShape(stringValue: signalShape.lowercased())else{
            print("parseSignal: merkerOptions: error while creating chartIQSignalShape")
            
            return nil
        }
        guard let chartIQSignalSize = ChartIQSignalSize(stringValue: signalSize)else {
            print("parseSignal: merkerOptions: error while creating chartIQSignalSize")
            return nil
        }
        guard let chartIQSignalPosition = ChartIQSignalPosition(stringValue: signalPosition.lowercased()) else {
            print("parseSignal: merkerOptions: error while creating chartIQSignalPosition")
            return nil
        }
        return ChartIQMarkerOptions(markerType: markerType, color: merkerColor, shape: chartIQSignalShape, label: label, size: chartIQSignalSize, position: chartIQSignalPosition)
    }
    
    static func convertStudies(studies: [ChartIQStudy]) -> [[String: Any]] {
        let formatted = studies.map { study in
            ["name": study.fullName,
             "shortName": study.shortName,
             "inputs": study.inputs ?? [:],
             "outputs": study.outputs ?? [:],
             "parameters": study.parameters ?? [:],
             "signalIQExclude": study.signalIQExclude,
             "attributes": "",
             "centerLine": "",
             "yAxis": [:] as [String:String],
             "type": "",
             "range": "",
             "nameParams": study.nameParams,
             "fullName": study.fullName,
             "originalName": study.originalName,
             "uniqueId": study.uniqueId ?? ""] as [String : Any]
        }
        return formatted
    }
    
    static func convertOperator(signalOperator: ChartIQSignalOperator) -> String{
        switch(signalOperator){
            case .isGreaterThan: return "GREATER_THAN"
            case .crosses: return "CROSSES"
            case .isEqualTo: return "EQUAL_TO"
            case .crossesAbove: return "CROSSES_ABOVE"
            case .crossesBelow: return "CROSSES_BELOW"
            case .turnsUp: return "TURNS_UP"
            case .turnsDown: return "TURNS_DOWN"
            case .increases: return "INCREASES"
            case .decreases: return "DECREASES"
            case .doesNotChange: return "DOES_NOT_CHANGE"
            case .isLessThan: return "LESS_THAN"
            default: return "DOES_NOT_CHANGE"
        }
    }
    
    static func convertConditions(conditions: [ChartIQCondition]) -> [[String:Any]]{
        let formatted = conditions.map{ condition in
            ["leftIndicator": condition.leftIndicator,
             "rightIndicator": condition.rightIndicator,
             "signalOperator": convertOperator(signalOperator: condition.operator),
             "markerOption": [
                "type": condition.markerOptions?.markerType.stringValue.uppercased(),
                "color": condition.markerOptions?.color?.toHexString(),
                "signalShape": condition.markerOptions?.shape.stringValue.uppercased(),
                "signalSize": condition.markerOptions?.size.stringValue,
                "label": condition.markerOptions?.label,
                "signalPosition": condition.markerOptions?.position.stringValue.uppercased()
             ]
            ] as [String : Any]
        }
        
        return formatted
    }
    
    static func convertSignals(signals: [ChartIQSignal]) -> [[String:Any]]{
        let formatted = signals.map { signal in
            ["uniqueId": signal.study.uniqueId ?? "",
             "name": signal.name,
             "conditions": convertConditions(conditions: signal.conditions),
             "joiner": signal.joiner.displayName.uppercased(),
             "description": signal.signalDescription ?? "",
             "disabled": !signal.isEnabled,
             "study": convertStudies(studies: [signal.study])[0]
            ] as [String : Any]
        }
        
        return formatted
    }
    
    static func parseStudy(study: String) -> ChartIQStudy? {
        if let data = study.data(using: .utf8) {
            do {
                guard let parsedStudy = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] else {
                    return nil
                }
                
                guard let shortName = parsedStudy["shortName"] else {
                    return nil
                }
                guard let fullName = parsedStudy["fullName"] else {
                    return nil
                }
                guard let originalName = parsedStudy["originalName"] else {
                    return nil
                }
                guard let uniqueId = parsedStudy["uniqueId"] else {
                    return nil
                }
                guard let outputs = parsedStudy["outputs"] else {
                    return nil
                }
                guard let parameters = parsedStudy["parameters"] else {
                    return nil
                }
                guard let signalIQExclude = parsedStudy["signalIQExclude"] else {
                    return nil
                }
                
                guard var chartIQstudy: ChartIQStudy? = ChartIQStudy(shortName: shortName as! String, fullName: fullName as! String, originalName: originalName as! String, uniqueId: uniqueId as! String, outputs: outputs as! [String: Any], parameters: parameters as! [String: Any], signalIQExclude: signalIQExclude as! Bool) else {
                    return nil
                }
                return chartIQstudy
                
            } catch {
                print("StudyLog:parseStudy:\(error.localizedDescription)")
            }
        }
        
        return nil
    }
    
    static func parseParameters(parameters: String) -> [String: String]? {
        if let data = parameters.data(using: .utf8) {
            do {
                guard let parsedParameter = try JSONSerialization.jsonObject(with: data, options: []) as? [[String: String]] else {
                    return nil
                }
                var parameters = [:] as [String: String]
                for value in parsedParameter {
                    guard let key = value["fieldName"] else {
                        return nil
                    }
                    parameters[key] = value["fieldSelectedValue"]
                }
                return parameters
            } catch {
                return nil
            }
        }
        return nil
    }
    
    static func parseFormat(parameter: String) -> [String: String]? {
        if let data = parameter.data(using: .utf8) {
            do {
                guard let parsedParameter = try JSONSerialization.jsonObject(with: data, options: []) as? [String: String] else {
                    return nil
                }
                
                guard let fieldName = parsedParameter["fieldName"] else {
                    return nil
                }
                guard let fieldSelectedValue = parsedParameter["fieldSelectedValue"] else {
                    return nil
                }
                
                return ["key": fieldName, "value": fieldSelectedValue]
                
            } catch {
                print("Error while parsing study parameter")
            }
        }
        
        return nil
    }
    
}
