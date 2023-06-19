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

    func updateInitialData(data: String){
        if(onPullInitialCompleationHandler != nil){
            defaultQueue.async {
                let transformed = self.transformChartIQData(data: data)
                self.onPullInitialCompleationHandler!(transformed)
            }
        }else{
            print("onPullInitialCompleationHandler == nil")
        }
    }
    
    func updateUpdateData(data: String){
        if(onPullUpdateCompleationHandler != nil){
            defaultQueue.async {
                let transformed = self.transformChartIQData(data: data)
                self.onPullUpdateCompleationHandler!(transformed)
            }
        }else{
            print("onPullUpdateCompleationHandler == nil")
        }
    }
    
    func updatePagingData(data: String){
        if(onPullPagingCompleationHandler != nil){
            defaultQueue.async {
                let transformed = self.transformChartIQData(data: data)
                self.onPullPagingCompleationHandler!(transformed)
            }
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
