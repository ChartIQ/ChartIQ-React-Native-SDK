package com.chartiqwrapper

import android.util.Log
import android.view.View
import android.widget.LinearLayout
import com.chartiq.sdk.ChartIQ
import com.chartiq.sdk.DataSource
import com.chartiq.sdk.DataSourceCallback
import com.chartiq.sdk.model.QuoteFeedParams
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.google.gson.Gson


class ChartIqWrapperViewManager(private val chartIQViewModel: ChartIQViewModel) : SimpleViewManager<View>() {
  private val defaultUrl =
    "https://mobile.demo.chartiq.com/android/3.2.0/sample-template-native-sdk.html"
  var reactContext: ThemedReactContext? = null

  override fun getName() = "ChartIqWrapperView"

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any>? {
    return MapBuilder.of(
      "onPullInitialData",
      MapBuilder.of("registrationName", "onPullInitialData"),
      "onPullUpdateData",
      MapBuilder.of("registrationName", "onPullUpdateData"),
      "onPullPagingData",
      MapBuilder.of("registrationName", "onPullPagingData"),
      "onChartTypeChanged",
      MapBuilder.of("registrationName", "onChartTypeChanged"),
    )
  }

  override fun createViewInstance(reactContext: ThemedReactContext): View {
    this.reactContext = reactContext
    val chartIQ = ChartIQ.getInstance(defaultUrl, reactContext)
    chartIQViewModel.setChartIQ(chartIQ)
    dispatchOnChartTypeChanged()
//    chartIQViewModel.fetchCrosshairsState()
    return chartIQ.chartView.apply {
      layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT)
    }
  }

  @ReactMethod
  fun dispatchOnPullInitialData(params: QuoteFeedParams) {
    val event: WritableMap = Arguments.createMap()
    event.putString("quoteFeedParam", Gson().toJson(params))
    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      chartIQViewModel.getChartIQ().chartView.id,
      "onPullInitialData",
      event,
    )
  }

  @ReactMethod
  fun dispatchOnPullUpdateData(params: QuoteFeedParams) {
    val event: WritableMap = Arguments.createMap()
    event.putString("quoteFeedParam", Gson().toJson(params))
    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      chartIQViewModel.getChartIQ().chartView.id,
      "onPullUpdateData",
      event,
    )
  }

  @ReactMethod
  fun dispatchOnPullPagingData(params: QuoteFeedParams) {
    val event: WritableMap = Arguments.createMap()
    event.putString("quoteFeedParam", Gson().toJson(params))
    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      chartIQViewModel.getChartIQ().chartView.id,
      "onPullPagingData",
      event,
    )
  }

  @ReactMethod
  fun dispatchOnChartTypeChanged() {
    val event: WritableMap = Arguments.createMap()
    event.putString("chartType",
      chartIQViewModel.getChartIQ().getChartType{ chartType -> chartType?.value}.toString()
    )
    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      chartIQViewModel.getChartIQ().chartView.id,
      "onChartTypeChanged",
      event,
    )
  }

  private fun initDatasource() {
    chartIQViewModel.getChartIQ().apply {
      setDataSource(object : DataSource {
        override fun pullInitialData(
          params: QuoteFeedParams,
          callback: DataSourceCallback,
        ) {
          Log.println(Log.INFO, "asd", "pullInitial");
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
  }
}
