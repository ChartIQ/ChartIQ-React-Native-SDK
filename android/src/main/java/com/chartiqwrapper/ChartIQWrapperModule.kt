package com.chartiqwrapper

import android.os.Handler
import android.os.Looper
import android.util.Log
import com.chartiq.sdk.model.*
import com.chartiq.sdk.model.charttype.ChartAggregationType
import com.chartiq.sdk.model.charttype.ChartType
import com.chartiq.sdk.model.drawingtool.DrawingParameterType
import com.chartiq.sdk.model.drawingtool.DrawingTool
import com.chartiq.sdk.model.signal.Signal
import com.chartiq.sdk.model.study.Study
import com.chartiq.sdk.model.study.StudyParameterModel
import com.chartiq.sdk.model.study.StudyParameterType
import com.facebook.react.bridge.*
import com.google.gson.Gson
import com.google.gson.JsonArray
import com.google.gson.JsonObject
import com.google.gson.reflect.TypeToken
import java.lang.Runnable
import java.text.SimpleDateFormat
import java.util.*


class ChartIQWrapperModule(private val chartIQViewModel: ChartIQViewModel) :
  ReactContextBaseJavaModule() {
  private val gson = Gson()
  private val handler = Handler(Looper.getMainLooper())

  override fun getName(): String {
    return "ChartIQWrapperModule"
  }


  @ReactMethod
  fun setInitialData(data: ReadableArray, id: String) {
      val data = formatOHLC(data)
      if (data != null) {
        val handler = Handler(Looper.getMainLooper())
        handler.post(Runnable {
          chartIQViewModel.initialCallbacks.find { it.id == id }?.let {
            it.callback.execute(data)
          }})
      }
  }

  @ReactMethod
  fun setUpdateData(data: ReadableArray, id: String) {
    val data = formatOHLC(data)
    if (data != null) {
      val handler = Handler(Looper.getMainLooper())
      handler.post(Runnable {
        chartIQViewModel.updateCallbacks.find { it.id == id }?.let {
          it.callback.execute(data)
        }})
    }
  }

  @ReactMethod
  fun setPagingData(data: ReadableArray, id: String) {
    val data = formatOHLC(data)
    if (data != null) {
      handler.post(Runnable {
        chartIQViewModel.pagingCallbacks.find { it.id == id }?.let {
          it.callback.execute(data)
        }})
    }
  }

  @ReactMethod
  fun setSymbol(symbol: String) {
    handler.post(Runnable {
      Log.println(Log.INFO, "SET_SYMBOL", "setSymbol: $symbol")
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
                val map = Arguments.createMap().apply {
                  putInt("periodicity", periodicity)
                  if(interval == "\"day\"" || interval == "\"week\"" || interval == "\"month\""){
                    putString("interval", "1")
                    putString("timeUnit", interval.replace("\"", "").uppercase())
                  } else {
                    putString("interval", interval)
                    putString("timeUnit", timeUnit)
                  }
                }
              promise.resolve(map)
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
        val array = Arguments.createArray()
        symbols.forEach {
          val map = Arguments.createMap().apply {
            putString("symbol", it.symbolName)
            putString("color", it.color)
          }
          array.pushMap(map)
        }
        promise.resolve(array)
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

    if (aggregationType != null) {
      handler.post(Runnable {
        chartIQViewModel.getChartIQ().setAggregationType(aggregationType)
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
      chartIQViewModel.getChartIQ().getStudyList { studies ->
        val formattedStudies = formatStudies(studies)
        promise.resolve(formattedStudies)
      }
    })
  }

  @ReactMethod
  fun getActiveStudies(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getActiveStudies { studies ->
        val formattedStudies = formatStudies(studies)
        promise.resolve(formattedStudies)}
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
  fun getExtendedHours(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getIsExtendedHours {
        promise.resolve(it)
      }
    })
  }

  @ReactMethod
  fun setExtendedHours(extendedHours: Boolean) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().setExtendedHours(extendedHours)
    })
  }

  @ReactMethod
  fun addStudy(study: String, isClone: Boolean) {
    val parsedStudy = gson.fromJson(study, Study::class.java)

    handler.post(Runnable {
      chartIQViewModel.getChartIQ().addStudy(parsedStudy, isClone)
    })
  }

  @ReactMethod
  fun getStudyParameters(study: String, type: String, promise: Promise) {
    val parsedStudy = gson.fromJson(study, Study::class.java)
    val parsedType = StudyParameterType.values().find {
      it.name == type
    }
    if (parsedStudy != null && parsedType != null) {
      handler.post(Runnable {
        chartIQViewModel.getChartIQ().getStudyParameters(parsedStudy, parsedType) {
          val jsonArray = JsonArray()
          for(field in it){
            val fieldType = field.javaClass.name.split('$')[1]
            val jsonObject = JsonObject()
            jsonObject.addProperty("fieldType", fieldType)
            jsonObject.addProperty("fieldValue", gson.toJson(field))
            jsonArray.add(jsonObject)
          }
          promise.resolve(gson.toJson(jsonArray))
        }
      })
    }
  }

  @ReactMethod
  fun setStudyParameter(study: String, parameter: String, promise: Promise) {
    val parsedStudy = gson.fromJson(study, Study::class.java)
    val parsedParameter = gson.fromJson(parameter, StudyParameterModel::class.java)

    handler.post(Runnable {
      chartIQViewModel.getChartIQ().setStudyParameter(parsedStudy, parsedParameter)
    })
  }

  @ReactMethod
  fun setStudyParameters(study: String, parameters: String, promise: Promise) {
    val parsedStudy = gson.fromJson(study, Study::class.java)
    val collectionType = object : TypeToken<List<StudyParameterModel>>() {}.type
    val parsedParameters = gson.fromJson<List<StudyParameterModel>>(parameters, collectionType)
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().setStudyParameters(parsedStudy, parsedParameters) {
        promise.resolve(gson.toJson(it))
      }
    })
  }

  @ReactMethod
  fun removeStudy(study: String) {
    val parsedStudy = gson.fromJson(study, Study::class.java)

    handler.post(Runnable {
      chartIQViewModel.getChartIQ().removeStudy(parsedStudy)
    })
  }

  @ReactMethod
  fun getActiveSignals(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getActiveSignals {
        promise.resolve(gson.toJson(it))
      }
    })
  }

  @ReactMethod
  fun addSignalStudy(name: String, promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().addSignalStudy(name) {
        promise.resolve(gson.toJson(it))
      }
    })
  }

  @ReactMethod
  fun addSignal(signal: String,editMode: Boolean) {
    val parsedSignal = gson.fromJson(signal, Signal::class.java)

    if (parsedSignal != null) {
      handler.post(Runnable {
        chartIQViewModel.getChartIQ().saveSignal(parsedSignal, editMode)
      })
    }
  }

  @ReactMethod
  fun toggleSignal(signal: String) {
    val parsedSignal = gson.fromJson(signal, Signal::class.java)

    if(parsedSignal != null) {
      handler.post(Runnable {
        chartIQViewModel.getChartIQ().toggleSignal(parsedSignal)
      })
    }
  }

  @ReactMethod
  fun removeSignal(signal: String) {
    val parsedSignal = gson.fromJson(signal, Signal::class.java)

    if(parsedSignal != null) {
      handler.post(Runnable {
        chartIQViewModel.getChartIQ().removeSignal(parsedSignal)
      })
    }
  }

  @ReactMethod
  fun getTranslations(languageCode: String, promise: Promise){
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getTranslations(languageCode){
        promise.resolve(gson.toJson(it))
      }
    })
  }

  @ReactMethod
  fun setLanguage(languageCode: String){
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().setLanguage(languageCode)
    })
  }



  private fun formatOHLC(input: ReadableArray): List<OHLCParams> {
    var list = mutableListOf<OHLCParams>()
    input.toArrayList().forEach() { item  ->
      if(item is HashMap<*, *>) {
        val dt = item["DT"] as String?
        val open = item["Open"] as Double?
        val high = item["High"] as Double?
        val low = item["Low"]   as Double?
        val close = item["Close"] as Double?
        val volume = item["Volume"] as Double?
        val adjClose = item["Adj_Close"] as Double?
        val localDate = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").parse(dt)
        val date = Date(localDate.time)
        OHLCParams(date, open, high, low, close, volume, adjClose).let {
          list.add(it)
        }
      }
    }

    return list
  }

  private fun formatStudies(studies: List<Study>): WritableArray{
      var array = Arguments.createArray()
      studies.forEach {
        val map = Arguments.createMap().apply {
          putString("name", it.name)
          putString("shortName", it.shortName)
          putString("display", it.display)
          putDouble("centerLine", it.centerLine)
          putString("range", it.range)
          putString("type", it.type)
          putBoolean("overlay", it.overlay)
          putBoolean("signalIQExclude", it.signalIQExclude)
          putBoolean("customRemoval", it.customRemoval)
          putMap("inputs", Arguments.makeNativeMap(it.inputs))
          putMap("outputs", Arguments.makeNativeMap(it.outputs))
          putMap("parameters", Arguments.makeNativeMap(it.parameters))
          putMap("attributes", Arguments.makeNativeMap(it.attributes))
          putMap("yAxis", Arguments.makeNativeMap(it.yAxis))
        }
        array.pushMap(map)
      }
        return array
    }
}
