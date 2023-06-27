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
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 1.0) {
            let id = UUID().uuidString
            self.chartIQHelper.onPullInitialCompleationHandlers.append(RNPullCallback(callback: completionHandler, id: id))
            RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnPullInitial, body: self.convertParams(params: params, id: id))
        }
    }
    
    func pullUpdateData(by params: ChartIQ.ChartIQQuoteFeedParams, completionHandler: @escaping ([ChartIQ.ChartIQData]) -> Void) {
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 1.0) {
            let id = UUID().uuidString
            self.chartIQHelper.onPullUpdateCompleationHandlers.append(RNPullCallback(callback: completionHandler, id: id))
            RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnPullUpdate, body: self.convertParams(params: params, id: id))
        }
    }
    
    func pullPaginationData(by params: ChartIQ.ChartIQQuoteFeedParams, completionHandler: @escaping ([ChartIQ.ChartIQData]) -> Void) {
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 1.0) {
            let id = UUID().uuidString
            self.chartIQHelper.onPullPagingCompleationHandlers.append(RNPullCallback(callback: completionHandler, id: id))
            RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnPullPaging, body: self.convertParams(params: params, id: id))
        }
    }
    
    func convertParams(params: ChartIQ.ChartIQQuoteFeedParams, id: String) -> [AnyHashable: Any] {
        return ["quoteFeedParam": [
            "symbol": params.symbol,
            "start": params.startDate,
            "end": params.endDate,
            "interval": params.interval,
            "period": params.period,
            "id": id
        ] as [String: Any]]
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
        defaultQueue.async {
            RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnLayoutUpdate, body: layout)
        }
    }
    
    func chartIQView(_ chartIQView: ChartIQView, didUpdateSymbol symbol: String) {
        defaultQueue.async {
            RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnSymbolUpdate, body: symbol)
        }
    }

    func chartIQView(_ chartIQView: ChartIQView, didUpdateDrawing drawings: Any) {
        defaultQueue.async {
            RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnDrawingUpdate, body: drawings)
        }
    }
    
    func chartIQView(_ chartIQView: ChartIQView, didUpdateMeasure measure: String) {
        if !measure.isEmpty {
            defaultQueue.async {
                RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnMeasureUpdate, body: measure)
            }
        }
    }
}
