package com.example.wearable.trustapp.biowatcher.views.layout

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.example.wearable.trustapp.R
import com.github.mikephil.charting.charts.BarChart
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.charts.RadarChart
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.components.YAxis
import com.github.mikephil.charting.data.BarData
import com.github.mikephil.charting.data.BarDataSet
import com.github.mikephil.charting.data.BarEntry
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.data.RadarData
import com.github.mikephil.charting.data.RadarDataSet
import com.github.mikephil.charting.data.RadarEntry
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter
import com.github.mikephil.charting.formatter.ValueFormatter
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet
import kotlin.math.floor


class Chart {

    @Composable
    fun LineChart(
        chartLegend: String,        // チャート自体のラベル：心拍数、歩数などのタイトル
        dataMap: Map<Float, Float>, // チャートに表示するデータ：x軸の値、y軸の値
        xLabels: Array<String>,     // x軸のラベル：yyyy/mm/dd、hh:mmなど
        yAxisUnit: Int = 100,       // y軸の軸単位
        yLabelCount: Int = 11,  // y軸のラベルの数
        xDivide: Int = 1,        // x軸のラベルの表示間隔
    ) {
        Box(
            modifier = Modifier
                .padding(10.dp)
                .horizontalScroll(rememberScrollState())
        )
        {
            Box {
                AndroidView(
                    factory = { context ->
                        val lineChart = LineChart(context)
                        val entries = mutableListOf<Entry>()
                        for ((x, y) in dataMap) {
                            entries.add(Entry(x, y))
                        }

                        val dataSet = LineDataSet(entries, chartLegend).apply {
                            color = R.color.red    // グラフの色
                            setDrawFilled(true) // 塗りつぶし
                            lineWidth = 2f  // ライン太さ
                            valueTextSize = 15f // 文字サイズ
                            // 整数表示
                            valueFormatter = object : ValueFormatter() {
                                override fun getFormattedValue(value: Float): String {
                                    return value.toInt().toString()
                                }
                            }
                        }

                        // X 軸のフォーマッター
                        val xAxisFormatter = object : ValueFormatter() {
                            override fun getFormattedValue(value: Float): String {
                                return xLabels[value.toInt()]
                            }
                        }
                        // X 軸の設定
                        // すべてにラベルを追加する
                        lineChart.xAxis.apply {
                            position = XAxis.XAxisPosition.BOTTOM
                            valueFormatter = xAxisFormatter
                            setDrawGridLines(true)  // グリッドを表示する
                            enableGridDashedLine(1f, 1f, 0f)
                            labelCount = xLabels.size / 3 // すべてのラベルを表示する
                            granularity = 1f // ラベルの間隔を1にする
                        }
                        lineChart.setScaleEnabled(false) // グラフの拡大縮小を不許可(barを拡大するだけ。数値は拡大されないので不要)

                        // y軸の設定
                        val yAxis: YAxis = lineChart.axisLeft
                        yAxis.axisMinimum = 0f // y軸の最小値を0に設定
                        yAxis.axisMaximum =
                            dataMap.maxOf { (floor(it.value / yAxisUnit) * yAxisUnit + yAxisUnit) }   // dataMapの最大値以上の値をy軸の最大値に設定
                        yAxis.setLabelCount(yLabelCount, true)    // y軸のラベルの数を設定
                        yAxis.setDrawGridLines(true)    // y軸のグリッドを表示する
                        yAxis.setDrawTopYLabelEntry(true)   // y軸の最大値のラベルを表示する
                        yAxis.setDrawZeroLine(true) // y軸の値が0のときに線を表示する
                        yAxis.enableGridDashedLine(10f, 10f, 0f)    // y軸のグリッド線を点線にする
                        yAxis.isEnabled = true  // y軸を表示する
                        yAxis.setDrawLabels(true)   // y軸のラベルを表示する

                        lineChart.axisRight.isEnabled = false    // 右側の目盛りを表示する
                        lineChart.axisRight.setDrawLabels(false)    // 右側の目盛りのラベルを表示しない

                        // 凡例の設定
                        val legend = lineChart.legend
                        legend.isEnabled = true // 凡例を表示

                        // 説明文の設定
                        val desc = lineChart.description
                        desc.isEnabled = false  // 説明文を非表示

                        // データの設定
                        val lineData = LineData(dataSet)
                        lineChart.data = lineData
                        lineChart.invalidate() // 描画
                        lineChart  // 描画したグラフを返す
                    },
                    modifier = Modifier
                        .height(500.dp)
//                    .fillMaxHeight(0.6f)
                        .width(50.dp * xLabels.size)
                        .padding(top = 10.dp, bottom = 10.dp),
                )
            }
        }

    }

