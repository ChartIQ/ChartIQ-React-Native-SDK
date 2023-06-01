import ChartIQ

class ChartIQDelegate: NSObject {
    let decoder = JSONDecoder()

    public var onPullInitialCompleationHandler: (([ChartIQ.ChartIQData]) -> Void)!
    public var onPullUpdateCompleationHandler: (([ChartIQ.ChartIQData]) -> Void)!
    public var onPullPagingCompleationHandler: (([ChartIQ.ChartIQData]) -> Void)!
    
    func updateInitialData(data: String){
       let transformed = transformChartIQData(data: data)

        if(onPullInitialCompleationHandler != nil){
            print("Fuck eah! onPullInitialCompleationHandler != nil")
            onPullInitialCompleationHandler!(transformed)
        }else{
            print("onPullInitialCompleationHandler == nil")
        }
    }
    
    func updateUpdateData(data: String){
       let transformed = transformChartIQData(data: data)

        if(onPullUpdateCompleationHandler != nil){
            print("Fuck eah! onPullUpdateCompleationHandler != nil")
            onPullUpdateCompleationHandler!(transformed)
        }else{
            print("onPullUpdateCompleationHandler == nil")
        }
    }
    
    func updatePagingData(data: String){
       let transformed = transformChartIQData(data: data)

        if(onPullPagingCompleationHandler != nil){
            print("Fuck eah! onPullPagingCompleationHandler == nil")
            onPullPagingCompleationHandler!(transformed)
        }else{
            print("onPullPagingCompleationHandler == nil")
        }
    }
    
    func transformChartIQData(data: String) -> Array<ChartIQData>{
        let newData = try! decoder.decode(Array<DecodableChartIQData>.self, from: data.data(using: .utf8)!)
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        return newData.map({ decodableItem in
            ChartIQData.init(
                date: dateFormatter.date(from: decodableItem.DT ?? "") ?? Date(),
                open: decodableItem.Open ?? 0,
                high: decodableItem.High ?? 0,
                low: decodableItem.Low ?? 0,
                close: decodableItem.Close ?? 0,
                volume: decodableItem.Volume ?? 0,
                adjClose: decodableItem.AdjClose ?? 0)
        })
    }
}

@objc(ChartIqWrapperViewManager)
class ChartIqWrapperViewManager: RCTViewManager {
    public var chartIQDelegate = ChartIQDelegate()

  override func view() -> (ChartIqWrapperView) {
      let chartIQWrapperView = ChartIqWrapperView()
      chartIQWrapperView.chartIQDelegate = chartIQDelegate
      print("ChartIQWrapper initialized with, chartIQDelegate != nil :  \(chartIQWrapperView.chartIQDelegate != nil)")
      return chartIQWrapperView
  }

  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }
    
    @objc func setInitialData(_ data: String){
        chartIQDelegate.updateInitialData(data: data)
    }
    
    @objc func setUpdateData(_ data: String){
        chartIQDelegate.updateUpdateData(data: data)
    }
    
    @objc func setPagingData(_ data: String){
        chartIQDelegate.updatePagingData(data: data)
    }
   
}

class ChartIqWrapperView : UIView{
    internal var chartIQView: ChartIQView!
    internal var chartIQDatasource: ChartIQDataSource!
    public var chartIQDelegate: ChartIQDelegate!
    
    @objc var url: String = "" {
      didSet{
          chartIQView.setChartIQUrl(url)
      }
    }
 
    override init(frame: CGRect) {
       super.init(frame: frame)
        chartIQView = ChartIQView.init(frame: frame)
        chartIQView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        self.addSubview(chartIQView)
        
        chartIQView.loadChart("AAPL")
        chartIQView.setDataMethod(.pull)
        setupDataSource()
    }
    
    func setupDataSource(){
        chartIQView.dataSource = self
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension ChartIqWrapperView: ChartIQDataSource {
    func pullInitialData(by params: ChartIQ.ChartIQQuoteFeedParams, completionHandler: @escaping ([ChartIQ.ChartIQData]) -> Void) {
        RTEEventEmitter.shared?.emitEvent(withName: "DispatchOnPullInitialData", body: convertParams(params: params))
        chartIQDelegate.onPullInitialCompleationHandler = completionHandler
    }
    
    func pullUpdateData(by params: ChartIQ.ChartIQQuoteFeedParams, completionHandler: @escaping ([ChartIQ.ChartIQData]) -> Void) {
        RTEEventEmitter.shared?.emitEvent(withName: "DispatchOnPullUpdateData", body: convertParams(params: params))
        chartIQDelegate.onPullUpdateCompleationHandler = completionHandler
    }
    
    func pullPaginationData(by params: ChartIQ.ChartIQQuoteFeedParams, completionHandler: @escaping ([ChartIQ.ChartIQData]) -> Void) {
        RTEEventEmitter.shared?.emitEvent(withName: "DispatchOnPullPagingData", body: convertParams(params: params))
        chartIQDelegate.onPullPagingCompleationHandler = completionHandler
    }
    
    func convertParams(params: ChartIQ.ChartIQQuoteFeedParams) -> Dictionary<AnyHashable, Any>{
        return ["quoteFeedParam": [
            "symbol": params.symbol,
            "start": params.startDate,
            "end": params.endDate,
            "interval": params.interval,
            "period": params.period ]]
    }

}

