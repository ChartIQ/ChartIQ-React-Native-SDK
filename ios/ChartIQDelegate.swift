import ChartIQ

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
            if let index = self.onPullInitialCompleationHandlers.firstIndex(where: {
                $0.id == id
            }){
                self.onPullInitialCompleationHandlers.remove(at: index)
            }
        }
    }
    
    func updateUpdateData(data: [[String: Any]], id: String) {
        defaultQueue.async {
            let transformed = self.parseOHLCParams(params: data)
            self.onPullUpdateCompleationHandlers.first(where: {
                $0.id == id
            })?.callback(transformed)
            if let index = self.onPullUpdateCompleationHandlers.firstIndex(where: {
                $0.id == id
            }){
                self.onPullUpdateCompleationHandlers.remove(at: index)
            }
        }
    }
    
    func updatePagingData(data: [[String: Any]], id: String) {
        defaultQueue.async {
            let transformed = self.parseOHLCParams(params: data)
            self.onPullPagingCompleationHandlers.first(where: {
                $0.id == id
            })?.callback(transformed)
            if let index = self.onPullPagingCompleationHandlers.firstIndex(where: {
                $0.id == id
            }){
                self.onPullPagingCompleationHandlers.remove(at: index)
            }
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
    
    func completeAndClearAllCallbacks() {
        defaultQueue.async {
            let emptyData: [ChartIQData] = []
            
            self.onPullInitialCompleationHandlers.forEach { callback in
                callback.callback(emptyData)
            }
            self.onPullInitialCompleationHandlers.removeAll()
            
            self.onPullUpdateCompleationHandlers.forEach { callback in
                callback.callback(emptyData)
            }
            self.onPullUpdateCompleationHandlers.removeAll()
            
            self.onPullPagingCompleationHandlers.forEach { callback in
                callback.callback(emptyData)
            }
            self.onPullPagingCompleationHandlers.removeAll()
        }
    }
}