    @Composable
    fun LineChartForTicWatchByPulse(
        lineChartData: List<SubjectViewModel.LineChart>,
        maxPulseData: Float,
    ) {
        Box(
            modifier = Modifier
                .padding(10.dp)
                .horizontalScroll(rememberScrollState())
        )
        {
            Box {
                AndroidView(
                    factory = { context ->
                        val listSize = lineChartData.size
                        val lineChart = LineChart(context)
                        val dataSets = ArrayList<ILineDataSet>()
                        lineChartData.forEach { data ->
                            val entries = mutableListOf<Entry>()
                            for ((x, y) in data.lineChartDataMap) {
                                entries.add(Entry(x, y))
                            }
                            val dataSet = LineDataSet(entries, data.lineName).apply {
                                color = data.lineColor    // グラフの色
                                setDrawFilled(false) // 塗りつぶし
                                lineWidth = 2f  // ライン太さ
                                valueTextSize = 15f // 文字サイズ
                                // 整数表示
                                valueFormatter = object : ValueFormatter() {
                                    override fun getFormattedValue(value: Float): String {
                                        return value.toInt().toString()
                                    }
                                }
                            }
                            dataSet.color = data.lineColor
                            dataSets.add(dataSet)
                        }

                        // X 軸のフォーマッター
                        val xAxisFormatter = object : ValueFormatter() {
                            override fun getFormattedValue(value: Float): String {
                                return lineChartData[0].xLabels[value.toInt()]
                            }
                        }
                        // X 軸の設定
                        // すべてにラベルを追加する
                        lineChart.xAxis.apply {
                            position = XAxis.XAxisPosition.BOTTOM
                            valueFormatter = xAxisFormatter
                            setDrawGridLines(true)  // グリッドを表示する
                            enableGridDashedLine(1f, 1f, 0f)
                            labelCount = lineChartData[0].xLabels.size / 3 // すべてのラベルを表示する
                            granularity = 1f // ラベルの間隔を1にする
                        }
                        lineChart.setScaleEnabled(false) // グラフの拡大縮小を不許可(barを拡大するだけ。数値は拡大されないので不要)

                        // y軸の設定
                        val yAxis: YAxis = lineChart.axisLeft
                        yAxis.axisMinimum = 0f // y軸の最小値を0に設定
                        yAxis.axisMaximum =(floor(maxPulseData / lineChartData[0].yAxisUnit) * lineChartData[0].yAxisUnit + lineChartData[0].yAxisUnit)    // dataMapの最大値以上の値をy軸の最大値に設定
                        yAxis.setLabelCount(lineChartData[0].yLabelCount, true)    // y軸のラベルの数を設定
                        yAxis.setDrawGridLines(true)    // y軸のグリッドを表示する
                        yAxis.setDrawTopYLabelEntry(true)   // y軸の最大値のラベルを表示する
                        yAxis.setDrawZeroLine(true) // y軸の値が0のときに線を表示する
                        yAxis.enableGridDashedLine(10f, 10f, 0f)    // y軸のグリッド線を点線にする
                        yAxis.isEnabled = true  // y軸を表示する
                        yAxis.setDrawLabels(true)   // y軸のラベルを表示する

                        lineChart.axisRight.isEnabled = false    // 右側の目盛りを表示する
                        lineChart.axisRight.setDrawLabels(false)    // 右側の目盛りのラベルを表示しない


                        // 凡例の設定
                        val legend = lineChart.legend
                        legend.isEnabled = true // 凡例を表示

                        // 説明文の設定
                        val desc = lineChart.description
                        desc.isEnabled = false  // 説明文を非表示

                        // データの設定
                        val lineData = LineData(dataSets)
                        lineChart.data = lineData
                        lineChart.invalidate() // 描画
                        lineChart  // 描画したグラフを返す
                    },
                    modifier = Modifier
                        .height(500.dp)
                        .width(50.dp * lineChartData[0].xLabels.size)
                        .padding(top = 10.dp, bottom = 10.dp),
                )
            }
        }
    }

