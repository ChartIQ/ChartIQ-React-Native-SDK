package com.chartiqwrapper

import android.content.pm.ApplicationInfo
import android.util.Log
import android.view.View
import android.widget.LinearLayout
import androidx.lifecycle.MutableLiveData
import com.chartiq.sdk.ChartIQ
import com.chartiq.sdk.DataSource
import com.chartiq.sdk.DataSourceCallback
import com.chartiq.sdk.OnStartCallback
import com.chartiq.sdk.model.CrosshairHUD
import com.chartiq.sdk.model.QuoteFeedParams
import com.chartiq.sdk.model.drawingtool.DrawingTool
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.google.gson.Gson
import kotlinx.coroutines.*


class ChartIqWrapperViewManager(private val chartIQViewModel: ChartIQViewModel) :
  SimpleViewManager<View>() {
  private val defaultUrl =
    "https://mobile.demo.chartiq.com/android/3.2.0/sample-template-native-sdk.html"
  private val gson: Gson = Gson()
  private var reactContext: ThemedReactContext? = null
  private lateinit var chartIQ: ChartIQ
  private val job = Job()
  private val chartScope = CoroutineScope(job + Dispatchers.IO)
  var startCallback: OnStartCallback = OnStartCallback {
    dispatchStart()
  }
  override fun getName() = "ChartIqWrapperView"

  val crosshairsHUD = MutableLiveData<CrosshairHUD>()
  val crosshairsEnabled = MutableLiveData(false)

  fun fetchCrosshairsState() {
    launchCrosshairsUpdate()
  }

  private fun getHUDDetails() {
    chartIQ.getHUDDetails { hud ->
      crosshairsHUD.value = hud
      Log.println(Log.INFO, "HUD_CHANGED", hud.toString())
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

  override fun createViewInstance(reactContext: ThemedReactContext): View {
    this.reactContext = reactContext
    chartIQ = ChartIQ.getInstance(defaultUrl, reactContext)
    chartIQViewModel.setChartIQ(chartIQ)
    initDatasource()
    dispatchOnChartTypeChanged()
    dispatchOnChartAggregationTypeChanged()
    fetchCrosshairsState()
    addMeasureListener()
    Log.println(Log.INFO, "FLAG_DEBUGGABLE", ApplicationInfo.FLAG_DEBUGGABLE.toString())
    return chartIQ.chartView.apply {
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT
      )
    }
  }

  @ReactMethod
  fun dispatchStart() {
    val event: WritableMap = Arguments.createMap()
    event.putString("started", "true")
    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      chartIQ.chartView.id,
      "onStart",
      event,
    )
  }

  @ReactMethod
  fun dispatchOnPullInitialData(params: QuoteFeedParams) {
    val event: WritableMap = Arguments.createMap()
    event.putString("quoteFeedParam", Gson().toJson(params))
    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      chartIQ.chartView.id,
      "onPullInitialData",
      event,
    )
  }

  @ReactMethod
  fun dispatchOnPullUpdateData(params: QuoteFeedParams) {
    val event: WritableMap = Arguments.createMap()
    event.putString("quoteFeedParam", Gson().toJson(params))
    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      chartIQ.chartView.id,
      "onPullUpdateData",
      event,
    )
  }

  @ReactMethod
  fun dispatchOnPullPagingData(params: QuoteFeedParams) {
    val event: WritableMap = Arguments.createMap()
    event.putString("quoteFeedParam", Gson().toJson(params))
    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      chartIQ.chartView.id,
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
      chartIQ.chartView.id,
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
     Log.println(Log.INFO, "AGGREGATION_TYPE", response.toString() )
     reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
       chartIQ.chartView.id,
       "onChartAggregationTypeChanged",
       event,
     )
   }

  }

  @ReactMethod
  fun dispatchOnHUDChanged(hud: CrosshairHUD) {
    val event: WritableMap = Arguments.createMap().apply {
      putString("hud", gson.toJson(hud))
    }

    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      chartIQ.chartView.id,
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
      chartIQ.chartView.id,
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
          Log.println(Log.INFO, "asd", "pullInitial")
          chartIQViewModel.initialCallback = callback
          dispatchOnPullInitialData(params)
        }

        override fun pullUpdateData(
          params: QuoteFeedParams,
          callback: DataSourceCallback,
        ) {
          Log.println(Log.INFO, "asd", "pullUpdateData")
          chartIQViewModel.updateCallback = callback
          dispatchOnPullUpdateData(params)
        }

        override fun pullPaginationData(
          params: QuoteFeedParams,
          callback: DataSourceCallback,
        ) {
          Log.println(Log.INFO, "asd", "pullPaginationData")
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
