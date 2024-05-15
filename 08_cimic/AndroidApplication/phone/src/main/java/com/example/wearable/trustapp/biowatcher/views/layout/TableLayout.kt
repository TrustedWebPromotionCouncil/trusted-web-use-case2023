package com.example.wearable.trustapp.biowatcher.views.layout

import androidx.compose.foundation.ScrollState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.layout
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun TableLayout(
    columnNames: Array<String>,
    tableData: Map<Float, Float>,
    cellWidth: Dp = 50.dp,
    roundDownFlg: Boolean = true   // tableDataの小数点を切り捨てるかどうか
) {
    Row(
        modifier = Modifier.background(color = Color.LightGray)
    ) {
        columnNames.map {
            TableCellByText(text = it, width = cellWidth)
        }
    }

    Row(
        modifier = Modifier.fillMaxSize()
    ) {
        tableData.map {
            if (roundDownFlg) {
                TableCellByText(text = it.value.toInt().toString(), width = cellWidth)
            } else {
                TableCellByText(text = it.value.toString(), width = cellWidth)
            }
        }
    }
}

@Composable
fun TableLayoutForColumnName(
    columnNames: Array<String>,
    cellWidth: Dp = 50.dp,
) {
    Row(
        modifier = Modifier.background(color = Color.LightGray)
    ) {
        columnNames.map {
            TableCellByText(text = it, width = cellWidth)
        }
    }
}

@Composable
fun TableLayoutForColumnData(
    tableData: Map<String, String>,
    cellWidth: Dp = 50.dp,
) {
    Row(
        modifier = Modifier.background(color = Color.LightGray)
    ) {
        tableData.map {
            TableCellByText(text = it.value, width = cellWidth)
        }
    }
}

//@Composable
//inline fun <reified T> TableLayoutForColumnData(
//    tableData: T,
//    columnNames: Array<String>,
//    cellWidth: Dp = 50.dp,
//) {
//    Row(
//        modifier = Modifier.background(color = Color.LightGray)
//    ) {
//        var mapData = mutableMapOf<String, String>()
//        // tableDataの要素の中身をTextで表示する
//        val clazz = T::class.java
//        // クラスのプロパティを反復処理
//        clazz.declaredFields.forEach { field ->
//            // プロパティがprivateでもアクセス可能にする
//            field.isAccessible = true
//            // columnNamesと同じプロパティ名の場合は、mapDataに追加
//            if (columnNames.contains(field.name)) {
//                mapData[field.name] = field.get(tableData)?.toString() ?: ""
//            }
//        }
//        mapData.map {
//            TableCellByText(text = it.value, width = cellWidth)
//        }
//    }
//}
@Composable
inline fun <reified T> ExtractPropertiesFromObject(
    tableData: T,
    columnNames: Array<String>,
): Map<String, String> {
    var mapData = mutableMapOf<String, String>()
    // tableDataの要素の中身をTextで表示する
    val clazz = T::class.java
    // クラスのプロパティを反復処理
    clazz.declaredFields.forEach { field ->
        // プロパティがprivateでもアクセス可能にする
        field.isAccessible = true
        // columnNamesと同じプロパティ名の場合は、mapDataに追加
        if (columnNames.contains(field.name)) {
            mapData[field.name] = field.get(tableData)?.toString() ?: ""
        }
    }
    return mapData
}

@Composable
inline fun <reified T> TableScreenLayout(
    tableData: List<T>,
    columnNames: Array<String>,
    columnPropertyNames: Array<String>,
    columnWeights: Array<Float>,
) {

    LazyColumn(
        Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Here is the header
        item {
            Row(Modifier.background(Color.Gray)) {
                for (i in columnNames.indices) {
                    TableCell(text = columnNames[i], weight = columnWeights[i])
                }
            }
        }
        // Here are all the lines of your table.
        items(tableData) {
            val rowData = ExtractPropertiesFromObject(it, columnPropertyNames)
            Row(Modifier.fillMaxWidth()) {
                for (i in columnNames.indices) {
                    TableCell(text = rowData[columnNames[i]] ?: "", weight = columnWeights[i])
                }
            }
        }
    }
}

