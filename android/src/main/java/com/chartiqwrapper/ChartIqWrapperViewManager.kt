package com.chartiqwrapper

import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout

import com.chartiq.sdk.ChartIQ
import com.chartiq.sdk.DataSource
import com.chartiq.sdk.DataSourceCallback
import com.chartiq.sdk.model.DataMethod
import com.chartiq.sdk.model.QuoteFeedParams
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.google.gson.Gson


class ChartIqWrapperViewManager(private val chartIQViewModel: ChartIQViewModel) :
  SimpleViewManager<View>() {
  private val gson: Gson = Gson()
  private var reactContext: ThemedReactContext? = null
  private lateinit var chartIQ: ChartIQ
  private lateinit var view: LinearLayout

  private var url: String = ""
  override fun getName() = "ChartIqWrapperView"

  @ReactProp(name = "url")
  fun setUrl(view: ViewGroup, url: String?) {
    if (url != null) {
      this.url = url
      initChartIQ(view)
    }
  }

  @ReactProp(name = "dataMethod")
  fun setDataMethod(view: ViewGroup, dataMethod: String?) {
    if (!this::chartIQ.isInitialized) {
      android.util.Log.w("ChartIQ", "ChartIQ not initialized yet, skipping dataMethod update")
      return
    }

    chartIQ.getSymbol { symbol ->
      if (dataMethod != null) {
        if (dataMethod == "push") {
          chartIQ.setDataMethod(DataMethod.PUSH, symbol)
        } else {
          chartIQ.setDataMethod(DataMethod.PULL, symbol)
        }
      } else {
        chartIQ.setDataMethod(DataMethod.PULL, symbol)
      }
    }
  }

  private fun addMeasureListener() {
    chartIQ.addMeasureListener { measure ->
      dispatchOnMeasureChanged(measure)
    }
  }

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, MutableMap<String, String>>? {
    return mapOf(
      "onPullInitialData" to MapBuilder.of("registrationName", "onPullInitialData"),
      "onPullUpdateData" to MapBuilder.of("registrationName", "onPullUpdateData"),
      "onPullPagingData" to MapBuilder.of("registrationName", "onPullPagingData"),
      "onChartTypeChanged" to MapBuilder.of("registrationName", "onChartTypeChanged"),
      "onMeasureChanged" to MapBuilder.of("registrationName", "onMeasureChanged"),
      "onChartAggregationTypeChanged" to MapBuilder.of(
        "registrationName",
        "onChartAggregationTypeChanged"
      ),
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

  private fun initChartIQ(view: ViewGroup) {
    if (reactContext != null) {
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

  fun createQuoteFeedMap(params: QuoteFeedParams, id: String): WritableMap {
    try {
      var map = Arguments.createMap().apply {
        putString("end", params.end)
        putString("start", params.start)
        putString("interval", params.interval)
        putString("symbol", params.symbol)
        putInt("period", params.period!!)
        putString("id", id)
        
        if (params.meta != null && params.meta is String) {
          val meta = gson.fromJson(params.meta as String, Map::class.java)
          putMap("meta", Arguments.makeNativeMap(meta as Map<String, Any>))
        }
      }
      return Arguments.createMap().apply {
        putMap("quoteFeedParam", map)
      }
    } catch (error: Exception) {
      throw error
    }
  }

  @ReactMethod
  fun dispatchOnPullInitialData(params: QuoteFeedParams, id: String) {
    val event: WritableMap = createQuoteFeedMap(params, id)

    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      view.id,
      "onPullInitialData",
      event,
    )
  }

  @ReactMethod
  fun dispatchOnPullUpdateData(params: QuoteFeedParams, id: String) {
    val event: WritableMap = createQuoteFeedMap(params, id)

    reactContext?.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
      view.id,
      "onPullUpdateData",
      event,
    )
  }

  @ReactMethod
  fun dispatchOnPullPagingData(params: QuoteFeedParams, id: String) {
    val event: WritableMap = createQuoteFeedMap(params, id)

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
  fun dispatchOnChartAggregationTypeChanged() {
    val event: WritableMap = Arguments.createMap()
    chartIQ.getChartAggregationType { aggregationType ->

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
  fun dispatchOnMeasureChanged(measure: String) {
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
          chartIQViewModel.initialCallbacks.add(RNDataSourceCallback(callback, params.callbackId!!))
          dispatchOnPullInitialData(params, params.callbackId!!)
        }

        override fun pullUpdateData(
          params: QuoteFeedParams,
          callback: DataSourceCallback,
        ) {
          chartIQViewModel.updateCallbacks.add(RNDataSourceCallback(callback, params.callbackId!!))
          dispatchOnPullUpdateData(params, params.callbackId!!)
        }

        override fun pullPaginationData(
          params: QuoteFeedParams,
          callback: DataSourceCallback,
        ) {
          chartIQViewModel.pagingCallbacks.add(RNDataSourceCallback(callback, params.callbackId!!))
          dispatchOnPullPagingData(params, params.callbackId!!)
        }
      })

      start {
        dispatchStart()
      }
    }
  }
}
