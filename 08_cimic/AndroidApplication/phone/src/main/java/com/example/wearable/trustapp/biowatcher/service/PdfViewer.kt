//参考：https://github.com/joaopegoraro/ComposePdfViewer/blob/master/app/src/main/java/xyz/joaophp/composepdfviewer/MainActivity.kt
package com.example.wearable.pdfcomposesample

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.pdf.PdfRenderer
import android.os.ParcelFileDescriptor
import android.util.Log
import androidx.annotation.RawRes
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.lazy.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.painter.BitmapPainter
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.Alignment
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.*
import androidx.compose.foundation.*
import androidx.compose.foundation.gestures.*
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.material3.Card
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.awaitCancellation
import kotlinx.coroutines.launch

enum class PdfListDirection {
    HORIZONTAL, VERTICAL
}

@ExperimentalFoundationApi
@Composable
fun PdfViewer(
    @RawRes pdfResId: Int,
    modifier: Modifier = Modifier,
    backgroundColor: Color = Color(0xFF909090),
    pageColor: Color = Color.White,
    listDirection: PdfListDirection = PdfListDirection.VERTICAL,
    arrangement: Arrangement.HorizontalOrVertical = Arrangement.spacedBy(16.dp),
    fallbackWidget: @Composable () -> Unit = {},
    loadingListener: (
        isLoading: Boolean,
        currentPage: Int?,
        maxPage: Int?,
    ) -> Unit = { _, _, _ -> }
) {
    val context = LocalContext.current
    PdfViewer(
        pdfStream = context.resources.openRawResource(pdfResId),
        modifier = modifier,
        pageColor = pageColor,
        backgroundColor = backgroundColor,
        listDirection = listDirection,
        arrangement = arrangement,
        fallbackWidget = fallbackWidget,
        loadingListener = loadingListener,
    )
}

@ExperimentalFoundationApi
@Composable
fun PdfViewer(
    pdfStream: InputStream,
    modifier: Modifier = Modifier,
    backgroundColor: Color = Color(0xFF909090),
    pageColor: Color = Color.White,
    listDirection: PdfListDirection = PdfListDirection.VERTICAL,
    arrangement: Arrangement.HorizontalOrVertical = Arrangement.spacedBy(16.dp),
    fallbackWidget: @Composable () -> Unit = {},
    loadingListener: (
        isLoading: Boolean,
        currentPage: Int?,
        maxPage: Int?,
    ) -> Unit = { _, _, _ -> }
) {
    PdfViewer(
        pdfStream = pdfStream,
        modifier = modifier,
        backgroundColor = backgroundColor,
        listDirection = listDirection,
        loadingListener = loadingListener,
        arrangement = arrangement,
        fallbackWidget = fallbackWidget
    ) { lazyState, imagem ->
        PaginaPDF(
            imagem = imagem,
            lazyState = lazyState,
            backgroundColor = pageColor
        )
    }
}

@ExperimentalFoundationApi
@Composable
fun PdfViewer(
    @RawRes pdfResId: Int,
    modifier: Modifier = Modifier,
    backgroundColor: Color = Color(0xFF909090),
    listDirection: PdfListDirection = PdfListDirection.VERTICAL,
    arrangement: Arrangement.HorizontalOrVertical = Arrangement.spacedBy(16.dp),
    loadingListener: (
        isLoading: Boolean,
        currentPage: Int?,
        maxPage: Int?,
    ) -> Unit = { _, _, _ -> },
    page: @Composable (LazyListState, ImageBitmap) -> Unit,
    fallbackWidget: @Composable () -> Unit = {}
) {
    val context = LocalContext.current
    PdfViewer(
        pdfStream = context.resources.openRawResource(pdfResId),
        modifier = modifier,
        backgroundColor = backgroundColor,
        listDirection = listDirection,
        arrangement = arrangement,
        loadingListener = loadingListener,
        page = page,
        fallbackWidget = fallbackWidget
    )
}

@ExperimentalFoundationApi
@Composable
fun PdfViewer(
    pdfStream: InputStream,
    modifier: Modifier = Modifier,
    backgroundColor: Color = Color(0xFF909090),
    listDirection: PdfListDirection = PdfListDirection.VERTICAL,
    arrangement: Arrangement.HorizontalOrVertical = Arrangement.spacedBy(16.dp),
    fallbackWidget: @Composable () -> Unit = {},
    loadingListener: (
        isLoading: Boolean,
        currentPage: Int?,
        maxPage: Int?,
    ) -> Unit = { _, _, _ -> },
    page: @Composable (LazyListState, ImageBitmap) -> Unit
) {
    val context = LocalContext.current
    val pagePaths = remember {
        mutableStateListOf<String>()
    }
    val showFallBackWidget = remember {
        mutableStateOf(false)
    }
    LaunchedEffect(true) {
        if (pagePaths.isEmpty()) {
            val paths = context.loadPdf(pdfStream, loadingListener)
            paths?.let {
                pagePaths.addAll(paths)
            } ?: run {
                showFallBackWidget.value = true
            }
        }
    }
    if (showFallBackWidget.value) {
        fallbackWidget()
    } else {
        val lazyState = rememberLazyListState()
        when (listDirection) {
            PdfListDirection.HORIZONTAL ->
                LazyRow(
                    modifier = modifier.background(backgroundColor),
                    state = lazyState,
                    horizontalArrangement = arrangement
                ) {
                    items(pagePaths) { path ->
                        var imageBitmap by remember {
                            mutableStateOf<ImageBitmap?>(null)
                        }
                        LaunchedEffect(path) {
                            imageBitmap = BitmapFactory.decodeFile(path).asImageBitmap()
                        }
                        imageBitmap?.let { page(lazyState, it) }
                    }
                }
            PdfListDirection.VERTICAL ->
                LazyColumn(
                    modifier = modifier.background(backgroundColor),
                    state = lazyState,
                    verticalArrangement = arrangement
                ) {
                    items(pagePaths) { path ->
                        var imageBitmap by remember {
                            mutableStateOf<ImageBitmap?>(null)
                        }
                        LaunchedEffect(path) {
                            imageBitmap = BitmapFactory.decodeFile(path).asImageBitmap()
                        }
                        imageBitmap?.let { page(lazyState, it) }
                    }
                }
        }
    }
}

