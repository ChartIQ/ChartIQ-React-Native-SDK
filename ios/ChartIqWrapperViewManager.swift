import ChartIQ

@objc(ChartIqWrapperViewManager)
class ChartIqWrapperViewManager: RCTViewManager {
    public var chartIQHelper: ChartIQHelper!
    public var chartIQWrapperView: ChartIqWrapperView!
    let defaultQueue = DispatchQueue.main
    
    
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
    
    @objc func setInitialData(_ data: String){
        defaultQueue.async(execute: {
            self.chartIQHelper.updateInitialData(data: data)
        })
    }
    
    @objc func setUpdateData(_ data: String){
        defaultQueue.async(execute: {
            self.chartIQHelper.updateUpdateData(data: data)
        })
    }
    
    @objc func setPagingData(_ data: String){
        defaultQueue.async(execute: {
            self.chartIQHelper.updatePagingData(data: data)
        })
    }
    
    @objc func setSymbol(_ symbol: String){
        defaultQueue.async {
            self.chartIQWrapperView.chartIQView.loadChart(symbol)
        }
    }
    
    @objc func setPeriodicity(_ period: Double, interval: String, timeUnit: String){
        defaultQueue.async {
            let newTimeUnit = ChartIQTimeUnit(stringValue: timeUnit.lowercased())
            self.chartIQWrapperView.chartIQView.setPeriodicity(Int(period), interval: interval, timeUnit: newTimeUnit ?? .day)
        }
    }
    
    
    @objc func setChartStyle(_ obj: String, attr: String, value: String){
        defaultQueue.async {
            self.chartIQWrapperView.chartIQView.setChartStyle(obj, attribute: attr, value: value)
        }
    }
    
    @objc func setChartType(_ type: String){
        defaultQueue.async {
            var stringValue = type.lowercased().replace(" ", with: "_")
            if(stringValue == "colored_hlc_bar"){
                stringValue = stringValue.replace("_bar", with: "")
            }
            guard let newType = ChartIQChartType(stringValue: stringValue) else {
                return
            }
            self.chartIQWrapperView.chartIQView.setChartType(newType)
        }
    }
    
    @objc func getSymbol(_  resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        defaultQueue.async {
            resolve(self.chartIQWrapperView.chartIQView.symbol)
        }
    }
    
    @objc func getChartType(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        defaultQueue.async {
            resolve(self.chartIQWrapperView.chartIQView.chartType.stringValue)
        }
    }
    
    @objc func getPeriodicity(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        defaultQueue.async {
            resolve([
                "timeUnit": self.chartIQWrapperView.chartIQView.timeUnit ?? "",
                "periodicity": self.chartIQWrapperView.chartIQView.periodicity ?? "",
                "interval": self.chartIQWrapperView.chartIQView.interval ?? ""
            ])
        }
        
    }
    
    @objc func getChartAggregationType(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        defaultQueue.async {
            resolve(self.chartIQWrapperView.chartIQView.chartAggregationType)
        }
    }
    
    @objc func getActiveSeries(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        defaultQueue.async {
            resolve(self.chartIQWrapperView.chartIQView.getActiveSeries())
        }
    }
    
    @objc func removeSeries(_ symbol: String){
        chartIQWrapperView.chartIQView.removeSeries(symbol)
    }
    @objc func setAggregationType(_ type: String){
        var stringValue = type.lowercased().replace(" ", with: "")
        if(stringValue == "point&figure"){
            stringValue = "pandf"
        }
        guard let aggregationType = ChartIQChartAggregationType(stringValue: stringValue)else{
            return
        }
        chartIQWrapperView.chartIQView.setAggregationType(aggregationType)
        
    }
    @objc func enableDrawing(_ tool: String){
        if let drawingTool = ChartIQDrawingTool(stringValue: tool) {
            chartIQWrapperView.chartIQView.enableDrawing(drawingTool)
        }
    }
    
    @objc func disableDrawing(){
        chartIQWrapperView.chartIQView.disableDrawing()
    }
    
    @objc func getDrawingParams(_ tool: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        
    }
    
    @objc func setDrawingParams(_ parameterName: String, value: String){
        print("setDrawingParams for \(parameterName) : \(value)")
    }
    
