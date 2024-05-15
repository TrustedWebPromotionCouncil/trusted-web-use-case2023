package com.example.wearable.trustapp.biowatcher.views.screen.subjectData

import android.app.DatePickerDialog
import android.content.Context
import android.widget.DatePicker
import android.widget.Toast
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.PressInteraction
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.Divider
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.common.Constants.COLON
import com.example.wearable.trustapp.biowatcher.common.Constants.FITBIT_PULSE_ACTIVITY_ID
import com.example.wearable.trustapp.biowatcher.common.Constants.STEP
import com.example.wearable.trustapp.biowatcher.common.Constants.TABLE_TYPE_ID
import com.example.wearable.trustapp.biowatcher.common.Constants.TIC_WATCH_E3_PULSE_ACTIVITY_ID
import com.example.wearable.trustapp.biowatcher.common.Util.Companion.toYYYYMMDDString
import com.example.wearable.trustapp.biowatcher.views.layout.ButtonWrapper
import com.example.wearable.trustapp.biowatcher.views.layout.Chart
import com.example.wearable.trustapp.biowatcher.views.layout.LoadingContentLayout
import com.example.wearable.trustapp.biowatcher.views.layout.buttonBackToMenu
import com.example.wearable.trustapp.biowatcher.views.screen.consent.TableListScreen
import com.example.wearable.trustapp.biowatcher.views.ui.theme.paddings
import java.time.LocalDate
import java.util.Calendar
import java.util.Date

@Composable
fun SubjectDataLayout(
    navController: NavHostController,
    subjectViewModel: SubjectViewModel = viewModel()
) {
    val isLoading by subjectViewModel.isLoading.observeAsState(false)
    val titleText = stringResource(id = R.string.Screen_SubjectData)
    LoadingContentLayout(
        titleText = titleText,
        loading = isLoading,
        screenContent = {
            SubjectDataScreen(
                navController = navController,
                subjectViewModel = subjectViewModel,
                isLoading = isLoading
            )
        }
    )
}

@Composable
fun SubjectDataScreen(
    navController: NavHostController,
    subjectViewModel: SubjectViewModel = viewModel(),
    isLoading: Boolean
) {
    val deviceList by subjectViewModel.deviceList.observeAsState()
    val activityList by subjectViewModel.activityList.observeAsState()
    val dataTypeList by subjectViewModel.dataTypeList.observeAsState()
    val startDate: LocalDate by subjectViewModel.startDate.observeAsState(LocalDate.now())
    val endDate: LocalDate by subjectViewModel.endDate.observeAsState(LocalDate.now())
    val isDetailPage: Boolean by subjectViewModel.isDetailPage.observeAsState(false)
    val selectedDeviceTdId: Int by subjectViewModel.selectedDeviceTdId.observeAsState(NO_DATA_ID)
    val selectedActivityId: Int by subjectViewModel.selectedActivityId.observeAsState(NO_DATA_ID)
    val selectedDataType: Int by subjectViewModel.selectedDataType.observeAsState(NO_DATA_ID)
    val noSelectedFlg: Boolean by subjectViewModel.noSelectedFlg.observeAsState(false)
    val isNoDataFlg: Boolean by subjectViewModel.isNoDataFlg.observeAsState(false)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(paddings.textMedium)
            .verticalScroll(
                rememberScrollState()
            ),
        horizontalAlignment = Alignment.End,
    ) {
        if (!isDetailPage) {
            SubjectSearchContents(
                navController = navController,
                subjectViewModel = subjectViewModel,
                deviceList = deviceList!!,
                activityMap = activityList!!,
                dataTypeMap = dataTypeList!!,
                selectedDeviceTdId = selectedDeviceTdId,
                selectedActivityType = selectedActivityId,
                selectedDataType = selectedDataType,
                startDate = startDate,
                endDate = endDate,
            )
        } else {
            SubjectDataDetailContents(
                navController = navController,
                subjectViewModel = subjectViewModel,
                selectedDeviceTdId = selectedDeviceTdId,
                selectedActivityType = selectedActivityId,
                selectedDataType = selectedDataType,
                startDate = startDate,
                endDate = endDate
            )
        }
        SubjectButton(
            navController = navController,
            subjectViewModel = subjectViewModel,
            isDetailPage = isDetailPage,
            enabled = !isLoading
        )
        subjectToast(
            noSelectedFlg = noSelectedFlg,
            isNoDataFlg = isNoDataFlg,
            changeSelectedFlg = subjectViewModel::changeSelectedFlg,
            changeNoDataFlg = subjectViewModel::changeNoDataFlg
        )
    }
}

