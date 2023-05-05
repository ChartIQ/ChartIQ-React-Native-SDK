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


class ChartIQViewModel {
  private lateinit var chartIQ: ChartIQ
  var initialCallback: DataSourceCallback? = null
  var updateCallback: DataSourceCallback? = null
  var pagingCallback: DataSourceCallback? = null
  val crosshairsHUD = MutableLiveData<CrosshairHUD>()
  val crosshairsEnabled = MutableLiveData(false)


  private val job = Job()

  private val chartScope = CoroutineScope(job + Dispatchers.IO)



   fun fetchCrosshairsState() {
    chartIQ.isCrosshairsEnabled { enabled ->
      if (enabled) {
        launchCrosshairsUpdate()
      }
    }
  }

  private fun getHUDDetails() {
    chartIQ.getHUDDetails { hud ->
      crosshairsHUD.value = hud
    }
  }

  private fun launchCrosshairsUpdate() {
    chartScope.launch {
      while (true) {
        delay(CROSSHAIRS_UPDATE_PERIOD)
        withContext(Dispatchers.Main){
          getHUDDetails()
        }
      }
    }
  }
  fun setChartIQ(input: ChartIQ): ChartIQ {
    chartIQ = input
    return chartIQ
  }

  fun getChartIQ(): ChartIQ {
    return chartIQ
  }

  companion object {
    private const val CROSSHAIRS_UPDATE_PERIOD = 300L
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
