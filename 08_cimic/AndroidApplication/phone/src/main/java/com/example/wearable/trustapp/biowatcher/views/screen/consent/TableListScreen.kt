package com.example.wearable.trustapp.biowatcher.views.screen.consent


import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import com.example.wearable.trustapp.biowatcher.views.layout.Table

@Composable
fun TableListScreen(
    navController: NavHostController,
    modifier: Modifier = Modifier,
    columnCount: Int,
    rowCount: Int,
    documentColumnName: Array<String>,
    documentListArray: List<Array<String>>
) {
    // 同意履歴
    Row {
        Box {
            Table(
                columnCount = columnCount,
                rowCount = rowCount + 1,
                cellContent = { columnIndex, rowIndex ->
                    if (rowIndex == 0) {
                        Text(documentColumnName[columnIndex] + "　")    // 半角数字のみの文字と罫線の下側がずれるため、全角空白入れている
                    } else {
                        Text(documentListArray[rowIndex - 1][columnIndex] + "　") // 半角数字のみの文字と罫線の下側がずれるため、全角空白入れている
                    }
                })
        }
    }
}