@Composable
fun subjectToast(
    noSelectedFlg: Boolean,
    isNoDataFlg: Boolean,
    changeSelectedFlg: (Boolean) -> Unit,
    changeNoDataFlg: (Boolean) -> Unit
) {
    val context = LocalContext.current
    if (noSelectedFlg) {
        Toast.makeText(
            context,
            stringResource(id = R.string.ToastText_NoSelectedDataType),
            Toast.LENGTH_SHORT
        ).show()
        changeSelectedFlg(false)
    }
    if (isNoDataFlg) {
        Toast.makeText(
            context,
            stringResource(id = R.string.ToastText_NoData),
            Toast.LENGTH_SHORT
        ).show()
        changeNoDataFlg(false)
    }
}

@Composable
fun SubjectButton(
    navController: NavHostController,
    subjectViewModel: SubjectViewModel,
    isDetailPage: Boolean,
    enabled: Boolean,
) {
    // [ボタン
    if (!isDetailPage) {
        // 選択ボタン
        ButtonWrapper(
            stringResource(id = R.string.ButtonText_Select),
            enabled = enabled
        ) {
            subjectViewModel.clickSearchButton()
        }
    } else {
        // 戻るボタン
        ButtonWrapper(
            stringResource(id = R.string.ButtonText_Back),
            enabled = enabled
        ) {
            subjectViewModel.clickBackButton()
        }
    }

    buttonBackToMenu(
        navController = navController,
        isLoading = enabled,
        studySubjectId = subjectViewModel.studySubjectId,
        studyHospitalId = subjectViewModel.studyHospitalId,
        studyHospitalName = subjectViewModel.studyHospitalName
    )
}

@Composable
fun SubjectSearchContents(
    navController: NavHostController,
    subjectViewModel: SubjectViewModel,
    deviceList: List<SubjectViewModel.DeviceInfo>,
    activityMap: Map<Int, String>,
    dataTypeMap: Map<Int, String>,
    selectedDeviceTdId: Int,
    selectedActivityType: Int,
    selectedDataType: Int,
    startDate: LocalDate,
    endDate: LocalDate,
) {
    Column(
        verticalArrangement = Arrangement.Center
    ) {
        // [デバイス:TicWatch E3, Fitbit]
        DropdownDeviceList(
            label = stringResource(id = R.string.Text_DeviceType),
            options = deviceList,
            selectedTextId = selectedDeviceTdId,
            getSelectedText = subjectViewModel::getDeviceName,
            onSelectText = subjectViewModel::selectDeviceId
        )
        // [アクティビティ: 歩数, 心拍数, 睡眠時間, 体温, 体重, 血圧, 血糖値, 脈拍]
        DropdownMap(
            label = stringResource(id = R.string.Text_ActivityType),
            options = activityMap,
            selectedTextId = selectedActivityType,
            getSelectedText = subjectViewModel::getActivityName,
            onSelectText = subjectViewModel::selectActivityId
        )
        // [データ形式: 線グラフ, 棒グラフ, 表]
        DropdownMap(
            label = stringResource(id = R.string.Text_DataType),
            options = dataTypeMap,
            selectedTextId = selectedDataType,
            getSelectedText = subjectViewModel::getDataTypeName,
            onSelectText = subjectViewModel::selectDataType
        )

        // [表示期間]
        Text(text = "[" + stringResource(id = R.string.Text_Period) + "]")
        Row(
            modifier = Modifier.padding(bottom = paddings.buttonSmall),
            horizontalArrangement = Arrangement.Start,
            verticalAlignment = Alignment.CenterVertically
        ) {
            InputDateTextField(
                label = stringResource(id = R.string.Text_StartDate),
                textValue = toYYYYMMDDString(startDate),
                onDateChange = subjectViewModel::changeStartDate
            )
        }
        Row(
            modifier = Modifier.padding(bottom = paddings.buttonSmall),
            horizontalArrangement = Arrangement.Start,
            verticalAlignment = Alignment.CenterVertically
        ) {
            InputDateTextField(
                label = stringResource(id = R.string.Text_EndDate),
                textValue = toYYYYMMDDString(endDate),
                onDateChange = subjectViewModel::changeEndDate
            )
        }
    }
}

