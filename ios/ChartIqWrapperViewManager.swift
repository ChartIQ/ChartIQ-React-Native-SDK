import ChartIQ

@objc(ChartIqWrapperViewManager)
class ChartIqWrapperViewManager: RCTViewManager {
    public var chartIQHelper: ChartIQHelper!
    public var chartIQWrapperView: ChartIqWrapperView!
    
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
        chartIQHelper.updateInitialData(data: data)
    }
    
    @objc func setUpdateData(_ data: String){
        chartIQHelper.updateUpdateData(data: data)
    }
    
    @objc func setPagingData(_ data: String){
        chartIQHelper.updatePagingData(data: data)
    }
    
    @objc func setSymbol(_ symbol: String){
        chartIQWrapperView.chartIQView.loadChart(symbol)
    }
    
    @objc func setPeriodicity(_ period: Double, interval: String, timeUnit: String){
        let newTimeUnit = ChartIQTimeUnit(stringValue: timeUnit.lowercased())
        chartIQWrapperView.chartIQView.setPeriodicity(Int(period), interval: interval, timeUnit: newTimeUnit ?? .day)
    }
   
    
    @objc func setChartStyle(_ obj: String, attr: String, value: String){
        chartIQWrapperView.chartIQView.setChartStyle(obj, attribute: attr, value: value)
    }
    
    @objc func setChartType(_ type: String){
        let newType = ChartIQChartType(stringValue: type.lowercased())
        print("setCahrtType, RN string: \(type), newType: \(newType?.stringValue ?? "Nothing is here, oops")")
//        chartIQDelegate.chartIQView.setChartType(<#T##chartType: ChartIQChartType##ChartIQChartType#>)
    }
    
    @objc func getSymbol(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
       if let symbol = chartIQWrapperView.chartIQView.symbol {
            resolve(symbol)
       }else{
           reject("0", "symbol is not resolved", nil)
       }
    }
    
    @objc func getChartType(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
            resolve(chartIQWrapperView.chartIQView.chartType)
    }
    
    @objc func getPeriodicity(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        guard let timeUnit = chartIQWrapperView.chartIQView.timeUnit else {
            reject("0", "TimeUnit is nil", nil)
            return
        }
        guard let periodicity = chartIQWrapperView.chartIQView.periodicity else {
            reject("0", "Periodicity is nil", nil)
            return
        }
        
        resolve([
            "interval": timeUnit,
            "periodicity": periodicity
        ])
    }
    
    @objc func getChartAggregationType(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        resolve(chartIQWrapperView.chartIQView.chartAggregationType)
    }
    @objc func getActiveSeries(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        resolve(chartIQWrapperView.chartIQView.getActiveSeries())
    }
    @objc func removeSeries(_ symbol: String){
        chartIQWrapperView.chartIQView.removeSeries(symbol)
    }
    @objc func setAggregationType(_ type: String){
        let aggregationType = ChartIQChartAggregationType(stringValue: type.lowercased()) ?? .none
        print("aggr type from RN: \(type), new aggrType, \(aggregationType)")
        if(aggregationType != nil){
            chartIQWrapperView.chartIQView.setAggregationType(aggregationType ?? .heikinashi)
        }
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
    @objc func getStudyList(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        resolve(chartIQWrapperView.chartIQView.getAllStudies())
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
    @objc func getActiveStudies(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
        resolve(chartIQWrapperView.chartIQView.getActiveStudies())
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