    @objc func clearDrawing(){
        chartIQWrapperView.chartIQView.clearDrawing()
    }
    @objc func restoreDefaultDrawingConfig(_ tool: String, all: Bool){
        print("restoreDefaultDrawingConfig for tool: \(tool), all?: \(all)")
    }
    @objc func undoDrawing(){
        chartIQWrapperView.chartIQView.undoDrawing()
    }
    @objc func redoDrawing(){
        chartIQWrapperView.chartIQView.redoDrawing()
    }
    @objc func getStudyList(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        defaultQueue.async {
            let list = self.chartIQWrapperView.chartIQView.getAllStudies()
            resolve(self.convertStudies(studies: list))
        }
    }
    
    func convertStudies(studies: [ChartIQStudy]) -> [[String : Any]]{
        let formatted =  studies.map{study in
            ["name": study.fullName,
             "shortName": study.shortName,
             "inputs": study.inputs ?? [:],
             "outputs": study.outputs ?? [:],
             "parameters": study.parameters ?? [:],
             "signalIQExclude": study.signalIQExclude,
             "attributes": "",
             "centerLine": "",
             "yAxis": [:],
             "type": "",
             "range": "",
             "nameParams": study.nameParams,
             "fullName": study.fullName,
             "originalName": study.originalName,
             "uniqueId": study.uniqueId ?? ""
            ]
        }
        return formatted
    }
    
    func parseStudy(study: String) -> ChartIQStudy? {
        if let data = study.data(using: .utf8) {
            do {
                guard let parsedStudy = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]else {
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
                
                
                guard var chartIQstudy: ChartIQStudy? =  ChartIQStudy.init(shortName: shortName as! String , fullName: fullName as! String, originalName: originalName as! String, uniqueId: uniqueId as! String, outputs: (outputs as! [String : Any]), parameters: (parameters as! [String : Any]), signalIQExclude: signalIQExclude as! Bool)else{
                    return nil
                }
                return chartIQstudy
                
                
            } catch {
                print("StudyLog:parseStudy:\(error.localizedDescription)")
            }
        }
        
        return nil
    }

    
    @objc func addStudy(_ study: String, isClone: Bool){
        defaultQueue.async {
            do{
                guard let chartIQStudy = self.parseStudy(study: study)else{
                    return
                }
               
                try self.chartIQWrapperView.chartIQView.addStudy(chartIQStudy, forClone: isClone)
            }catch{
                print("StudyLog:addStudy: Error while adding chartIQStudy")
            }

        }
    }
    
    @objc func removeStudy(_ study: String){
        defaultQueue.async {
            guard let chartIQStudy = self.parseStudy(study: study)else{
                return
                }
                self.chartIQWrapperView.chartIQView.removeStudy(chartIQStudy)
        }
    }
    
