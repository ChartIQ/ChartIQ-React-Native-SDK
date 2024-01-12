package com.chartiqwrapper

import android.os.Handler
import android.os.Looper
import android.util.Log
import com.chartiq.sdk.model.*
import com.chartiq.sdk.model.charttype.ChartAggregationType
import com.chartiq.sdk.model.charttype.ChartType
import com.chartiq.sdk.model.drawingtool.DrawingParameterType
import com.chartiq.sdk.model.drawingtool.DrawingTool
import com.chartiq.sdk.model.signal.*
import com.chartiq.sdk.model.study.Study
import com.chartiq.sdk.model.study.StudyParameterModel
import com.chartiq.sdk.model.study.StudyParameterType
import com.facebook.react.bridge.*
import com.google.gson.Gson
import com.google.gson.JsonArray
import com.google.gson.JsonObject
import java.lang.Runnable
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.HashMap


class ChartIQWrapperModule(private val chartIQViewModel: ChartIQViewModel) :
  ReactContextBaseJavaModule() {
  private val gson = Gson()
  private val handler = Handler(Looper.getMainLooper())

  override fun getName(): String {
    return "ChartIQWrapperModule"
  }

  @ReactMethod
  fun setSymbol(symbol: String, promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().setSymbol(symbol)
    })
  }

  @ReactMethod
  fun setInitialData(data: ReadableArray, id: String) {
    if (data != null) {
      val handler = Handler(Looper.getMainLooper())
      handler.post(Runnable {
        chartIQViewModel.initialCallbacks.find { it.id == id }?.let {
          it.callback.execute(data.toOHCLList())
        }
      })
    }
  }

  @ReactMethod
  fun setUpdateData(data: ReadableArray, id: String) {
    if (data != null) {
      val handler = Handler(Looper.getMainLooper())
      handler.post(Runnable {
        chartIQViewModel.updateCallbacks.find { it.id == id }?.let {
          it.callback.execute(data.toOHCLList())
        }
      })
    }
  }

  @ReactMethod
  fun setPagingData(data: ReadableArray, id: String) {
    if (data != null) {
      handler.post(Runnable {
        chartIQViewModel.pagingCallbacks.find { it.id == id }?.let {
          it.callback.execute(data.toOHCLList())
        }
      })
    }
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
  fun getHudDetails(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getHUDDetails() { hudDetails ->
        hudDetails.let {
          val response = Arguments.createMap().apply {
            putString("open", it.open)
            putString("high", it.high)
            putString("low", it.low)
            putString("close", it.close)
            putString("volume", it.volume)
            putString("price", it.price)
          }
          promise.resolve(response)
        }
      }
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
    var newType = ChartType.values().find {
      it.value == type
    }
    if (type == "Vertex Line") {
      newType = ChartType.VERTEX_LINE
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
                if (interval == "\"day\"" || interval == "\"week\"" || interval == "\"month\"") {
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
            putString("symbolName", it.symbolName)
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
  fun setDrawingParams(input: ReadableMap) {
    val parameterName = input.getString("parameterName")

    val value = when (input.getString("type")) {
      "boolean" -> {
        input.getBoolean("value")
      }
      else -> input.getString("value")
    }

    if (parameterName != null && value != null) {
      handler.post(Runnable {
        chartIQViewModel.getChartIQ().setDrawingParameter(parameterName, value)
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

        val formattedStudies = studies.toWritableArray()
        promise.resolve(formattedStudies)
      }
    })
  }

  @ReactMethod
  fun getActiveStudies(promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getActiveStudies { studies ->
        val formattedStudies = studies.toWritableArray()
        promise.resolve(formattedStudies)
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
        promise.resolve(it.value.lowercase())
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
  fun addStudy(study: ReadableMap, isClone: Boolean) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().addStudy(study.toChartIQStudy(), isClone)
    })
  }

  @ReactMethod
  fun getStudyParameters(study: ReadableMap, type: String, promise: Promise) {
    val parsedType = StudyParameterType.values().find {
      it.name == type
    }
    if (parsedType != null) {
      handler.post(Runnable {
        chartIQViewModel.getChartIQ().getStudyParameters(study.toChartIQStudy(), parsedType) {
          val jsonArray = JsonArray()
          for (field in it) {
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
  fun setStudyParameter(study: ReadableMap, parameter: ReadableMap, promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ()
        .setStudyParameter(study.toChartIQStudy(), parameter.toStudyParameterModel())
    })
  }

  @ReactMethod
  fun setStudyParameters(study: ReadableMap, parameters: ReadableArray, promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ()
        .setStudyParameters(study.toChartIQStudy(), parameters.toStudyParameterModelList()) {
          val studySimplified = Arguments.createMap()
          studySimplified.putString("name", it.studyName)
          studySimplified.putString("shortName", it.studyName)
          studySimplified.putString("type", it.type)
          studySimplified.putMap("outputs", it.outputs?.toReadableMap())

          promise.resolve(studySimplified)
        }
    })
  }

  @ReactMethod
  fun removeStudy(study: ReadableMap) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().removeStudy(study.toChartIQStudy())
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
  fun addSignal(signal: ReadableMap, editMode: Boolean) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().saveSignal(signal.toSignal(), editMode)
    })
  }

  @ReactMethod
  fun toggleSignal(signal: ReadableMap) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().toggleSignal(signal.toSignal())
    })
  }

  @ReactMethod
  fun removeSignal(signal: ReadableMap) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().removeSignal(signal.toSignal())
    })
  }

  @ReactMethod
  fun getTranslations(languageCode: String, promise: Promise) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().getTranslations(languageCode) {
        promise.resolve(gson.toJson(it))
      }
    })
  }

  @ReactMethod
  fun setLanguage(languageCode: String) {
    handler.post(Runnable {
      chartIQViewModel.getChartIQ().setLanguage(languageCode)
    })
  }
}

