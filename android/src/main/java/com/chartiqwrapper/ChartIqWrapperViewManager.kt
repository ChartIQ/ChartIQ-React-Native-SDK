package com.chartiqwrapper

import android.annotation.SuppressLint
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout

import androidx.lifecycle.MutableLiveData
import com.chartiq.sdk.ChartIQ
import com.chartiq.sdk.DataSource
import com.chartiq.sdk.DataSourceCallback
import com.chartiq.sdk.OnStartCallback
import com.chartiq.sdk.model.CrosshairHUD
import com.chartiq.sdk.model.QuoteFeedParams
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.google.gson.Gson
import kotlinx.coroutines.*


class ChartIqWrapperViewManager(private val chartIQViewModel: ChartIQViewModel) :
  SimpleViewManager<View>() {
  private val gson: Gson = Gson()
  private var reactContext: ThemedReactContext? = null
  private lateinit var chartIQ: ChartIQ
  private val job = Job()
  private val chartScope = CoroutineScope(job + Dispatchers.IO)
  private lateinit var view: LinearLayout

  private var startCallback: OnStartCallback = OnStartCallback {
    dispatchStart()
  }
  private var url: String = ""
  override fun getName() = "ChartIqWrapperView"

  private val crosshairsHUD = MutableLiveData<CrosshairHUD>()

  @ReactProp(name = "url")
  fun setUrl(view: ViewGroup, url: String?){
    if(url != null){
      this.url = url
      initChartIQ(view)
    }
  }
  private fun fetchCrosshairsState() {
    launchCrosshairsUpdate()
  }

  private fun getHUDDetails() {
    chartIQ.getHUDDetails { hud ->
      crosshairsHUD.value = hud
      dispatchOnHUDChanged(hud)
    }
  }

  private fun launchCrosshairsUpdate() {
    chartScope.launch {
      while (true) {
        delay(CROSSHAIRS_UPDATE_PERIOD)
        withContext(Dispatchers.Main) {
          chartIQ.isCrosshairsEnabled { enabled ->
            if (enabled) {
              getHUDDetails()
            }
          }
        }
      }
    }
  }

  private fun addMeasureListener(){
    chartIQ.addMeasureListener{measure ->
      dispatchOnMeasureChanged(measure)
    }
  }

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, MutableMap<String, String>>? {
    return mapOf(
      "onPullInitialData" to MapBuilder.of("registrationName", "onPullInitialData"),
      "onPullUpdateData" to MapBuilder.of("registrationName", "onPullUpdateData"),
      "onPullPagingData" to MapBuilder.of("registrationName", "onPullPagingData"),
      "onChartTypeChanged" to MapBuilder.of("registrationName", "onChartTypeChanged"),
      "onHUDChanged" to MapBuilder.of("registrationName", "onHUDChanged"),
      "onMeasureChanged" to MapBuilder.of("registrationName", "onMeasureChanged"),
      "onChartAggregationTypeChanged" to MapBuilder.of("registrationName", "onChartAggregationTypeChanged"),
      "onStart" to MapBuilder.of("registrationName", "onStart"),
    ).toMutableMap()
  }

  override fun createViewInstance(reactContext: ThemedReactContext): LinearLayout {
    this.reactContext = reactContext
    view = LinearLayout(reactContext).apply {
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT
      )
    }

    return view
  }

  private fun initChartIQ(view: ViewGroup){
    if(reactContext != null) {
      chartIQ = ChartIQ.getInstance(url, reactContext!!)
      chartIQViewModel.setChartIQ(chartIQ)

      view.addView(chartIQ.chartView.apply {
        layoutParams = LinearLayout.LayoutParams(
          LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT
        )
      })

      initDatasource()
      dispatchOnChartTypeChanged()
      dispatchOnChartAggregationTypeChanged()
      fetchCrosshairsState()
      addMeasureListener()
    }
  }

  @ReactMethod
  fun dispatchStart() {
    val event: WritableMap = Arguments.createMap()
    event.putString("started", "true")
    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      view.id,
      "onStart",
      event,
    )
  }

  fun createQuoteFeedMap(params: QuoteFeedParams):WritableMap {
    try{
      var map = Arguments.createMap().apply {
        putString("end", params.end)
        putString("start", params.start)
        putString("interval", params.interval)
        putString("symbol", params.symbol)
        putInt("period", params.period!!)

        if (params.meta != null && params.meta is String) {
          val meta = gson.fromJson(params.meta as String, Map::class.java)
          putMap("meta", Arguments.makeNativeMap(meta as Map<String, Any>))
        }
      }
      return Arguments.createMap().apply {
        putMap("quoteFeedParam", map)
      }
    }catch (error: Exception){
      throw error
    }
  }

  @ReactMethod
  fun dispatchOnPullInitialData(params: QuoteFeedParams) {
    val event: WritableMap = createQuoteFeedMap(params)

    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      view.id,
      "onPullInitialData",
      event,
    )
  }

  @ReactMethod
  fun dispatchOnPullUpdateData(params: QuoteFeedParams) {
    val event: WritableMap = createQuoteFeedMap(params)

    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      view.id,
      "onPullUpdateData",
      event,
    )
  }

  @ReactMethod
  fun dispatchOnPullPagingData(params: QuoteFeedParams) {
    val event: WritableMap = createQuoteFeedMap(params)

    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      view.id,
      "onPullPagingData",
      event,
    )
  }

  @ReactMethod
  fun dispatchOnChartTypeChanged() {
    val event: WritableMap = Arguments.createMap()
    event.putString(
      "chartType", chartIQ.getChartType { chartType -> chartType?.value }.toString()
    )
    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      view.id,
      "onChartTypeChanged",
      event,
    )
  }

  @ReactMethod
  fun dispatchOnChartAggregationTypeChanged(){
    val event: WritableMap = Arguments.createMap()
    chartIQ.getChartAggregationType{ aggregationType ->

      val response: String? = aggregationType?.value
      event.putString(
       "aggregationType", response
      )
     reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
       view.id,
       "onChartAggregationTypeChanged",
       event,
     )
   }

  }

  @ReactMethod
  fun dispatchOnHUDChanged(hud: CrosshairHUD) {
    val event: WritableMap = Arguments.createMap().apply {
      var map = Arguments.createMap().apply {
        putString("close", hud.close)
        putString("high", hud.high)
        putString("low", hud.low)
        putString("open", hud.open)
        putString("volume", hud.volume)
        putString("price", hud.price)
      }
      putMap("hud", map)
    }

    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      view.id,
      "onHUDChanged",
      event,
    )
  }

  @ReactMethod
  fun dispatchOnMeasureChanged(measure: String){
    val event: WritableMap = Arguments.createMap().apply {
      putString("measure", measure)
    }

    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      view.id,
      "onMeasureChanged",
      event,
    )
  }



  private fun initDatasource() {
    chartIQ.apply {
      setDataSource(object : DataSource {
        override fun pullInitialData(
          params: QuoteFeedParams,
          callback: DataSourceCallback,
        ) {
          chartIQViewModel.initialCallback = callback
          dispatchOnPullInitialData(params)
        }

        override fun pullUpdateData(
          params: QuoteFeedParams,
          callback: DataSourceCallback,
        ) {
          chartIQViewModel.updateCallback = callback
          dispatchOnPullUpdateData(params)
        }

        override fun pullPaginationData(
          params: QuoteFeedParams,
          callback: DataSourceCallback,
        ) {
          chartIQViewModel.pagingCallback = callback
          dispatchOnPullPagingData(params)
        }
      })
    }

    chartIQ.start(startCallback)
  }

  companion object {
    private const val CROSSHAIRS_UPDATE_PERIOD = 300L
  }
}