@Composable
fun SubjectDataDetailContents(
    navController: NavHostController,
    subjectViewModel: SubjectViewModel,
    selectedDeviceTdId: Int,
    selectedActivityType: Int,
    selectedDataType: Int,
    startDate: LocalDate,
    endDate: LocalDate,
) {
    val selectedDeviceName = subjectViewModel.getDeviceName(selectedDeviceTdId)
    val selectedActivityName = subjectViewModel.getActivityName(selectedActivityType)
    val selectedDataTypeName = subjectViewModel.getDataTypeName(selectedDataType)
    val tableData by subjectViewModel.tableData.observeAsState()
    // [データ種別, データ形式, 表示期間]
    Column(
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = stringResource(id = R.string.Text_DeviceType) + COLON + selectedDeviceName)
        Text(text = stringResource(id = R.string.Text_ActivityType) + COLON + selectedActivityName)
        Text(text = stringResource(id = R.string.Text_DataType) + COLON + selectedDataTypeName)
        Text(
            text = stringResource(id = R.string.Text_Period) + COLON + toYYYYMMDDString(
                startDate
            ) + " - " + toYYYYMMDDString(endDate)
        )
        Divider(
            color = colorResource(id = R.color.black),
            thickness = 0.5.dp
        )
    }

    // データ表示[表, グラフなど]
    Column(
        verticalArrangement = Arrangement.Center
    ) {
        // TIC WATCH E3の心拍数の場合
        when (selectedActivityType){
            TIC_WATCH_E3_PULSE_ACTIVITY_ID, FITBIT_PULSE_ACTIVITY_ID -> {
                if (selectedDataType == TABLE_TYPE_ID) {
                    TableListScreen(
                        navController = navController,
                        columnCount = tableData!!.columnCount,
                        rowCount = tableData!!.rowCount,
                        documentColumnName = tableData!!.documentColumnName,
                        documentListArray = tableData!!.documentListArray,
                    )
                } else {
                    LineChartForPulse(
                        subjectViewModel = subjectViewModel,
                    )
                }
            }
        }

        Divider(
            color = colorResource(id = R.color.black),
            thickness = 0.5.dp
        )
    }

}

//　表_心拍数
@Composable
fun LineChartForPulse(
    subjectViewModel: SubjectViewModel,
) {
    val chart = Chart()
    val lineChartData by subjectViewModel.lineChartData.observeAsState()
    val maxPulseData by subjectViewModel.maxPulseData.observeAsState(0f)
    val maxPageCount by subjectViewModel.maxPageCount.observeAsState(0)
    var page by remember { mutableStateOf(0) }
    // タイトルを下線付きで表示
    Text(
        text = "表示日付 : " + lineChartData?.get(0)?.date.toString(),
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 10.dp, start = 10.dp, end = 10.dp),
        color = Color.Black,
        textDecoration = TextDecoration.Underline
    )
    // 心拍数[日付-心拍数のMap1をIndex-心拍数のMap2に変換する
    subjectViewModel.changeLineChartData(page)

    if (!lineChartData.isNullOrEmpty() && maxPageCount > 0) {
        // ページ変更の場合はグラフを再描画したいがために、意味のない分岐を作っているが、中身の処理は同じである。
        if (page % 2 == 0) {
            chart.LineChartForTicWatchByPulse(lineChartData!!, maxPulseData)
        } else {
            chart.LineChartForTicWatchByPulse(lineChartData!!, maxPulseData)
        }
        Column {
            Row {
                ButtonWrapper(buttonText = "前へ", spacerFlg = false) {
                    if (page > 0) page--
                }
            }
            Row {
                ButtonWrapper(buttonText = "次へ", spacerFlg = false) {
                    if (maxPageCount > page + 1) page++
                }
            }
        }
    } else {
        Text(text = "データがありません")
    }
}

