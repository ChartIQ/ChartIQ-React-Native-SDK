import ChartIQ

@objc(ChartIqWrapperViewManager)
class ChartIqWrapperViewManager: RCTViewManager {
    public var chartIQHelper: ChartIQHelper!
    public var chartIQWrapperView: ChartIqWrapperView!
    let defaultQueue = DispatchQueue.main
    private var timer: Timer?
    private var currentHUD: ChartIQCrosshairHUD?
    
    override init() {
        self.chartIQHelper = ChartIQHelper()
        self.chartIQWrapperView = ChartIqWrapperView()
        chartIQWrapperView.chartIQHelper = chartIQHelper
    }
    
    override func view() -> (ChartIqWrapperView) {
        return chartIQWrapperView
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc func setSymbol(_ symbol: String) {
        defaultQueue.async {
            if !symbol.isEmpty {
                self.chartIQWrapperView.chartIQView.loadChart(symbol)
            }
        }
    }
    
    @objc func setInitialData(_ data: [[String: Any]], id: String) {
        defaultQueue.async {
            self.chartIQHelper.updateInitialData(data: data, id: id)
        }
    }
    
    @objc func setUpdateData(_ data: [[String: Any]], id: String) {
        defaultQueue.async {
            self.chartIQHelper.updateUpdateData(data: data, id: id)
        }
    }
    
    @objc func setPagingData(_ data: [[String: Any]], id: String) {
        defaultQueue.async {
            self.chartIQHelper.updatePagingData(data: data, id: id)
        }
    }
    
    @objc func setPeriodicity(_ period: Double, interval: String, timeUnit: String) {
        defaultQueue.async {
            let newTimeUnit = ChartIQTimeUnit(stringValue: timeUnit.lowercased())
            self.chartIQWrapperView.chartIQView.setPeriodicity(Int(period), interval: interval, timeUnit: newTimeUnit ?? .day)
        }
    }
    
    @objc func setChartStyle(_ obj: String, attr: String, value: String) {
        defaultQueue.async {
            self.chartIQWrapperView.chartIQView.setChartStyle(obj, attribute: attr, value: value)
        }
    }
    
    @objc func setChartType(_ type: String) {
        defaultQueue.async {
            var stringValue = type.lowercased().replace(" ", with: "_")
            if stringValue == "colored_hlc_bar" {
                stringValue = stringValue.replace("_bar", with: "")
            }
            if stringValue == "baseline" {
                stringValue.append("_delta")
            }
            guard let newType = ChartIQChartType(stringValue: stringValue) else {
                return
            }
            self.chartIQWrapperView.chartIQView.setChartType(newType)
        }
    }
    
    @objc func getSymbol(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        defaultQueue.async {
            resolve(self.chartIQWrapperView.chartIQView.symbol)
        }
    }
    
    @objc func getChartType(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        defaultQueue.async {
            let chartType = self.chartIQWrapperView.chartIQView.chartType.displayName.uppercased()
            
            resolve(chartType)
        }
    }
    
    @objc func getPeriodicity(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        defaultQueue.async {
            let timeUnit = self.chartIQWrapperView.chartIQView.timeUnit
            var timeUnitValue = ""
            if timeUnit != nil {
                timeUnitValue = timeUnit!.stringValue.uppercased()
            } else {
                timeUnitValue = ChartIQTimeUnit.day.stringValue.uppercased()
            }
            
            var interval = self.chartIQWrapperView.chartIQView.interval
            if interval == nil {
                interval = "1"
            }
            if interval == "day" || interval == "week" || interval == "month" {
                timeUnitValue = ChartIQTimeUnit(stringValue: interval ?? "day")?.stringValue.uppercased() ?? timeUnitValue
                interval = "1"
            }
            
            resolve([
                "timeUnit": timeUnitValue,
                "periodicity": self.chartIQWrapperView.chartIQView.periodicity ?? 1,
                "interval": interval ?? ""
            ] as [String: Any])
        }
    }
    
    @objc func getChartAggregationType(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        defaultQueue.async {
            let aggregationType = self.chartIQWrapperView.chartIQView.chartAggregationType?.displayName
            resolve(aggregationType)
        }
    }
    
    @objc func getActiveSeries(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        defaultQueue.async {
            let activeSeries = self.chartIQWrapperView.chartIQView.getActiveSeries()
            var activeSeriesDict: [[String: String]] = []
            for series in activeSeries.indices {
                activeSeriesDict.append(["symbolName": activeSeries[series].symbolName, "color": activeSeries[series].color.toHexString()])
            }
            resolve(activeSeriesDict)
        }
    }
    
    @objc func removeSeries(_ symbol: String) {
        defaultQueue.async {
            self.chartIQWrapperView.chartIQView.removeSeries(symbol)
        }
    }
    
    @objc func setAggregationType(_ type: String) {
        var stringValue = type.lowercased().replace(" ", with: "")
        if stringValue == "point&figure" {
            stringValue = "pandf"
        }
        guard let aggregationType = ChartIQChartAggregationType(stringValue: stringValue) else {
            return
        }
        defaultQueue.async {
            self.chartIQWrapperView.chartIQView.setAggregationType(aggregationType)
        }
    }
    
    @objc func enableDrawing(_ tool: String) {
        defaultQueue.async {
            if let drawingTool = ChartIQDrawingTool(stringValue: tool) {
                self.chartIQWrapperView.chartIQView.enableDrawing(drawingTool)
            }
        }
    }
    
    @objc func disableDrawing() {
        defaultQueue.async {
            self.chartIQWrapperView.chartIQView.disableDrawing()
        }
    }
    
    @objc func clearDrawing() {
        defaultQueue.async {
            self.chartIQWrapperView.chartIQView.clearDrawing()
        }
    }
    
    @objc func restoreDefaultDrawingConfig(_ tool: String, all: Bool) {
        defaultQueue.async {
            if let drawingTool = ChartIQDrawingTool(stringValue: tool) {
                self.chartIQWrapperView.chartIQView.restoreDefaultDrawingConfig(drawingTool, all: all)
            }
        }
    }
    
    @objc func undoDrawing(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        defaultQueue.async {
            resolve(self.chartIQWrapperView.chartIQView.undoDrawing())
        }
    }
    
    @objc func redoDrawing(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        defaultQueue.async {
            resolve(self.chartIQWrapperView.chartIQView.redoDrawing())
        }
    }
    
    @objc func getStudyList(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        defaultQueue.async {
            let list = self.chartIQWrapperView.chartIQView.getAllStudies().toDictionary()
            resolve(list)
        }
    }
    
    @objc func setLanguage(_ languageCode: String) {
        defaultQueue.async {
            self.chartIQWrapperView.chartIQView.setLanguage(languageCode)
        }
    }
    
    @objc func getTranslations(_ languageCode: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        defaultQueue.async {
            let translations = self.chartIQWrapperView.chartIQView.getTranslations(languageCode)
            resolve(translations)
        }
    }
    
    @objc func addStudy(_ study: [String: Any], isClone: Bool) {
        defaultQueue.async {
            do {
                guard let chartIQStudy = study.toChartIQStudy() else {
                    return
                }
                try self.chartIQWrapperView.chartIQView.addStudy(chartIQStudy, forClone: isClone)
            } catch {}
        }
    }
    
    @objc func removeStudy(_ study: [String: Any]) {
        defaultQueue.async {
            guard let chartIQStudy = study.toChartIQStudy() else {
                return
            }
            self.chartIQWrapperView.chartIQView.removeStudy(chartIQStudy)
        }
    }
    
    @objc func getStudyParameters(_ study: [String: Any], studyParameterType: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let chartIQStudy = study.toChartIQStudy() else {
            reject("0", "Error while parsing study", nil)
            return
        }
        
        defaultQueue.async {
            if studyParameterType == "Inputs" {
                guard var inputParams = self.chartIQWrapperView.chartIQView.getStudyParameters(chartIQStudy, type: .inputs) as? [[String: Any]] else {
                    reject("0", "getStudyParameters error", nil)
                    return
                }
                for row in inputParams.indices {
                    guard let type = inputParams[row]["type"] as? String else {
                        reject("0", "getStudyParameters error, chartIQ Study parameter in sot a String", nil)
                        return
                    }
                    inputParams[row]["fieldType"] = type.capitalized
                }
                resolve(inputParams)
            } else if studyParameterType == "Outputs" {
                guard var outputParams = self.chartIQWrapperView.chartIQView.getStudyParameters(chartIQStudy, type: .outputs) as? [[String: String]] else {
                    reject("0", "getStudyParameters error, chartIQ Study parameter in sot a String", nil)
                    return
                }
                for row in outputParams.indices {
                    outputParams[row]["value"] = outputParams[row]["color"]
                }
                resolve(outputParams)
            } else if studyParameterType == "Parameters" {
                let parameters = self.chartIQWrapperView.chartIQView.getStudyParameters(chartIQStudy, type: .parameters)
                resolve(parameters)
            } else {
                reject("0", "getStudyParameters: Incorrect studyParameterType", nil)
            }
        }
    }
    
    @objc func setStudyParameter(_ study: [String: Any], parameter: [String: String], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let chartIQStudy = study.toChartIQStudy() else {
            return
        }
        guard let key = parameter["key"] else {
            return
        }
        guard let value = parameter["value"] else {
            return
        }
        
        defaultQueue.async {
            self.chartIQWrapperView.chartIQView.setStudyParameter(chartIQStudy.fullName, key: key, value: value)
            resolve(chartIQStudy.toDictionary())
        }
    }
    
    @objc func setStudyParameters(_ study: [String: Any], parameters: [[String: String]], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        defaultQueue.async {
            guard let chartIQStudy = study.toChartIQStudy() else {
                reject("0", "Error in setStudyParameters  while parsing study", nil)
                return
            }
            if !parameters.isEmpty {
                var dictionary: [String: String] = [:]
                for item in parameters {
                    dictionary[item["fieldName"]!] = item["fieldSelectedValue"]
                }
                guard let resolvedStudy = self.chartIQWrapperView.chartIQView.setStudyParameters(chartIQStudy, parameters: dictionary) else {
                    reject("0", "Error, study parameters were not set", nil)
                    return
                }
                
                resolve(resolvedStudy.toStudySimplified().toDictionary())
            }
        }
    }
    
    @objc func getExtendedHours(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        defaultQueue.async {
            resolve(self.chartIQWrapperView.chartIQView.isExtendedHours)
        }
    }
    
    @objc func setExtendedHours(_ value: Bool) {
        defaultQueue.async {
            self.chartIQWrapperView.chartIQView.setExtendHours(value)
        }
    }
    
    @objc func setTheme(_ theme: String) {
        defaultQueue.async {
            if theme == ChartIQTheme.day.stringValue {
                self.chartIQWrapperView.chartIQView.setTheme(ChartIQTheme.day)
            } else if theme == ChartIQTheme.night.stringValue {
                self.chartIQWrapperView.chartIQView.setTheme(ChartIQTheme.night)
            } else {
                self.chartIQWrapperView.chartIQView.setTheme(ChartIQTheme.none)
            }
        }
    }
    
    @objc func setChartScale(_ scale: String) {
        defaultQueue.async {
            guard let chartScale = ChartIQScale(stringValue: scale) else { return }
            self.chartIQWrapperView.chartIQView.setScale(chartScale)
        }
    }
    
    @objc func getChartScale(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        defaultQueue.async {
            let chartScale = self.chartIQWrapperView.chartIQView.chartScale.stringValue
            resolve(chartScale)
        }
    }
    
    @objc func getIsInvertYAxis(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(chartIQWrapperView.chartIQView.isInvertYAxis)
    }
    
    @objc func setIsInvertYAxis(_ value: Bool) {
        defaultQueue.async {
            self.chartIQWrapperView.chartIQView.setInvertYAxis(value)
        }
    }
    
    @objc func getActiveStudies(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        defaultQueue.async {
            let list = self.chartIQWrapperView.chartIQView.getActiveStudies().toDictionary()
            resolve(list)
        }
    }
    
    @objc func addSeries(_ symbol: String, color: String, isComparison: Bool) {
        defaultQueue.async {
            let uiColor = UIColor(hexString: color)
            let series = ChartIQSeries(symbolName: symbol, color: uiColor)
            self.chartIQWrapperView.chartIQView.addSeries(series, isComparison: isComparison)
        }
    }
    
    @objc func enableCrosshairs() {
        defaultQueue.async {
            self.chartIQWrapperView.chartIQView.enableCrosshairs(true)
        }
    }
    
    @objc func disableCrosshairs() {
        defaultQueue.async {
            self.chartIQWrapperView.chartIQView.enableCrosshairs(false)
        }
    }
    
    @objc func getHudDetails(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        defaultQueue.async {
            guard let hud = self.chartIQWrapperView.chartIQView.getHudDetails() else {
                let hudDictionary = [
                    "close": "",
                    "high": "",
                    "low": "",
                    "open": "",
                    "volume": "",
                    "price": ""
                ]
                    
                resolve(hudDictionary)
                return
            }
                
            self.currentHUD = hud
            let hudDictionary = [
                "close": hud.close,
                "high": hud.high,
                "low": hud.low,
                "open": hud.open,
                "volume": hud.volume,
                "price": hud.price
            ]
            resolve(hudDictionary)
        }
    }
    
    @objc func getDrawingParams(_ tool: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        defaultQueue.async {
            guard let newTool = ChartIQDrawingTool(stringValue: tool) else {
                reject("0", "getDrawingParams Error, unknown drawing tool", nil)
                return
            }
            resolve(self.chartIQWrapperView.chartIQView.getDrawingParameters(newTool))
        }
    }
    
    @objc func setDrawingParams(_ drawingParams: NSDictionary) {
        let parameterName = drawingParams["parameterName"] as? String
        let value = drawingParams["value"]
        let type = drawingParams["type"] as? String

        var parameterValue = value
        
        if(type == "boolean") {
            parameterValue = value as! Int == 0 ? false : true
        }
            
        defaultQueue.async {
            if value != nil && parameterName != nil {
                print("setDrawingParams \(parameterName!) \(parameterValue!)")
                self.chartIQWrapperView.chartIQView.setDrawingParameter(parameterName!, value: parameterValue!)
            }
        }
    }
    
    @objc func getActiveSignals(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        defaultQueue.async {
            let activeSignals = self.chartIQWrapperView.chartIQView.getActiveSignals().toDictionary()
            resolve(activeSignals)
        }
    }
    
    @objc func addSignalStudy(_ studyName: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        defaultQueue.async {
            let studies = self.chartIQWrapperView.chartIQView.getAllStudies().filter {
                $0.shortName == studyName
            }
            if studies.isEmpty {
                reject("0", "Error in addSignalStudy, couldn't find study for given studyName \(studyName)", nil)
                return
            }
            let study = studies[0]
            guard let signalStudy = self.chartIQWrapperView.chartIQView.addSignalStudy(study) else {
                reject("0", "Error study for signal wasn't created", nil)
                return
            }
            let response = signalStudy.toDictionary()
           
            resolve(response)
        }
    }
    
    @objc func addSignal(_ signal: [String: Any], editMode: Bool, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        defaultQueue.async {
            if let chartIQSignal = signal.toChartIQSignal() {
                self.chartIQWrapperView.chartIQView.saveSignal(chartIQSignal, isEdit: editMode)
                resolve("")
            } else {
                reject("0", "Error in addSignal method, cannot parse signal", nil)
            }
        }
    }
    
    @objc func toggleSignal(_ signal: [String: Any]) {
        defaultQueue.async {
            guard let chartIQSignal = signal.toChartIQSignal() else {
                return
            }
            self.chartIQWrapperView.chartIQView.toggleSignal(chartIQSignal)
        }
    }
    
    @objc func removeSignal(_ signal: [String: Any]) {
        defaultQueue.async {
            guard let chartIQSignal = signal.toChartIQSignal() else {
                return
            }
            self.chartIQWrapperView.chartIQView.removeSignal(chartIQSignal)
        }
    }
}

extension ChartIqWrapperViewManager: RCTInvalidating {
    func invalidate() {
        if chartIQWrapperView.chartIQView != nil {
            chartIQWrapperView.chartIQView.clearChart()
            chartIQWrapperView.chartIQView.cleanup()
        }
    
        timer?.invalidate()
        chartIQHelper = nil
        chartIQWrapperView = nil
    }
}