private fun List<Study>.toWritableArray(): WritableArray {
  var array = Arguments.createArray()
  this.forEach {
    val map = Arguments.createMap().apply {
      putString("name", it.name)
      putString("shortName", it.shortName)
      putString("display", it.display?.ifBlank { it.name } ?: it.name)
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
      putBoolean("deferUpdate", it.deferUpdate)
      putBoolean("underlay", it.underlay)
    }
    array.pushMap(map)
  }
  return array
}

private fun ReadableMap.toChartIQStudy(): Study {
  val name = this.getString("name") as String
  val shortName = this.getString("shortName") as String
  val display = this.getString("display") as String
  val centerLine = this.getDouble("centerLine")
  val range = this.getString("range")
  val type = this.getString("type")
  val overlay = this.getBoolean("overlay")
  val signalIQExclude = this.getBoolean("signalIQExclude")
  val customRemoval = this.getBoolean("customRemoval")
  val inputs = this.getMap("inputs")?.toHashMap()
  val outputs = this.getMap("outputs")?.toHashMap()
  val parameters = this.getMap("parameters")?.toHashMap() as Map<String, String>
  val attributes = this.getMap("attributes")?.toHashMap()
  val yAxis = this.getMap("yAxis")?.toHashMap()
  val deferUpdate = this.getBoolean("deferUpdate")
  val underlay = this.getBoolean("underlay")

  return Study(
    name,
    attributes,
    centerLine,
    customRemoval,
    deferUpdate,
    display,
    inputs,
    outputs,
    overlay,
    parameters,
    range,
    shortName,
    type,
    underlay,
    yAxis,
    signalIQExclude,
  )
}

private fun ReadableMap.toStudyParameterModel(): StudyParameterModel {
  val name = this.getString("fieldName") as String
  val value = this.getString("fieldSelectedValue") as String

  return StudyParameterModel(name, value)
}

private fun ReadableArray.toStudyParameterModelList(): List<StudyParameterModel> {
  var list = mutableListOf<StudyParameterModel>()
  this.toArrayList().forEach() { item ->
    if (item is HashMap<*, *>) {
      val name = item["fieldName"] as String
      val value = item["fieldSelectedValue"] as String
      StudyParameterModel(name, value).let {
        list.add(it)
      }
    }
  }

  return list
}

private fun ReadableArray.toOHCLList(): List<OHLCParams> {
  var list = mutableListOf<OHLCParams>()
  this.toArrayList().forEach() { item ->
    if (item is HashMap<*, *>) {
      val dt = item["DT"] as String?
      val open = item["Open"] as Double?
      val high = item["High"] as Double?
      val low = item["Low"] as Double?
      val close = item["Close"] as Double?
      val volume = item["Volume"] as Double?
      val adjClose = item["Adj_Close"] as Double?
      val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
      dateFormat.timeZone = TimeZone.getTimeZone("UTC")
      val localDate = dt?.let { dateFormat.parse(it) }
      if (localDate != null) {
        OHLCParams(localDate, open, high, low, close, volume, adjClose).let {
          list.add(it)
        }
      }
    }
  }

  return list
}

