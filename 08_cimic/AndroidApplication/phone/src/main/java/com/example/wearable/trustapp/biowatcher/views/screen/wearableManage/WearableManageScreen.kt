package com.example.wearable.trustapp.biowatcher.views.screen.wearableManage


import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Icon
import androidx.compose.material3.IconToggleButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.rememberVectorPainter
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.viewModel.wearableManage.UpdateStatus
import com.example.wearable.trustapp.biowatcher.viewModel.wearableManage.WearableManagementViewModel
import com.example.wearable.trustapp.biowatcher.views.layout.ButtonWrapper
import com.example.wearable.trustapp.biowatcher.views.layout.LoadingContentLayout
import com.example.wearable.trustapp.biowatcher.views.layout.TableCellByText
import com.example.wearable.trustapp.biowatcher.views.layout.buttonBackToMenu
import com.example.wearable.trustapp.biowatcher.views.screen.Screen

@Composable
fun WearableManageLayout(
    navController: NavHostController,
    wearableManagementViewModel: WearableManagementViewModel = viewModel()
) {
    val isLoading by wearableManagementViewModel.isLoading.observeAsState(false)
    val titleText = stringResource(id = R.string.Screen_WearableManage)
    LoadingContentLayout(
        titleText = titleText,
        loading = isLoading,
        screenContent = {
            WearableManageScreen(
                navController = navController,
            )
        }
    )
}

@Composable
fun WearableManageScreen(
    navController: NavHostController,
    wearableManagementViewModel: WearableManagementViewModel = viewModel()
) {
    val isUpdating by wearableManagementViewModel.isUpdating.observeAsState(true)
    val deviceDataList by wearableManagementViewModel.deviceDataList.observeAsState(listOf())
    val alertDialogFlg by wearableManagementViewModel.alertDialogFlg.observeAsState(false)
    val updateStatus by wearableManagementViewModel.updateStatus.observeAsState(UpdateStatus.NONE)
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(
                rememberScrollState()
            )
    ) {
        wearableContents(
            deviceDataList = deviceDataList,
            updatingFlg = isUpdating,
            changeUserDevice = wearableManagementViewModel::changeUserDevice,
        )

        wearableButton(
            navController = navController,
            wearableManagementViewModel = wearableManagementViewModel,
            changeAlertDialogFlg = wearableManagementViewModel::changeAlertDialogFlg,
            updatingFlg = isUpdating,
        )

        // 更新ボタン押下時にダイアログを表示
        alertUpdate(
            changeAlertDialogFlg = wearableManagementViewModel::changeAlertDialogFlg,
            updateUserDevice = wearableManagementViewModel::updateUserDevice,
            alertDialogFlg = alertDialogFlg,
        )
        // 更新処理が完了したら、トーストを表示する
        wearableToast(
            updateStatus = updateStatus,
            changeUpdateStatus = wearableManagementViewModel::changeUpdateStatus,
        )

    }
}

@Composable
fun wearableToast(
    updateStatus: UpdateStatus,
    changeUpdateStatus: (UpdateStatus) -> Unit,
) {
    if (updateStatus == UpdateStatus.UPDATE_COMPLETED) {
        val context = LocalContext.current
        Toast.makeText(
            context,
            stringResource(id = R.string.ToastText_UpdateDevice),
            Toast.LENGTH_SHORT
        ).show()
        changeUpdateStatus(UpdateStatus.NONE)
    }
}

@Composable
fun wearableButton(
    navController: NavHostController,
    wearableManagementViewModel: WearableManagementViewModel = viewModel(),
    changeAlertDialogFlg: (Boolean) -> Unit,
    updatingFlg: Boolean,
) {
    ButtonWrapper(
        stringResource(id = R.string.ButtonText_Update),
        enabled = updatingFlg
    ) {
        changeAlertDialogFlg(true)
    }
    buttonBackToMenu(
        navController = navController,
        isLoading = updatingFlg,
        studySubjectId = wearableManagementViewModel.studySubjectId,
        studyHospitalId = wearableManagementViewModel.studyHospitalId,
        studyHospitalName = wearableManagementViewModel.studyHospitalName
    )
}

@Composable
fun wearableContents(
    deviceDataList: List<WearableManagementViewModel.DeviceData>,
    updatingFlg: Boolean,
    changeUserDevice: (Int, Boolean) -> Unit,
) {
    TableLayoutForWearable(
        tableData = deviceDataList,
        columnNames = "端末名" to "接続状態",
        enabled = updatingFlg,
    ) { tdId, isChecked ->
        changeUserDevice(tdId, isChecked)
    }
}

