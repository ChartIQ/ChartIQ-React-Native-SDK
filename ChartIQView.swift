import ChartIQ

@objc(ChartIqWrapperView)
class ChartIqWrapperView : UIView{
    internal var chartIQView: ChartIQView!
    internal var chartIQDatasource: ChartIQDataSource!
    public var chartIQHelper: ChartIQHelper!
    
    @objc var url: String = "" {
      didSet{
          chartIQView.setChartIQUrl(url)
      }
    }
 
    override init(frame: CGRect) {
       super.init(frame: frame)
        chartIQView = ChartIQView.init(frame: frame)
        
        setUpChart()
    }
    
    func setUpChart(){
        chartIQView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        self.addSubview(chartIQView)
        
        chartIQView.loadChart("AAPL")
        chartIQView.setDataMethod(.pull)
        chartIQView.dataSource = self
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension ChartIqWrapperView: ChartIQDataSource {
    func pullInitialData(by params: ChartIQ.ChartIQQuoteFeedParams, completionHandler: @escaping ([ChartIQ.ChartIQData]) -> Void) {
        RTEEventEmitter.shared?.emitEvent(withName: "DispatchOnPullInitialData", body: convertParams(params: params))
        chartIQHelper.onPullInitialCompleationHandler = completionHandler
    }
    
    func pullUpdateData(by params: ChartIQ.ChartIQQuoteFeedParams, completionHandler: @escaping ([ChartIQ.ChartIQData]) -> Void) {
        RTEEventEmitter.shared?.emitEvent(withName: "DispatchOnPullUpdateData", body: convertParams(params: params))
        chartIQHelper.onPullUpdateCompleationHandler = completionHandler
    }
    
    func pullPaginationData(by params: ChartIQ.ChartIQQuoteFeedParams, completionHandler: @escaping ([ChartIQ.ChartIQData]) -> Void) {
        RTEEventEmitter.shared?.emitEvent(withName: "DispatchOnPullPagingData", body: convertParams(params: params))
        chartIQHelper.onPullPagingCompleationHandler = completionHandler
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

extension ChartIqWrapperView: RCTInvalidating {
    func invalidate() {
        self.chartIQHelper = nil
        self.chartIQView = nil
        self.chartIQDatasource = nil
    }
}

extension ChartIqWrapperView: ChartIQDelegate {
    func chartIQViewDidFinishLoading(_ chartIQView: ChartIQ.ChartIQView) {
        print("chartIQViewDidFinishLoading")

        self.chartIQView = chartIQView
        let symbol = chartIQView.symbol ?? "AAPL"
        let timeUnit = chartIQView.timeUnit ?? ChartIQTimeUnit.day
        let periodicity = chartIQView.periodicity ?? 1
        let interval = chartIQView.interval ?? "0"
        print("chartIQViewDidFinishLoading, symbol: \(symbol), timeUnit: \(timeUnit), periodicity: \(periodicity), interval: \(interval)")

        chartIQView.setPeriodicity(periodicity, interval: interval, timeUnit: timeUnit)
    }
    
    
}