    @objc func getStudyParameters(_ study: String, studyParameterType: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock ){
        guard let chartIQStudy = self.parseStudy(study: study)else{
            return
        }
        
        defaultQueue.async {
            if(studyParameterType == "Inputs"){
                guard var inputParams = self.chartIQWrapperView.chartIQView.getStudyParameters(chartIQStudy, type: .inputs) as? [[String:Any]]else{
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
            }else if(studyParameterType == "Outputs"){
                guard var outputParams = self.chartIQWrapperView.chartIQView.getStudyParameters(chartIQStudy, type: .outputs) as? Array<[String:String]> else {
                    reject("0", "getStudyParameters error, chartIQ Study parameter in sot a String", nil)
                    return}
                for row in outputParams.indices {
                    outputParams[row]["value"] = outputParams[row]["color"]
                }
                resolve(outputParams)
            }else if(studyParameterType == "Outputs"){
                let parameters = self.chartIQWrapperView.chartIQView.getStudyParameters(chartIQStudy, type: .parameters)
                resolve(parameters)
            }else{
                reject("0", "getStudyParameters: Incorrect studyParameterType", nil)
            }
        }
    }
    
    func parseFormat(parameter: String) -> [String: String]?{
        if let data = parameter.data(using: .utf8) {
            do {
                guard let parsedParameter = try JSONSerialization.jsonObject(with: data, options: []) as? [String: String]else {
                    return nil
                }
                
                guard let fieldName = parsedParameter["fieldName"] else {
                    return nil
                }
                guard let fieldSelectedValue = parsedParameter["fieldSelectedValue"] else {
                    return nil
                }
                
                return ["key": fieldName, "value": fieldSelectedValue]
                
            }catch{
                print("Error while parsing study parameter")
            }
            
        }
        
        return nil
    }
    
    func parseParameters(parameters: String) -> [String: String]?{
        if let data = parameters.data(using: .utf8) {
            do {
                guard let parsedParameter = try JSONSerialization.jsonObject(with: data, options: []) as? [[String: String]]else {
                    return nil
                }
                var parameters = [:] as [String:String]
                for value in parsedParameter{
                    guard let key = value["fieldName"] else {
                        return nil
                    }
                    parameters[key] = value["fieldSelectedValue"]
                }
                return parameters
            }catch{
                return nil
            }
        }
        return nil
    }
    
    @objc func setStudyParameter(_ study: String, parameter: String){
        guard let chartIQStudy = self.parseStudy(study: study)else{
            return
        }
        guard let params = self.parseFormat(parameter: parameter) else {
            return
        }
        guard let key = params["key"] else {
            return
        }
        guard let value = params["value"] else {
            return
        }

        chartIQWrapperView.chartIQView.setStudyParameter(chartIQStudy.fullName, key: key, value: value)
    }
    
    @objc func setStudyParameters(_ study: String, parameters: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock ){
       
        defaultQueue.async {
            guard let chartIQStudy = self.parseStudy(study: study)else{
                reject("0", "Error in setStudyParameters  while parsing study", nil)
                return
            }
            
            guard let params = self.parseParameters(parameters: parameters) else {
                reject("0", "Error in setStudyParameters while parsing parameters", nil)
                return
            }
            
            guard let resolvedStudy = self.chartIQWrapperView.chartIQView.setStudyParameters(chartIQStudy, parameters: params)else{
                reject("0", "Error, study parameters were not set", nil)
                return
            }

            resolve(resolvedStudy)
        }
        
    }
    
    @objc func getExtendedHours(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        resolve(chartIQWrapperView.chartIQView.isExtendedHours)
    }
    @objc func setExtendedHours(_ value: Bool){
        chartIQWrapperView.chartIQView.setExtendHours(value)
    }
    @objc func setTheme(_ theme: String){
        if(theme == ChartIQTheme.day.stringValue){
            chartIQWrapperView.chartIQView.setTheme(ChartIQTheme.day)
        }else if(theme == ChartIQTheme.night.stringValue){
            chartIQWrapperView.chartIQView.setTheme(ChartIQTheme.night)
        }else{
            chartIQWrapperView.chartIQView.setTheme(ChartIQTheme.none)
        }
    }
    @objc func setChartScale(_ scale: String){
        guard let chartScale = ChartIQScale(stringValue: scale) else{ return }
        chartIQWrapperView.chartIQView.setScale(chartScale)
    }
    @objc func getChartScale(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        resolve(chartIQWrapperView.chartIQView.chartScale)
    }
    @objc func getIsInvertYAxis(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        resolve(chartIQWrapperView.chartIQView.isInvertYAxis)
    }
    @objc func setIsInvertYAxis(_ value: Bool){
        chartIQWrapperView.chartIQView.setInvertYAxis(value)
    }
    @objc func getActiveStudies(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        defaultQueue.async {
            let list = self.chartIQWrapperView.chartIQView.getActiveStudies()
            resolve(self.convertStudies(studies: list))
        }
    }
    
    @objc func addSeries(_ symbol: String, color: String, isComparison: Bool){
        defaultQueue.async {
            let uiColor = UIColor(hexString: color)
            let series = ChartIQSeries(symbolName: symbol, color: uiColor)
            self.chartIQWrapperView.chartIQView.addSeries(series, isComparison: isComparison)
        }
    }

    @objc func enableCrosshairs(){
        chartIQWrapperView.chartIQView.enableCrosshairs(true)
    }
    @objc func disableCrosshairs(){
        chartIQWrapperView.chartIQView.enableCrosshairs(false)
    }
    
}

extension ChartIqWrapperViewManager: RCTInvalidating {
    func invalidate() {
        chartIQWrapperView.chartIQView.clearChart()
        chartIQWrapperView.chartIQView.cleanup()
        chartIQHelper = nil
        chartIQWrapperView = nil
        
    }
}