@Composable
fun alertUpdate(
    changeAlertDialogFlg: (Boolean) -> Unit,
    updateUserDevice: () -> Unit,
    alertDialogFlg: Boolean,
) {
    if (alertDialogFlg) {
        AlertDialog(
            onDismissRequest = {
                changeAlertDialogFlg(false)
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        changeAlertDialogFlg(false)
                        updateUserDevice()
                    }
                ) {
                    Text(stringResource(id = R.string.Text_Yes))
                }
            },
            dismissButton = {
                TextButton(
                    onClick = {
                        changeAlertDialogFlg(false)
                    }
                ) {
                    Text(stringResource(id = R.string.Text_No))
                }
            },
            title = {
                Text(stringResource(id = R.string.Text_UpdateDeviceAlertTitle))
            },
            text = {
                Text(stringResource(id = R.string.Text_IsUpdateDevice))
            },
        )
    }
}

@Composable
fun TableLayoutForWearable(
    tableData: List<WearableManagementViewModel.DeviceData>,
    columnNames: Pair<String, String>,
    enabled: Boolean = false,
    onCheckedChange: (Int, Boolean) -> Unit
) {
    val columnFirstWeight = .7f // 30%
    val columnSecondWeight = .3f // 70%
    LazyVerticalGrid(
        columns = GridCells.Fixed(1),
        Modifier.height(500.dp)
    ) {
        item() {

            Row(
                modifier = Modifier.background(color = Color.LightGray)
            ) {
                TableCellByTextForWearable(text = columnNames.first, weight = columnFirstWeight)
                TableCellByTextForWearable(text = columnNames.second, weight = columnSecondWeight)
            }
        }
        items(tableData.size) { elem ->
            val text = tableData[elem].deviceTypeId
            Row(
                modifier = Modifier.fillMaxSize()
            ) {
                TableCellByTextForWearable(
                    text = tableData[elem].deviceDisplayName,
                    weight = columnFirstWeight
                )
                Checkbox(
                    checked = tableData[elem].isValid,
                    onCheckedChange = {
                        onCheckedChange(
                            tableData[elem].deviceTdId,
                            !tableData[elem].isValid
                        )
                    },
                    enabled = enabled,
                    modifier = Modifier
                        .border(1.dp, Color.Black)
                        .weight(columnSecondWeight)
                        .height(50.dp)
                        .padding(8.dp)
                )
            }
        }
    }
}

@Composable
fun TableScreen(
    columnNames: Array<String>,
    tableData: List<Pair<String, Boolean>>,
    onCheckedChange: (String, Boolean) -> Unit
) {
    val columnCount = columnNames.size// グリッドの列数を決める
    val cellSize = 100.dp   // グリッドのセルのサイズ

    // グリッド作成
    LazyVerticalGrid(
        columns = GridCells.Fixed(columnCount),
    ) {
        // グリッドのヘッダー
        item {
            Row(
                modifier = Modifier.background(color = Color.LightGray)
            ) {
                columnNames.map {
                    TableCellByText(text = it, width = cellSize)
                }
            }
        }
        // グリッドのデータ
        items(tableData.size) {
            val (deviceName, flg) = tableData[it]
            Row(
                modifier = Modifier.fillMaxSize()
            ) {
//                TableCellByText(text = deviceName, width = cellSize)
//                TableCellByImage(width = cellSize)
                TableCellByTextForWearable(text = deviceName, width = cellSize)
                IconToggleButton(
                    checked = flg,
                    onCheckedChange = { onCheckedChange(deviceName, !flg) },
                    modifier = Modifier
                        .border(1.dp, Color.Black)
                        .width(cellSize)
                        .padding(8.dp)
                ) {
                    Icon(
                        imageVector = if (flg) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = if (flg) "favorite on" else "favorite off",
                    )
                }
            }
        }
    }
}

@Composable
fun RowScope.TableCellByTextForWearable(
    text: String,
    weight: Float = 1f
) {
    Text(
        text = text,
        Modifier
            .border(1.dp, Color.Black)
            .weight(weight)
            .height(50.dp)
            .padding(8.dp)
    )
}

@Composable
fun RowScope.TableCellByTextForWearable(
    text: String,
    width: Dp
) {
    Text(
        text = text,
        Modifier
            .border(1.dp, Color.Black)
            .width(width)
            .padding(8.dp)
    )
}

@Composable
fun RowScope.TableCellByImage(
    weight: Float
) {
    Icon(
        painter = rememberVectorPainter(image = Icons.Default.Check),
        contentDescription = null,
        modifier = Modifier
            .border(1.dp, androidx.compose.ui.graphics.Color.Black)
            .weight(weight)
            .padding(8.dp)
    )
}

@Composable
fun RowScope.TableCellByImage(
    flg: Boolean,
    width: Dp,
    onCheckedChange: (Boolean) -> Unit
) {
    Icon(
        painter = rememberVectorPainter(image = Icons.Default.Check),
        contentDescription = null,
        modifier = Modifier
            .border(1.dp, androidx.compose.ui.graphics.Color.Black)
            .width(width)
            .padding(8.dp)
    )
}