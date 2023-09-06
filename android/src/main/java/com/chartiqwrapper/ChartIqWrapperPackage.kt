package com.chartiqwrapper

import android.view.View
import androidx.lifecycle.MutableLiveData
import com.chartiq.sdk.ChartIQ
import com.chartiq.sdk.DataSourceCallback
import com.chartiq.sdk.model.CrosshairHUD
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManager
import kotlinx.coroutines.*



data class RNDataSourceCallback(val callback: DataSourceCallback, val id: String)
class ChartIQViewModel {
  private lateinit var chartIQ: ChartIQ
  var initialCallbacks: MutableList<RNDataSourceCallback> = mutableListOf()
  var updateCallbacks: MutableList<RNDataSourceCallback>  = mutableListOf()
  var pagingCallbacks: MutableList<RNDataSourceCallback>  = mutableListOf()

  fun setChartIQ(input: ChartIQ): ChartIQ {
    chartIQ = input
    return chartIQ
  }

  fun getChartIQ(): ChartIQ {
    return chartIQ
  }

}

class ChartIqWrapperPackage : ReactPackage {
  private val chartIQViewModel: ChartIQViewModel = ChartIQViewModel()
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(ChartIQWrapperModule(chartIQViewModel))
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf(ChartIqWrapperViewManager(chartIQViewModel))
  }
}
