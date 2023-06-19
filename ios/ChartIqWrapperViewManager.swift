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
            print("Get symbol \(self.chartIQWrapperView.chartIQView.symbol ?? "NULL")")
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
            print("enableDrawing for tool: \(drawingTool)")
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
                        print("StudyLog:parseStudy: error while parsing study")
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
                            print("StudyLog:parseStudy: ChartIQStudy wasn't created")
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
                    print("StudyLog:addStudy: Error while creating chartIQStudy")
                    return
                }
               
                try self.chartIQWrapperView.chartIQView.addStudy(chartIQStudy, forClone: isClone)
                print("StudyLog:addStudy: Hell yeah!, \(chartIQStudy.name) was created")
            }catch{
                print("StudyLog:addStudy: Error while adding chartIQStudy")
            }

        }
    }
    
    @objc func removeStudy(_ study: String){
        defaultQueue.async {
                print("StudyLog:removeStudy: from RN \(study)")
                guard let chartIQStudy = self.parseStudy(study: study)else{
                    print("StudyLog:removeStudy: Error while creating chartIQStudy")
                    return
                }
            
            print("StudyLog:removeStudy: \(chartIQStudy.shortName), \(chartIQStudy.fullName), \(chartIQStudy.name), \(chartIQStudy.nameParams), \(chartIQStudy.originalName)")
        
                self.chartIQWrapperView.chartIQView.removeStudy(chartIQStudy)
                print("StudyLog:removeStudy: Hell yeah!, \(chartIQStudy.shortName) was removed")
        }
    }
    
    @objc func getStudyParameters(_ study: String, studyParameterType: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock ){
        guard let chartIQStudy = self.parseStudy(study: study)else{
            print("StudyLog:removeStudy: Error while creating chartIQStudy")
            return
        }
        var studyParams: Any?
        defaultQueue.async {
            if(studyParameterType == "Inputs"){
                studyParams = self.chartIQWrapperView.chartIQView.getStudyParameters(chartIQStudy, type: .inputs)
            }else if(studyParameterType == "Outputs"){
                studyParams = self.chartIQWrapperView.chartIQView.getStudyParameters(chartIQStudy, type: .outputs)
            }else if(studyParameterType == "Outputs"){
                studyParams = self.chartIQWrapperView.chartIQView.getStudyParameters(chartIQStudy, type: .parameters)
            }else{
                reject("0", "getStudyParameters: Incorrect studyParameterType", nil)
            }
                        
             resolve(studyParams)
        }
    }
    
    @objc func set
    
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










