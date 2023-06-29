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

class RNPullCallback {
    let callback: ([ChartIQ.ChartIQData]) -> Void
    let id: String
    init(callback: @escaping ([ChartIQ.ChartIQData]) -> Void, id: String) {
        self.callback = callback
        self.id = id
    }
}

@objc(ChartIQHelper)
class ChartIQHelper: NSObject {
    let decoder = JSONDecoder()
    let defaultQueue = DispatchQueue.global()
    
    public var onPullInitialCompleationHandlers: [RNPullCallback] = []
    public var onPullUpdateCompleationHandlers: [RNPullCallback] = []
    public var onPullPagingCompleationHandlers: [RNPullCallback] = []
    
    func updateInitialData(data: [[String: Any]], id: String) {
        defaultQueue.async {
            let transformed = self.parseOHLCParams(params: data)
            self.onPullInitialCompleationHandlers.first(where: {
                $0.id == id
            })?.callback(transformed)
        }
    }
    
    func updateUpdateData(data: [[String: Any]], id: String) {
        defaultQueue.async {
            let transformed = self.parseOHLCParams(params: data)
            self.onPullUpdateCompleationHandlers.first(where: {
                $0.id == id
            })?.callback(transformed)
        }
    }
    
    func updatePagingData(data: [[String: Any]], id: String) {
        defaultQueue.async {
            let transformed = self.parseOHLCParams(params: data)
            self.onPullPagingCompleationHandlers.first(where: {
                $0.id == id
            })?.callback(transformed)
        }
    }
    
    func parseOHLCParams(params: [[String: Any]]) -> [ChartIQData] {
        var array: [ChartIQData] = []
        params.forEach { item in
            let data = ChartIQData.init(dictionary: item)
            array.append(data)
        }
        return array
    }
}