@ExperimentalFoundationApi
@Composable
private fun PaginaPDF(
    imagem: ImageBitmap,
    lazyState: LazyListState,
    backgroundColor: Color = Color.White
) {
    Card(
        modifier = Modifier.background(backgroundColor),
    ) {
        ZoomableImage(painter = BitmapPainter(imagem), scrollState = lazyState)
    }
}

suspend fun Context.loadPdf(
    inputStream: InputStream,
    loadingListener: (
        isLoading: Boolean,
        currentPage: Int?,
        maxPage: Int?
    ) -> Unit = { _, _, _ -> }
): List<String>? = withContext(Dispatchers.Default) {
    try {
        loadingListener(true, null, null)
        val outputDir = cacheDir
        val tempFile = File.createTempFile("temp", "pdf", outputDir)
        tempFile.mkdirs()
        tempFile.deleteOnExit()
        val outputStream = FileOutputStream(tempFile)
        copy(inputStream, outputStream)
        val input = ParcelFileDescriptor.open(tempFile, ParcelFileDescriptor.MODE_READ_ONLY)
        val renderer = PdfRenderer(input)
        (0 until renderer.pageCount).map { pageNumber ->
            loadingListener(true, pageNumber, renderer.pageCount)
            val file = File.createTempFile("PDFpage$pageNumber", "png", outputDir)
            file.mkdirs()
            file.deleteOnExit()
            val page = renderer.openPage(pageNumber)
            val bitmap = Bitmap.createBitmap(1240, 1754, Bitmap.Config.ARGB_8888)
            page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
            page.close()
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, FileOutputStream(file))
            Log.i("PDF_VIEWER", "Loaded page $pageNumber")
            file.absolutePath.also { Log.d("TEST", it) }
        }.also {
            loadingListener(false, null, renderer.pageCount)
            renderer.close()
        }
    } catch (e: Exception) {
        Log.i("PDF_VIEWER Exception", e.toString())
        loadingListener(false, null, null)
        return@withContext null
    }
}

@Throws(IOException::class)
private fun copy(source: InputStream, target: OutputStream) {
    val buf = ByteArray(8192)
    var length: Int
    while (source.read(buf).also { length = it } > 0) {
        target.write(buf, 0, length)
    }
}

@ExperimentalFoundationApi
@Composable
fun ZoomableImage(
    painter: Painter,
    modifier: Modifier = Modifier,
    backgroundColor: Color = Color.Transparent,
    imageAlign: Alignment = Alignment.Center,
    shape: Shape = RectangleShape,
    maxScale: Float = 1f,
    minScale: Float = 3f,
    contentScale: ContentScale = ContentScale.Fit,
    isRotation: Boolean = false,
    isZoomable: Boolean = true,
    scrollState: ScrollableState? = null
) {
    val coroutineScope = rememberCoroutineScope()

    val scale = remember { mutableStateOf(1f) }
    val rotationState = remember { mutableStateOf(1f) }
    val offsetX = remember { mutableStateOf(1f) }
    val offsetY = remember { mutableStateOf(1f) }

    Box(
        modifier = Modifier
            .clip(shape)
            .background(backgroundColor)
            .combinedClickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = { /* NADA :) */ },
                onDoubleClick = {
                    if (scale.value >= 2f) {
                        scale.value = 1f
                        offsetX.value = 1f
                        offsetY.value = 1f
                    } else scale.value = 3f
                },
            )
            .pointerInput(Unit) {
                if (isZoomable) {
                    forEachGesture {
                        awaitPointerEventScope {
                            awaitFirstDown()
                            do {
                                val event = awaitPointerEvent()
                                scale.value *= event.calculateZoom()
                                if (scale.value > 1) {
                                    scrollState?.run {
                                        coroutineScope.launch {
                                            setScrolling(false)
                                        }
                                    }
                                    val offset = event.calculatePan()
                                    offsetX.value += offset.x
                                    offsetY.value += offset.y
                                    rotationState.value += event.calculateRotation()
                                    scrollState?.run {
                                        coroutineScope.launch {
                                            setScrolling(true)
                                        }
                                    }
                                } else {
                                    scale.value = 1f
                                    offsetX.value = 1f
                                    offsetY.value = 1f
                                }
                            } while (event.changes.any { it.pressed })
                        }
                    }
                }
            }

    ) {
        Image(
            painter = painter,
            contentDescription = null,
            contentScale = contentScale,
            modifier = modifier
                .align(imageAlign)
                .graphicsLayer {
                    if (isZoomable) {
                        scaleX = maxOf(maxScale, minOf(minScale, scale.value))
                        scaleY = maxOf(maxScale, minOf(minScale, scale.value))
                        if (isRotation) {
                            rotationZ = rotationState.value
                        }
                        translationX = offsetX.value
                        translationY = offsetY.value
                    }
                }
        )
    }
}

suspend fun ScrollableState.setScrolling(value: Boolean) {
    scroll(scrollPriority = MutatePriority.PreventUserInput) {
        when (value) {
            true -> Unit
            else -> awaitCancellation()
        }
    }
}