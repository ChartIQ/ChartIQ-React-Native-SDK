import ChartIQ

@objc(ChartIqWrapperView)
class ChartIqWrapperView : UIView{
    internal var chartIQView: ChartIQView!
    internal var chartIQDatasource: ChartIQDataSource!
    public var chartIQHelper: ChartIQHelper!
    internal var chartIQDelegate: ChartIQDelegate!
    internal var updateStartParam: String = ""
    internal var pagingStartParam: String = ""
    
    @objc var url: String = "" {
      didSet{
          print("MyLog: setchartUrl, \(url)")
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
        print("MyLog: Load chart with url: \(url)")
      
        chartIQView.dataSource = self
        chartIQView.delegate = self
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
        if(params.startDate == updateStartParam){return}
        RTEEventEmitter.shared?.emitEvent(withName: "DispatchOnPullUpdateData", body: convertParams(params: params))
        updateStartParam = params.startDate
        chartIQHelper.onPullUpdateCompleationHandler = completionHandler
    }
    
    func pullPaginationData(by params: ChartIQ.ChartIQQuoteFeedParams, completionHandler: @escaping ([ChartIQ.ChartIQData]) -> Void) {
        if(params.startDate == pagingStartParam){return}
        RTEEventEmitter.shared?.emitEvent(withName: "DispatchOnPullPagingData", body: convertParams(params: params))
        pagingStartParam = params.startDate
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
        chartIQView.setDataMethod(.pull)
        RTEEventEmitter.shared?.emitEvent(withName: "DispatchChartStart", body: "chartIQViewDidFinishLoading")
    }
}