@Composable
fun Table(
    modifier: Modifier = Modifier,
    rowModifier: Modifier = Modifier,
    verticalLazyListState: LazyListState = rememberLazyListState(),
    horizontalScrollState: ScrollState = rememberScrollState(),
    columnCount: Int,
    rowCount: Int,
    beforeRow: (@Composable (rowIndex: Int) -> Unit)? = null,
    afterRow: (@Composable (rowIndex: Int) -> Unit)? = null,
    cellContent: @Composable (columnIndex: Int, rowIndex: Int) -> Unit
) {
    val columnWidths = remember { mutableStateMapOf<Int, Int>() }
    val columnHeights = remember { mutableStateMapOf<Int, Int>() }

    Box(modifier = modifier.height(400.dp).padding(8.dp).horizontalScroll(horizontalScrollState)) {
        LazyColumn(state = verticalLazyListState) {
            items(rowCount) { rowIndex ->
                Column(modifier = Modifier.padding(start = 8.dp, end = 8.dp)) {
                    beforeRow?.invoke(rowIndex)

                    Row(modifier = rowModifier.border(1.dp, Color.Black)) {
                        (0 until columnCount).forEach { columnIndex ->
                            if(rowIndex== 0){
                                Box(
                                    modifier = Modifier
                                        .border(1.dp, Color.Black)
                                        .background(Color.Gray)
                                        .padding(8.dp)
                                        .layout { measurable, constraints ->
                                            val placeable = measurable.measure(constraints)

                                            val existingWidth = columnWidths[columnIndex] ?: 0
                                            val maxWidth = maxOf(existingWidth, placeable.width)

                                            if (maxWidth > existingWidth) {
                                                columnWidths[columnIndex] = maxWidth
                                            }
                                            val existingHeight = columnHeights[columnIndex] ?: 0
                                            val maxHeight = maxOf(existingHeight, placeable.height)

                                            layout(width = maxWidth, height = maxHeight) {
                                                placeable.placeRelative(0, 0)
                                            }
                                        }) {
                                    cellContent(columnIndex, rowIndex)
                                }
                            }else{
                                Box(
                                    modifier = Modifier
                                        .border(1.dp, Color.Black)
                                        .padding(8.dp)
                                        .layout { measurable, constraints ->
                                            val placeable = measurable.measure(constraints)

                                            val existingWidth = columnWidths[columnIndex] ?: 0
                                            val maxWidth = maxOf(existingWidth, placeable.width)

                                            if (maxWidth > existingWidth) {
                                                columnWidths[columnIndex] = maxWidth
                                            }
                                            val existingHeight = columnHeights[columnIndex] ?: 0
                                            val maxHeight = maxOf(existingHeight, placeable.height)

                                            layout(width = maxWidth, height = maxHeight) {
                                                placeable.placeRelative(0, 0)
                                            }
                                        }) {
                                    cellContent(columnIndex, rowIndex)
                                }
                            }
                        }
                    }

                    afterRow?.invoke(rowIndex)
                }
            }
        }
    }
}

//@Composable
//fun TableScreen() {
//    // Just a fake data... a Pair of Int and String
//    val tableData = (1..100).mapIndexed { index, item ->
//        index to "Item $index"
//    }
//    // Each cell of a column must have the same weight.
//    val column1Weight = .3f // 30%
//    val column2Weight = .7f // 70%
//    // The LazyColumn will be our table. Notice the use of the weights below
//    LazyColumn(Modifier.fillMaxSize().padding(16.dp)) {
//        // Here is the header
//        item {
//            Row(Modifier.background(Color.Gray)) {
//                TableCell(text = "Column 1", weight = column1Weight)
//                TableCell(text = "Column 2", weight = column2Weight)
//            }
//        }
//        // Here are all the lines of your table.
//        items(tableData) {
//            val (id, text) = it
//            Row(Modifier.fillMaxWidth()) {
//                TableCell(text = id.toString(), weight = column1Weight)
//                TableCell(text = text, weight = column2Weight)
//            }
//        }
//    }
//}
@Composable
fun RowScope.TableCell(
    text: String,
    weight: Float
) {
    Text(
        text = text,
        Modifier
            .border(1.dp, Color.Black)
            .weight(weight)
            .padding(8.dp)
    )
}

@Composable
fun TableCell(
    text: String,
) {
    Text(
        text = text,
        Modifier
            .border(1.dp, Color.Black)
            .padding(8.dp)
    )
}

@Composable
fun TableCell1(
    text: String,
) {
    Text(
        text = text,
        Modifier
            .background(Color.Gray)
    )
}

@Composable
fun TableCellByText(
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

