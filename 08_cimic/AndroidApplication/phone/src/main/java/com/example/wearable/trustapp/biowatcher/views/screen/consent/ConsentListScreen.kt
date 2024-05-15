package com.example.wearable.trustapp.biowatcher.views.screen.consent


import android.content.Context
import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.common.Constants.MAX_INT
import com.example.wearable.trustapp.biowatcher.common.Constants.MIME_TYPE_PDF
import com.example.wearable.trustapp.biowatcher.viewModel.consent.ConsentListViewModel
import com.example.wearable.trustapp.biowatcher.viewModel.consent.ConsentViewModel
import com.example.wearable.trustapp.biowatcher.viewModel.consent.DownloadStatus
import com.example.wearable.trustapp.biowatcher.views.screen.wearableManage.TableCellByTextForWearable
import java.io.FileOutputStream


// 同意文書一覧
@Composable
fun ConsentListScreen(
    consentViewModel : ConsentViewModel,
    navController: NavHostController,
    consentListViewModel: ConsentListViewModel,
    consentFileList: List<ConsentListViewModel.ConsentFileData>,
    changeDownloadStatus: (DownloadStatus) -> Unit,
    downloadStatus: DownloadStatus,
) {
    val context = LocalContext.current

    val alertDialogFlg by consentListViewModel.alertDialogFlg.observeAsState(false)
    val downloadIndex by consentListViewModel.downloadIndex.observeAsState(MAX_INT)
    val fileBoxId by consentListViewModel.fileBoxId.observeAsState("")

    val registerForActivityResult =
        rememberLauncherForActivityResult(ActivityResultContracts.CreateDocument(MIME_TYPE_PDF)) { uri: Uri? ->
            consentListViewModel.copyFile(uri)
        }

    TableLayoutForConsent(
        tableData = consentFileList,
        columnName = "ファイル名(ダウンロード可)",
        enabled = !consentViewModel.isLoading.value!!,
        onClickDownloadFile = consentListViewModel::onClickDownload
    )

    alertDownload(
        consentListViewModel = consentListViewModel,
        consentFileList = consentFileList,
        downloadIndex = downloadIndex,
        fileBoxId = fileBoxId,
        alertDialogFlg = alertDialogFlg,
    )

    // ダウンロード処理が完了したら、共有ストレージを選択する画面を開いて、PDFをコピーする。
    when (downloadStatus) {
        DownloadStatus.DOWNLOAD_COMPLETED -> {
            registerForActivityResult.launch(consentListViewModel.downloadingFileName)
        }

        DownloadStatus.ALL_COMPLETED -> {
            // 完了しましたのtoastを表示
            Toast.makeText(
                context,
                stringResource(id = R.string.ToastText_CompleteDownload),
                Toast.LENGTH_SHORT
            ).show()
            changeDownloadStatus(DownloadStatus.NONE)
        }

        DownloadStatus.ERROR -> {
            // エラーが発生しましたのtoastを表示
            Toast.makeText(
                context,
                stringResource(id = R.string.ToastText_DownloadError),
                Toast.LENGTH_SHORT
            ).show()
            changeDownloadStatus(DownloadStatus.NONE)
        }
        DownloadStatus.NONE -> {
            consentViewModel.setLoading(false)
        }

        else -> {
            consentViewModel.setLoading(true)
        }
    }
}

fun Uri.getFileOutputStream(context: Context): FileOutputStream? {
    val contentResolver = context.contentResolver
    val parcelFileDescriptor = contentResolver.openFileDescriptor(this, "w")
    return parcelFileDescriptor?.let {
        FileOutputStream(it.fileDescriptor)
    }
}

@Composable
fun TableLayoutForConsent(
    tableData: List<ConsentListViewModel.ConsentFileData>,
    columnName: String,
    enabled: Boolean = true,
    onClickDownloadFile: (Int, String) -> Unit
) {
    val columnWeight = 1f // 100%
    LazyVerticalGrid(
        columns = GridCells.Fixed(1),
        Modifier.height(500.dp)
    ) {
        item() {

            Row(
                modifier = Modifier.background(color = Color.LightGray),
            ) {
                TableCellByTextForWearable(text = columnName, columnWeight)
            }
        }

        items(tableData.size) { index ->
            val (boxId, fileName) = tableData[index]
            // 文字を左寄せにする
            Row(
                modifier = Modifier.fillMaxSize(),
                horizontalArrangement = Arrangement.Start,
            ) {
                Text(
                    text = fileName,
                    textAlign = TextAlign.Start,
                    color = Color.Blue,
                    modifier = Modifier
                        .fillMaxSize()
                        .border(1.dp, Color.Black)
                        .padding(12.dp)
                        .clickable(
                            onClick = { onClickDownloadFile(index, boxId) },
                            enabled = enabled
                        )
                )
            }
        }
    }
}

@Composable
fun alertDownload(
    consentListViewModel: ConsentListViewModel,
    consentFileList: List<ConsentListViewModel.ConsentFileData>,
    downloadIndex: Int?,
    fileBoxId: String?,
    alertDialogFlg: Boolean,
) {
    if (alertDialogFlg) {
        AlertDialog(
            onDismissRequest = {
                consentListViewModel.changeDownloadIdentity()
                consentListViewModel.changeAlertDialogFlg(false)
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        consentListViewModel.changeAlertDialogFlg(false)
                        if (downloadIndex != null && fileBoxId != null) {
                            consentListViewModel.startDownload(downloadIndex!!, fileBoxId!!)
                        }
                    }
                ) {
                    Text("OK")
                }
            },
            dismissButton = {
                TextButton(
                    onClick = {
                        consentListViewModel.changeDownloadIdentity()
                        consentListViewModel.changeAlertDialogFlg(false)
                    }
                ) {
                    Text("Cancel")
                }
            },
            title = {
                Text("ファイルダウンロード")
            },
            text = {
                val text = if (downloadIndex != MAX_INT) {
                    "[" + consentFileList[downloadIndex!!].fileName + "] ファイルをダウンロードしますか？"
                } else {
                    "ファイルをダウンロードしますか？"
                }
                Text(text)
            },
        )
    }
}
