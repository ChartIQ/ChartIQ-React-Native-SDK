import ChartIQ


@objc(ChartIQWrapperModule)
class ChartIQWrapperModule: NSObject, RCTBridgeModule {
    static func moduleName() -> String! {
        return "ChartIQWrapperModule"
    }
    
    public var chartIQDelegate: ChartIQDelegate!
    let decoder = JSONDecoder()
   
    
    @objc func setInitialData(_ data: String){
       let transformed = transformChartIQData(data: data)

        if(chartIQDelegate.onPullInitialCompleationHandler != nil){
            print("Fuck eah! chartIQDelegate.onPullInitialCompleationHandler == nil")
            chartIQDelegate.onPullInitialCompleationHandler!(transformed)
        }else{
            print("chartIQDelegate.onPullInitialCompleationHandler == nil")
        }
    }
    
 
    @objc
      static func requiresMainQueueSetup() -> Bool {
        return true
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

struct DecodableChartIQData: Codable {
    let Close: Double?
    let Open: Double?
    let High: Double?
    let Low: Double?
    let Volume: Double?
    let DT: String?
    let AdjClose: Double?
}
