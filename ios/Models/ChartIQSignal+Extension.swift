//
//  ChartIQSignal+Extension.swift
//  react-native-chart-iq
//
//  Created by mac on 10/07/2023.
//

import ChartIQ
import Foundation

public extension ChartIQSignal {
    func toDictionary() -> [String: Any] {
        return [
            "study": self.study.toDictionary(),
            "joiner": self.joiner.displayName.uppercased(),
            "name": self.name,
            "description": self.signalDescription as Any,
            "disabled": !self.isEnabled,
            "conditions": self.conditions.map { $0.toDictionary() }
        ]
    }
}

public extension [ChartIQSignal] {
    func toDictionary() -> [[String: Any]] {
        return self.map { signal in
            signal.toDictionary()
        }
    }
}

public extension ChartIQCondition {
    func toDictionary() -> [String: Any] {
        return [
            "leftIndicator": self.leftIndicator,
            "rightIndicator": self.rightIndicator,
            "signalOperator": self.operator.toString(),
            "markerOption": self.markerOptions?.toDictionary() as Any
        ]
    }
}

public extension ChartIQSignalOperator {
    func toString() -> String {
        switch self {
        case .isGreaterThan:
            return "GREATER_THAN"
        case .isLessThan:
            return "LESS_THAN"
        case .isEqualTo:
            return "EQUAL_TO"
        case .crosses:
            return "CROSSES"
        case .crossesAbove:
            return "CROSSES_ABOVE"
        case .crossesBelow:
            return "CROSSES_BELOW"
        case .turnsUp:
            return "TURNS_UP"
        case .turnsDown:
            return "TURNS_DOWN"
        case .increases:
            return "INCREASES"
        case .decreases:
            return "DECREASES"
        case .doesNotChange:
            return "DOES_NOT_CHANGE"
        }
    }
}

public extension ChartIQMarkerOptions {
    func toDictionary() -> [String: Any] {
        return [
            "type": self.markerType.stringValue,
            "color": self.color?.toHexString() as Any,
            "signalShape": self.shape.stringValue,
            "label": self.label,
            "signalSize": self.size.stringValue,
            "signalPosition": self.position.stringValue
        ]
    }
}

extension [String: Any] {
    public func toChartIQSignal() -> ChartIQSignal? {
        var joiner: ChartIQSignalJoiner = .or

        switch self["joiner"] as? String {
        case "OR":
            joiner = .or
        case "AND":
            joiner = .and
        default: break
        }

        return ChartIQSignal(
            study: (self["study"] as! [String: Any]).toChartIQStudy()!,
            conditions: (self["conditions"] as! [[String: Any?]]).map { $0.toChartIQCondition() },
            joiner: joiner,
            name: self["name"] as! String,
            signalDescription: self["description"] as? String,
            isEnabled: !(self["disabled"] as? Bool ?? false)
        )
    }
}

extension [String: Any?] {
    public func toChartIQCondition() -> ChartIQCondition {
        var `operator`: ChartIQSignalOperator = .doesNotChange

        switch self["signalOperator"] as? String {
        case "GREATER_THAN":
            `operator` = .isGreaterThan
        case "LESS_THAN":
            `operator` = .isLessThan
        case "EQUAL_TO":
            `operator` = .isEqualTo
        case "CROSSES":
            `operator` = .crosses
        case "CROSSES_ABOVE":
            `operator` = .crossesAbove
        case "CROSSES_BELOW":
            `operator` = .crossesBelow
        case "TURNS_UP":
            `operator` = .turnsUp
        case "TURNS_DOWN":
            `operator` = .turnsDown
        case "INCREASES":
            `operator` = .increases
        case "DECREASES":
            `operator` = .decreases
        case "DOES_NOT_CHANGE":
            `operator` = .doesNotChange
        default: break
        }

        let markerOptions = self["markerOption"] as? [String: Any?]

        return ChartIQCondition(
            leftIndicator: self["leftIndicator"] as! String,
            operator: `operator`,
            rightIndicator: self["rightIndicator"] as! String,
            markerOptions: markerOptions == nil ? nil : markerOptions!.toChartIQMarkerOptions()
        )
    }

    public func toChartIQMarkerOptions() -> ChartIQMarkerOptions {
        var markerType: ChartIQSignalMarkerType = .marker
        switch self["type"] as? String {
        case "MARKER":
            markerType = .marker
        case "PAINTBAR":
            markerType = .paintbar
        default: break
        }

        var shape: ChartIQSignalShape = .circle
        switch self["signalShape"] as? String {
        case "CIRCLE":
            shape = .circle
        case "SQUARE":
            shape = .square
        case "DIAMOND":
            shape = .diamond
        default: break
        }

        var size: ChartIQSignalSize = .medium
        switch self["signalSize"] as? String {
        case "S":
            size = .small
        case "M":
            size = .medium
        case "L":
            size = .large
        default: break
        }

        var position: ChartIQSignalPosition = .aboveCandle
        switch self["signalPosition"] as? String {
        case "ABOVE_CANDLE":
            position = .aboveCandle
        case "BELOW_CANDLE":
            position = .belowCandle
        case "ON_CANDLE":
            position = .onCandle
        default: break
        }

        let colorString = self["color"] as? String

        return ChartIQMarkerOptions(
            markerType: markerType,
            color: colorString != nil ? UIColor(hexString: colorString!) : nil,
            shape: shape,
            label: self["label"] as! String,
            size: size,
            position: position
        )
    }
}