//　表_歩数
@Composable
fun ListChartForStep(stepsMap: Map<String, Float>) {
    var chart = Chart()
    // 歩数
    val lineChartData = stepsMap.values.mapIndexed { index, value ->
        index.toFloat() to value     // 値とインデックスのペアを返す
    }.toMap()
    // 日付
    var xLabel = stepsMap.keys.mapIndexed { _, value ->
        value
    }.toTypedArray()

    val chartLabel = STEP
    chart.ListChart(
        chartLegend = chartLabel,
        dataMap = lineChartData,
        xLabels = xLabel,
        yAxisUnit = 5000,
        yLabelCount = 11,
        xDivide = 2
    )
}

@Composable
fun BarChartForStep(stepsMap: Map<String, Float>) {
    var chart = Chart()
    // 歩数
    val lineChartData = stepsMap.values.mapIndexed { index, value ->
        index.toFloat() to value     // 値とインデックスのペアを返す
    }.toMap() // リストからmapに変換する
    // 日付
    var xLabel = stepsMap.keys.mapIndexed { _, value ->
        value
    }.toTypedArray()

    val chartLabel = "歩数"
    chart.BarChart(
        chartLegend = chartLabel,
        dataMap = lineChartData,
        xLabels = xLabel,
        yAxisUnit = 5000,
        yLabelCount = 11,
        xDivide = 2
    )
}

//@Composable
//fun LineChartForStep(stepsMap: Map<String, Float>) {
//    val chart = Chart()
//
//    // 歩数
//    val lineChartData = stepsMap.values.mapIndexed { index, value ->
//        index.toFloat() to value     // 値とインデックスのペアを返す
//    }.toMap() // リストからmapに変換する
//    // 日付
//    var xLabel = stepsMap.keys.mapIndexed { _, value ->
//        value
//    }.toTypedArray()
//
//    val chartLabel = "歩数"
//    chart.LineChart(
//        chartLegend = chartLabel,
//        dataMap = lineChartData,
//        xLabels = xLabel,
//        yAxisUnit = 5000,
//        yLabelCount = 11,
//        xDivide = 2
//    )
//}

//@Composable
//fun RadarGraph(resultMap: Map<String, Float>) {
//    AndroidView(
//        factory = { context ->
//            val radarChart = RadarChart(context)
//            val entries = mutableListOf<RadarEntry>()
//            val labels = mutableListOf<String>()
//            for ((k, v) in resultMap) {
//                entries.add(RadarEntry(v, k))
//                labels.add(k)
//            }
//            val dataSet = RadarDataSet(entries, "").apply {
//                color = R.color.teal_700    // グラフの色
//                setDrawFilled(true) // 塗りつぶし
//                lineWidth = 2f  // 太さ
//            }
//
//            val xAxis = radarChart.xAxis
//            xAxis.valueFormatter = IndexAxisValueFormatter(
//                labels
//            )   // x軸のラベルを設定
//            val l = radarChart.legend   // 凡例
//            l.isEnabled = true // 凡例を非表示
//
//            val desc = radarChart.description   // 説明文
//            desc.isEnabled = false  // 説明文を非表示
//            val radarData = RadarData(dataSet)  // データをセット
//            radarChart.data = radarData // データをセット
//            radarChart.invalidate() // 描画
//            radarChart  // 描画したグラフを返す
//        },
//        modifier = Modifier
//            .height(400.dp)
//            .width(400.dp)
//            .fillMaxSize()
//            .padding(1.dp), // 画面サイズ
//    )
//}
//
//// 棒グラフ

//@Composable
//fun BarChartScreen() {
//    // テストデータを作成する
//    val testSteps: List<Pair<String, Int>> = listOf(
//        Pair("2022/10/01", 8569),
//        Pair("2022/10/02", 12100),
//        Pair("2022/10/03", 10000),
//        Pair("2022/10/04", 1506),
//        Pair("2022/10/05", 4357),
//    )
//    // BarChartDataオブジェクトを作成する
//    val barChartData = BarChartData(
//        bars = testSteps.map { (label, value) ->
//            BarChartData.Bar(
//                label = label,
//                value = value.toFloat(),
//                color = randomColor()
//            )
//        }
//    )
//    // BarChartコンポーザブル関数を呼び出す
//    BarChart(
//        barChartData = barChartData,
//        modifier = Modifier.fillMaxSize(),
//        animation = simpleChartAnimation(),
//        barDrawer = SimpleBarDrawer(),
//        xAxisDrawer = SimpleXAxisDrawer(),
//        yAxisDrawer = SimpleYAxisDrawer(),
//        labelDrawer = SimpleLabelDrawer()
//    )
//}
@Composable
fun InputDateTextField(
    label: String,
    textValue: String,
    singleLine: Boolean = false,
    modifier: Modifier = Modifier
        .fillMaxSize()
        .padding(bottom = paddings.buttonSmall),
    onDateChange: (String) -> Unit
) {
    val context = LocalContext.current

    Text(text = "$label : ")
    OutlinedTextField(
        value = textValue,
        readOnly = true,
        onValueChange = { },
        modifier = modifier,
        singleLine = singleLine,
        interactionSource = remember { MutableInteractionSource() }
            .also { interactionSource ->
                LaunchedEffect(interactionSource) {
                    interactionSource.interactions.collect {
                        if (it is PressInteraction.Release) {
                            // works like onClick
                            showDatePicker(
                                context
                            ) { year, month, day ->
                                run {
                                    onDateChange(toYYYYMMDDString(year, month, day))
                                }
                            }
                        }
                    }
                }
            }
    )
}

