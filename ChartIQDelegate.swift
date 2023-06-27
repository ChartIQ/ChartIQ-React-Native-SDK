import ChartIQ

struct DecodableChartIQData: Codable {
    let Close: Double?
    let Open: Double?
    let High: Double?
    let Low: Double?
    let Volume: Double?
    let DT: String?
    let AdjClose: Double?
}

@objc(ChartIQHelper)
class ChartIQHelper: NSObject {
    let decoder = JSONDecoder()
    let defaultQueue = DispatchQueue.global()

    public var onPullInitialCompleationHandler: (([ChartIQ.ChartIQData]) -> Void)!
    public var onPullUpdateCompleationHandler: (([ChartIQ.ChartIQData]) -> Void)!
    public var onPullPagingCompleationHandler: (([ChartIQ.ChartIQData]) -> Void)!

    func updateInitialData(data: [[String: Any]]){
        if(onPullInitialCompleationHandler != nil){
            defaultQueue.async {
                let transformed = self.parseOHLCParams(params: data)
                self.onPullInitialCompleationHandler!(transformed)
            }
        }else{
            print("onPullInitialCompleationHandler == nil")
        }
    }
    
    func updateUpdateData(data: [[String: Any]]){
        if(onPullUpdateCompleationHandler != nil){
            defaultQueue.async {
                let transformed = self.parseOHLCParams(params: data)
                self.onPullUpdateCompleationHandler!(transformed)
            }
        }else{
            print("onPullUpdateCompleationHandler == nil")
        }
    }
    
    func updatePagingData(data: [[String: Any]]){
        if(onPullPagingCompleationHandler != nil){
            defaultQueue.async {
                let transformed = self.parseOHLCParams(params: data)
                self.onPullPagingCompleationHandler!(transformed)
            }
        }else{
            print("onPullPagingCompleationHandler == nil")
        }
    }
    
    func parseOHLCParams(params: [[String: Any]]) -> [ChartIQData]{
        var array: [ChartIQData] = []
        params.forEach{item in
            let data = ChartIQData(dictionary: item)
            array.append(data)
        }
        return array
    }
}
