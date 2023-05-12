package com.chartiqwrapper

import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.lifecycle.MutableLiveData
import com.chartiq.sdk.model.*
import com.chartiq.sdk.model.charttype.ChartAggregationType
import com.chartiq.sdk.model.charttype.ChartType
import com.chartiq.sdk.model.drawingtool.DrawingParameterType
import com.chartiq.sdk.model.drawingtool.DrawingTool
import com.chartiq.sdk.model.study.Study
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.Gson
import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.*
import java.lang.Runnable
import java.util.*


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
        chartIQViewModel.updateCallback?.execute(data)
      })
    }
  }

  @ReactMethod
  fun setPagingData(data: String) {
    val data = formatOHLC(data)
    if (data != null) {
      handler.post(Runnable {
        chartIQViewModel.pagingCallback?.execute(data)
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
  fun enableDrawing(tool: String) {
    val newTool = DrawingTool.values().find {
      it.value == tool
    }
    if (newTool !== null) {
      handler.post(Runnable {
        chartIQViewModel.getChartIQ().enableDrawing(newTool)
      })
    }
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
        it.getPeriodicity { periodicity ->
          it.getInterval { interval ->
            it.getTimeUnit { timeUnit ->

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
      chartIQViewModel.getChartIQ().getActiveSeries { symbols ->
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
      chartIQViewModel.getChartIQ().getChartAggregationType { symbols ->
        symbols.let {
          promise.resolve(it?.value)
        }
      }
    })
  }

  @ReactMethod
  fun setAggregationType(type: String) {
    val aggregationType = ChartAggregationType.values().find {
      it.value == type
    }

    if(aggregationType != null){
      handler.post(Runnable {
        chartIQViewModel.getChartIQ()
          .setAggregationType(aggregationType)
      })
    }

  }

  @ReactMethod
  fun getDrawingParams(tool: String, promise: Promise) {
    val drawingTool = DrawingTool.values().find {
      it.value == tool
    }
    if (drawingTool != null) {
      handler.post(Runnable {
        chartIQViewModel.getChartIQ().getDrawingParameters(drawingTool) {
          promise.resolve(gson.toJson(it))
        }
      })
    }
  }

  @ReactMethod
  fun setDrawingParams(parameterName: String, value: String) {
    val drawingParameter = DrawingParameterType.values().find {
      it.value == parameterName
    }

    if (drawingParameter != null) {
      handler.post(Runnable {
        chartIQViewModel.getChartIQ().setDrawingParameter(drawingParameter, value)
      })
    }
  }

  @ReactMethod
  fun clearDrawing() {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().clearDrawing()
    })
  }

  @ReactMethod
  fun restoreDefaultDrawingConfig(tool: String, all: Boolean) {
    val drawingTool = DrawingTool.values().find {
      it.value == tool
    }

    if (drawingTool != null) {
      handler.post(Runnable {
        chartIQViewModel.getChartIQ().restoreDefaultDrawingConfig(drawingTool, all)
      })
    }

  }

  @ReactMethod
  fun deleteDrawing() {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().deleteDrawing()
    })
  }

  @ReactMethod
  fun undoDrawing(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().undoDrawing { value ->
        promise.resolve(value)
      }
    })
  }

  @ReactMethod
  fun redoDrawing(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().redoDrawing { value ->
        promise.resolve(value)
      }
    })
  }

  @ReactMethod
  fun getStudyList(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getStudyList { study ->
        study.forEach {
          Log.println(Log.DEBUG, "STUDY", it.parameters.toString())
        }
        promise.resolve(gson.toJson(study))
      }
    })
  }

  @ReactMethod
  fun setIsInvertYAxis(inverted: Boolean) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().setIsInvertYAxis(inverted)
    })
  }

  @ReactMethod
  fun getIsInvertYAxis(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getIsInvertYAxis {
        promise.resolve(it)
      }
    })
  }

  @ReactMethod
  fun getChartScale(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getChartScale {
        promise.resolve(gson.toJson(it))
      }
    })
  }

  @ReactMethod
  fun setChartScale(scale: String) {
    val chartScale = ChartScale.values().find {
      it.value == scale
    }

    if (chartScale != null) {
      handler.post(Runnable {
        chartIQViewModel.getChartIQ().setChartScale(chartScale)
      })
    }
  }

  @ReactMethod
  fun setTheme(theme: String) {
    val chartTheme = ChartTheme.values().find {
      it.value == theme
    }

    if (chartTheme != null) {
      handler.post(Runnable {
        chartIQViewModel.getChartIQ().setTheme(chartTheme)
      })
    } else {
      setTheme(ChartTheme.NONE.toString())
    }
  }

  @ReactMethod
  fun getExtendedHours(promise: Promise){
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getIsExtendedHours() {
        promise.resolve(it)
      }
    })
  }

  @ReactMethod
  fun setExtendedHours(extendedHours: Boolean){
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().setExtendedHours(extendedHours)
    })
  }



  private fun formatOHLC(input: String): List<OHLCParams>? {
    return gson.fromJson<List<OHLCParams>>(
      input, object : TypeToken<List<OHLCParams>>() {}.type
    )
  }


}