@Composable
fun DropdownMap(
    label: String = "ドロップダウンリスト",
    options: Map<Int, String>,
    selectedTextId: Int,
    getSelectedText: (Int) -> String,
    onSelectText: (Int) -> Unit
) {
    // ドロップダウンメニューが展開されているかどうかを保持する状態変数
    var expanded by remember { mutableStateOf(false) }
    val icon = if (expanded) Icons.Filled.KeyboardArrowUp else Icons.Filled.KeyboardArrowDown

    // ドロップダウンメニューを含むボックスを作成する
    Box {
        // テキストフィールドとアイコンボタンを作成する
        OutlinedTextField(
            value = getSelectedText(selectedTextId),
            onValueChange = { },
            readOnly = true,
            label = { Text(label) },
            trailingIcon = {
                IconButton(onClick = { expanded = !expanded }) {
                    Icon(icon, "contentDescription")
                }
            }
        )
        // ドロップダウンメニューを作成する
        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            options.forEach { (key, value) ->
                DropdownMenuItem(
                    text = { Text(value) },
                    onClick = {
                        // itemを変更した場合はonChangeTextを呼び出す
                        if (selectedTextId != key) onSelectText(key)
                        expanded = false
                    })
            }
        }
    }
}

@Composable
fun DropdownDeviceList(
    label: String = "ドロップダウンリスト",
    options: List<SubjectViewModel.DeviceInfo>,
    selectedTextId: Int,
    getSelectedText: (Int) -> String,
    onSelectText: (Int, Int) -> Unit
) {
    // ドロップダウンメニューが展開されているかどうかを保持する状態変数
    var expanded by remember { mutableStateOf(false) }
    val icon = if (expanded) Icons.Filled.KeyboardArrowUp else Icons.Filled.KeyboardArrowDown

    // ドロップダウンメニューを含むボックスを作成する
    Box {
        // テキストフィールドとアイコンボタンを作成する
        OutlinedTextField(
            value = getSelectedText(selectedTextId),
            onValueChange = { },
            readOnly = true,
            label = { Text(label) },
            trailingIcon = {
                IconButton(onClick = { expanded = !expanded }) {
                    Icon(icon, "contentDescription")
                }
            }
        )
        // ドロップダウンメニューを作成する
        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            options.forEach { item ->
                DropdownMenuItem(
                    text = { Text(item.deviceName) },
                    onClick = {
                        // itemを変更した場合はonChangeTextを呼び出す
                        if (selectedTextId != item.deviceTdId) onSelectText(
                            item.deviceTdId,
                            item.deviceTypeId
                        )
                        expanded = false
                    }
                )
            }
        }
    }
}

// 日付入力ダイアログを表示する
fun showDatePicker(
    context: Context,
    onDecideDate: (String, String, String) -> Unit,
) {
    val calendar = Calendar.getInstance()
    val year = calendar.get(Calendar.YEAR)
    val month = calendar.get(Calendar.MONTH)
    val day = calendar.get(Calendar.DAY_OF_MONTH)
    calendar.time = Date()

    DatePickerDialog(
        context,
        { _: DatePicker, pickedYear: Int, pickedMonth: Int, pickedDay: Int ->
            onDecideDate(pickedYear.toString(), (pickedMonth + 1).toString(), pickedDay.toString())
        }, year, month, day
    ).show()
}

