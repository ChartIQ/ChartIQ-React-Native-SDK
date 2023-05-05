package com.chartiqwrapper

import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.lifecycle.MutableLiveData
import com.chartiq.sdk.model.CrosshairHUD
import com.chartiq.sdk.model.OHLCParams
import com.chartiq.sdk.model.Series
import com.chartiq.sdk.model.TimeUnit
import com.chartiq.sdk.model.charttype.ChartAggregationType
import com.chartiq.sdk.model.charttype.ChartType
import com.chartiq.sdk.model.drawingtool.DrawingTool
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.Gson
import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.*
import java.lang.Runnable


class ChartIQWrapperModule(private val chartIQViewModel: ChartIQViewModel) :
  ReactContextBaseJavaModule() {
  private val gson = Gson()
  private val handler = Handler(Looper.getMainLooper())

  override fun getName(): String {
    return "ChartIQWrapperModule"
  }


  @ReactMethod
  fun setInitialData(data: String) {
    val data = formatOHLC(data)
    if (data != null) {
      val handler = Handler(Looper.getMainLooper())
      handler.post(Runnable {
        chartIQViewModel.initialCallback?.execute(data)
      })
    }
  }

  @ReactMethod
  fun setUpdateData(data: String) {
    val data = formatOHLC(data)
    if (data != null) {
      val handler = Handler(Looper.getMainLooper())
      handler.post(Runnable {
        chartIQViewModel.initialCallback?.execute(data)
      })
    }
  }

  @ReactMethod
  fun setPagingData(data: String) {
    val data = formatOHLC(data)
    if (data != null) {
      handler.post(Runnable {
        chartIQViewModel.initialCallback?.execute(data)
      })
    }
  }

  @ReactMethod
  fun setSymbol(symbol: String) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().setSymbol(symbol)
    })
  }

  @ReactMethod
  fun setPeriodicity(period: Int, interval: String, timeUnit: String) {

    handler.post(Runnable {
      chartIQViewModel.getChartIQ().setPeriodicity(period, interval, TimeUnit.valueOf(timeUnit))
    })
  }

  @ReactMethod
  fun enableCrosshairs() {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().enableCrosshairs()
    })
  }

  @ReactMethod
  fun disableCrosshairs() {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().disableCrosshairs()
    })
  }

  @ReactMethod
  fun enableDrawing(tool: DrawingTool) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().enableDrawing(tool)
    })
  }

  @ReactMethod
  fun disableDrawing() {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().disableDrawing()
    })
  }

  @ReactMethod
  fun setChartStyle(
    obj: String, attribute: String, value: String
  ) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().setChartStyle(obj, attribute, value)
    })
  }

  @ReactMethod
  fun setChartType(type: String) {
    val newType = ChartType.values().find {
      it.value == type
    }

    if (newType != null) {
      handler.post(Runnable {
        chartIQViewModel.getChartIQ().setChartType(newType)
      })

      return
    }

    handler.post(Runnable {
      chartIQViewModel.getChartIQ().setChartType(ChartType.CANDLE)
    })
  }

  @ReactMethod
  fun getChartType(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getChartType { chartType ->
        chartType.let {
          promise.resolve(it?.value)
        }
      }
    })
  }

  @ReactMethod
  fun addSeries(
    symbol: String,
    color: String,
    isComparison: Boolean,
  ) {
    val series = Series(symbol, color)
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().addSeries(series, isComparison)
    })
  }

  @ReactMethod
  fun getSymbol(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getSymbol { symbol ->
        symbol.let {
          promise.resolve(it)
        }
      }
    })
  }

  @ReactMethod
  fun getPeriodicity(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().let {
        it.getPeriodicity{periodicity ->
          it.getInterval{interval ->
            it.getTimeUnit{timeUnit ->

              var response = JsonObject().apply {
                addProperty("periodicity", periodicity)
                addProperty("interval", interval)
                addProperty("timeUnit", timeUnit)
              }

              promise.resolve(response.toString())
            }
          }
        }
      }
    })
  }

  @ReactMethod
  fun getActiveSeries(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getActiveSeries() { symbols ->
        symbols.let {
          promise.resolve(gson.toJson(it))
        }
      }
    })
  }

  @ReactMethod
  fun removeSeries(symbolName: String) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().removeSeries(symbolName)
    })
  }

  @ReactMethod
  fun getChartAggregationType(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getChartAggregationType() { symbols ->
        symbols.let {
          promise.resolve(it?.value)
        }
      }
    })
  }

  @ReactMethod
  fun setAggregationType(aggregationType: String){
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().setAggregationType(ChartAggregationType.valueOf(aggregationType))
    })
  }

  private fun formatOHLC(input: String): List<OHLCParams>? {
    return gson.fromJson<List<OHLCParams>>(
      input, object : TypeToken<List<OHLCParams>>() {}.type
    )
  }


}