    @Composable
    fun BarChart(
        chartLegend: String,        // チャート自体のラベル：心拍数、歩数などのタイトル
        dataMap: Map<Float, Float>, // チャートに表示するデータ：x軸の値、y軸の値
        xLabels: Array<String>,     // x軸のラベル：yyyy/mm/dd、hh:mmなど
        yAxisUnit: Int = 100,       // y軸の軸単位
        yLabelCount: Int = 11,  // y軸のラベルの数
        xDivide: Int = 2        // x軸のラベルの表示間隔
    ) {
        Box(
            modifier = Modifier
                .horizontalScroll(rememberScrollState())
        ) {
            AndroidView(
                factory = { context ->
                    val barChart = BarChart(context)
                    val entries = mutableListOf<BarEntry>()
                    for ((x, y) in dataMap) {
                        entries.add(BarEntry(x, y))
                    }

                    val dataSet = BarDataSet(entries, chartLegend).apply {
                        color = R.color.red    // グラフの色
                    }

                    // x軸の設定
                    val xAxis = barChart.xAxis
//                xAxis.axisMinimum = 0f;
//                xAxis.axisMaximum = (xLabels.size - 1).toFloat()
//                xAxis.setLabelCount(xLabels.size, true)    // x軸のラベルの数を設定
                    xAxis.position =
                        com.github.mikephil.charting.components.XAxis.XAxisPosition.BOTTOM //x軸のラベル位置を下部に変更する
                    xAxis.valueFormatter = IndexAxisValueFormatter(
                        xLabels.mapIndexed { index, value ->
                            // インデックスが偶数かどうかを判定する
                            if (index % xDivide == 0) {
                                // インデックスが偶数の場合はvalueを返す
                                value
                            } else {
                                // インデックスが奇数の場合は"(空白文字)"を返す
                                ""
                            }
                        }.toTypedArray()
                    )   // x軸のラベルを設定
                    xAxis.granularity = 1f  // x軸のラベルを強制的に表示する
                    xAxis.setDrawGridLines(true)    // x軸のグリッドを表示する
                    barChart.setScaleEnabled(false) // グラフの拡大縮小を不許可(barを拡大するだけ。数値は拡大されないので不要)

                    // y軸の設定
                    val yAxis: YAxis = barChart.axisLeft
                    yAxis.axisMinimum = 0f // y軸の最小値を0に設定
                    yAxis.axisMaximum =
                        dataMap.maxOf { (floor(it.value / yAxisUnit) * yAxisUnit + yAxisUnit) }   // dataMapの最大値以上の値をy軸の最大値に設定
                    yAxis.setLabelCount(yLabelCount, true)    // y軸のラベルの数を設定
                    yAxis.setDrawGridLines(true)    // y軸のグリッドを表示する
                    yAxis.setDrawTopYLabelEntry(true)   // y軸の最大値のラベルを表示する
                    yAxis.setDrawZeroLine(true) // y軸の値が0のときに線を表示する
                    yAxis.enableGridDashedLine(10f, 10f, 0f)    // y軸のグリッド線を点線にする
                    yAxis.isEnabled = true  // y軸を表示する
                    yAxis.setDrawLabels(true)   // y軸のラベルを表示する

                    barChart.axisRight.isEnabled = false    // 右側の目盛りを表示する
                    barChart.axisRight.setDrawLabels(false)    // 右側の目盛りのラベルを表示しない

                    // 凡例の設定
                    val legend = barChart.legend
                    legend.verticalAlignment =
                        com.github.mikephil.charting.components.Legend.LegendVerticalAlignment.TOP
                    legend.horizontalAlignment =
                        com.github.mikephil.charting.components.Legend.LegendHorizontalAlignment.RIGHT
                    legend.isEnabled = true // 凡例を表示

                    // 説明文の設定
                    val desc = barChart.description
                    desc.isEnabled = false  // 説明文を非表示

                    // データの設定
                    val barData = BarData(dataSet)
                    barChart.data = barData
                    barChart.invalidate() // 描画
                    barChart  // 描画したグラフを返す
                },
                modifier = Modifier
                    .height(500.dp)
//                    .fillMaxHeight(0.6f)
                    .width(50.dp * xLabels.size)
                    .padding(top = 10.dp, bottom = 10.dp)
            )
        }
    }


    @Composable
    fun ListChart(
        chartLegend: String,        // チャート自体のラベル：心拍数、歩数などのタイトル
        dataMap: Map<Float, Float>, // チャートに表示するデータ：x軸の値、y軸の値
        xLabels: Array<String>,     // x軸のラベル：yyyy/mm/dd、hh:mmなど
        yAxisUnit: Int = 100,       // y軸の軸単位
        yLabelCount: Int = 11,  // y軸のラベルの数
        xDivide: Int = 2        // x軸のラベルの表示間隔
    ) {
        Box(
            modifier = Modifier
                .horizontalScroll(rememberScrollState())
        ) {
            Column {
                TableLayout(columnNames = xLabels, tableData = dataMap, cellWidth = 150.dp)
            }
        }
    }

    @Composable
    fun RadarGraph(resultMap: Map<String, Float>) {
        AndroidView(
            factory = { context ->
                val radarChart = RadarChart(context)
                val entries = mutableListOf<RadarEntry>()
                val labels = mutableListOf<String>()
                for ((k, v) in resultMap) {
                    entries.add(RadarEntry(v, k))
                    labels.add(k)
                }
                val dataSet = RadarDataSet(entries, "").apply {
                    color = R.color.teal_700    // グラフの色
                    setDrawFilled(true) // 塗りつぶし
                    lineWidth = 2f  // 太さ
                }

                val xAxis = radarChart.xAxis
                xAxis.valueFormatter = IndexAxisValueFormatter(
                    labels
                )   // x軸のラベルを設定
                val l = radarChart.legend   // 凡例
                l.isEnabled = true // 凡例を非表示

                val desc = radarChart.description   // 説明文
                desc.isEnabled = false  // 説明文を非表示
                val radarData = RadarData(dataSet)  // データをセット
                radarChart.data = radarData // データをセット
                radarChart.invalidate() // 描画
                radarChart  // 描画したグラフを返す
            },
            modifier = Modifier
                .height(500.dp)
//                .fillMaxHeight(0.5f)
                .width(400.dp)
                .fillMaxSize()
                .padding(1.dp), // 画面サイズ
        )
    }
}