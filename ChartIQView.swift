import ChartIQ

@objc(ChartIqWrapperView)
class ChartIqWrapperView: UIView {
    internal var chartIQView: ChartIQView!
    internal var chartIQDatasource: ChartIQDataSource!
    public var chartIQHelper: ChartIQHelper!
    internal var chartIQDelegate: ChartIQDelegate!
    internal var updateStartParam: String = ""
    internal var pagingStartParam: String = ""
    let defaultQueue = DispatchQueue.main

    @objc var url: String = "" {
        didSet {
            print("MyLog: setchartUrl, \(url)")
            chartIQView.setChartIQUrl(url)
        }
    }
 
    override init(frame: CGRect) {
        super.init(frame: frame)
        chartIQView = ChartIQView(frame: frame)
        
        setUpChart()
    }
    
    func setUpChart() {
        chartIQView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        addSubview(chartIQView)
        print("MyLog: Load chart with url: \(url)")
      
        chartIQView.dataSource = self
        chartIQView.delegate = self
    }
    
    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension ChartIqWrapperView: ChartIQDataSource {
    func pullInitialData(by params: ChartIQ.ChartIQQuoteFeedParams, completionHandler: @escaping ([ChartIQ.ChartIQData]) -> Void) {
        defaultQueue.async {
            RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnPullInitial, body: self.convertParams(params: params))
            self.chartIQHelper.onPullInitialCompleationHandler = completionHandler
        }
    }
    
    func pullUpdateData(by params: ChartIQ.ChartIQQuoteFeedParams, completionHandler: @escaping ([ChartIQ.ChartIQData]) -> Void) {
        if params.startDate == updateStartParam { return }
        defaultQueue.async {
            RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnPullUpdate, body: self.convertParams(params: params))
            self.updateStartParam = params.startDate
            self.chartIQHelper.onPullUpdateCompleationHandler = completionHandler
        }
    }
    
    func pullPaginationData(by params: ChartIQ.ChartIQQuoteFeedParams, completionHandler: @escaping ([ChartIQ.ChartIQData]) -> Void) {
        if params.startDate == pagingStartParam { return }
        defaultQueue.async {
            RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnPullPaging, body: self.convertParams(params: params))
            self.pagingStartParam = params.startDate
            self.chartIQHelper.onPullPagingCompleationHandler = completionHandler
        }
    }
    
    func convertParams(params: ChartIQ.ChartIQQuoteFeedParams) -> [AnyHashable: Any] {
        return ["quoteFeedParam": [
            "symbol": params.symbol,
            "start": params.startDate,
            "end": params.endDate,
            "interval": params.interval,
            "period": params.period]]
    }
}

extension ChartIqWrapperView: RCTInvalidating {
    func invalidate() {
        chartIQHelper = nil
        chartIQView = nil
        chartIQDatasource = nil
    }
}

extension ChartIqWrapperView: ChartIQDelegate {
    func chartIQViewDidFinishLoading(_ chartIQView: ChartIQ.ChartIQView) {
        chartIQView.setDataMethod(.pull)
        RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnChartStart, body: "chartIQViewDidFinishLoading")
    }
    
    func chartIQView(_ chartIQView: ChartIQView, didUpdateLayout layout: Any) {
        print("Layout changed, \(layout)")
        defaultQueue.async {
            RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnLayoutUpdate, body: layout)
        }
    }
    
    func chartIQView(_ chartIQView: ChartIQView, didUpdateSymbol symbol: String) {
        print("Symbol changed, \(symbol)")
        defaultQueue.async {
            RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnSymbolUpdate, body: symbol)
        }
    }

    func chartIQView(_ chartIQView: ChartIQView, didUpdateDrawing drawings: Any) {
        print("Drawing changed, \(drawings)")
        defaultQueue.async {
            RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnDrawingUpdate, body: drawings)
        }
    }
    
    func chartIQView(_ chartIQView: ChartIQView, didUpdateMeasure measure: String) {
        print("Measure changed, \(!measure.isEmpty)")
        if !measure.isEmpty {
            defaultQueue.async {
                RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnMeasureUpdate, body: measure)
            }
        }
    }
}
