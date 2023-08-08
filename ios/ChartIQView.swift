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
    
    @objc var dataMethod: String = "pull" {
        didSet {
            chartIQView.setDataMethod(dataMethod == "push" ? .push : .pull)
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
        print("log_chart, start")
        if #available(iOS 16.4, *) {
            print("Is web view inspectable \(chartIQView.getWebView().isInspectable)")
            if(!chartIQView.getWebView().isInspectable){
                chartIQView.getWebView().isInspectable = true
            }
        } else {
            // Fallback on earlier versions
            print("LOL, not avb")
        }
       
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
            print("log_chart, pullInitialData")
            
            let id = UUID().uuidString
            self.chartIQHelper.onPullInitialCompleationHandlers.append(RNPullCallback(callback: completionHandler, id: id))
            RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnPullInitial, body: self.convertParams(params: params, id: id))
        }
    }
    
    func pullUpdateData(by params: ChartIQ.ChartIQQuoteFeedParams, completionHandler: @escaping ([ChartIQ.ChartIQData]) -> Void) {
            print("log_chart, pullUpdateData")
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 1.0) {
            
            let id = UUID().uuidString
            self.chartIQHelper.onPullUpdateCompleationHandlers.append(RNPullCallback(callback: completionHandler, id: id))
            RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnPullUpdate, body: self.convertParams(params: params, id: id))
        }
    }
    
    func pullPaginationData(by params: ChartIQ.ChartIQQuoteFeedParams, completionHandler: @escaping ([ChartIQ.ChartIQData]) -> Void) {
            print("log_chart, pullPaginationData")
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
        chartIQDelegate = nil
    }
}

extension ChartIqWrapperView: ChartIQDelegate {
    func chartIQViewDidFinishLoading(_ chartIQView: ChartIQ.ChartIQView) {
        print("log_chart, chartIQViewDidFinishLoading")

        chartIQView.setVoiceoverFields(default: true)
        RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnChartStart, body: "chartIQViewDidFinishLoading")
    }
    
    func chartIQView(_ chartIQView: ChartIQView, didUpdateMeasure measure: String) {
        if !measure.isEmpty {
            defaultQueue.async {
                RTEEventEmitter.shared?.emitEvent(withName: .dispatchOnMeasureUpdate, body: measure)
            }
        }
    }
}