private fun HashMap<*, *>.toMarkerOption(): MarkerOption {
  val type = (this["type"] as String)!!.toSignalMarkerType()
  val color = this["color"] as String
  val signalShape = (this["signalShape"] as String)!!.toSignalShape()
  val signalSize = (this["signalSize"] as String)!!.toSignalMarkerSize()
  val label = this["label"] as String
  val signalPosition = (this["signalPosition"] as String)!!.toSignalPosition()

  return MarkerOption(type, color, signalShape, signalSize, label, signalPosition)
}

private fun String.toSignalMarkerType(): SignalMarkerType {
  return when (this) {
    "MARKER" -> SignalMarkerType.MARKER
    "PAINTBAR" -> SignalMarkerType.PAINTBAR
    else -> SignalMarkerType.MARKER
  }
}

private fun String.toSignalShape(): SignalShape {
  return when (this) {
    "CIRCLE" -> SignalShape.CIRCLE
    "SQUARE" -> SignalShape.SQUARE
    "DIAMOND" -> SignalShape.DIAMOND
    else -> SignalShape.CIRCLE
  }
}

private fun String.toSignalMarkerSize(): SignalSize {
  return when (this) {
    "S" -> SignalSize.S
    "M" -> SignalSize.M
    "L" -> SignalSize.L
    else -> SignalSize.S
  }
}

private fun String.toSignalPosition(): SignalPosition {
  return when (this) {
    "ABOVE_CANDLE" -> SignalPosition.ABOVE_CANDLE
    "BELOW_CANDLE" -> SignalPosition.BELOW_CANDLE
    "ON_CANDLE" -> SignalPosition.ON_CANDLE
    else -> SignalPosition.ON_CANDLE
  }
}

private fun HashMap<*, *>.toCondition(): Condition {
  val leftIndicator = this["leftIndicator"] as String
  val rightIndicator = this["rightIndicator"] as? String
  val signalOperator = (this["signalOperator"] as String)!!.toSignalOperator()
  val markerOption = (this["markerOption"] as HashMap<*, *>)!!.toMarkerOption()

  return Condition(leftIndicator, rightIndicator, signalOperator, markerOption)
}

private fun ReadableArray.toConditionList(): List<Condition> {
  var list = mutableListOf<Condition>()
  this.toArrayList().forEach() { item ->
    if (item is HashMap<*, *>) {
      item.toCondition().let {
        list.add(it)
      }
    }
  }

  return list
}

private fun String.toSignalOperator(): SignalOperator {
  return when (this) {
    "GREATER_THAN" -> SignalOperator.GREATER_THAN
    "LESS_THAN" -> SignalOperator.LESS_THAN
    "EQUAL_TO" -> SignalOperator.EQUAL_TO
    "CROSSES" -> SignalOperator.CROSSES
    "CROSSES_ABOVE" -> SignalOperator.CROSSES_ABOVE
    "CROSSES_BELOW" -> SignalOperator.CROSSES_BELOW
    "TURNS_UP" -> SignalOperator.TURNS_UP
    "TURNS_DOWN" -> SignalOperator.TURNS_DOWN
    "INCREASES" -> SignalOperator.INCREASES
    "CROSSES_BELOW" -> SignalOperator.DECREASES
    "CROSSES_BELOW" -> SignalOperator.DOES_NOT_CHANGE
    else -> SignalOperator.DOES_NOT_CHANGE
  }
}

private fun String.toSignalJoiner(): SignalJoiner {
  return when (this) {
    "AND" -> SignalJoiner.AND
    "OR" -> SignalJoiner.OR
    else -> SignalJoiner.AND
  }
}

private fun ReadableMap.toSignal(): Signal {
  val uniqueId =
    this.getString("uniqueId")?.ifBlank { UUID.randomUUID().toString() } ?: UUID.randomUUID()
      .toString()
  val name = this.getString("name") as String
  val conditions = this.getArray("conditions")!!.toConditionList()
  val description = this.getString("description") as String
  val study = this.getMap("study")!!.toChartIQStudy()
  val disabled = this.getBoolean("disabled")
  val joiner = this.getString("joiner")!!.toSignalJoiner()

  return Signal(uniqueId, name, conditions, joiner, description, disabled, study)
}

private fun Map<String, Any>.toReadableMap(): ReadableMap {
  return Arguments.makeNativeMap(this)
}
