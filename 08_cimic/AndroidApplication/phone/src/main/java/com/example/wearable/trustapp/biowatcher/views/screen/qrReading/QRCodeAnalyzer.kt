package com.example.wearable.trustapp.biowatcher.views.screen.qrReading

import android.annotation.SuppressLint
import android.util.Log
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage

class QRCodeAnalyzer(private val onQrDetected: (code: String) -> Unit) : ImageAnalysis.Analyzer {
    private val qrScannerOptions: BarcodeScannerOptions
        get() {
            return BarcodeScannerOptions.Builder()
                .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
                .build()
        }
    private val qrScanner = BarcodeScanning.getClient(qrScannerOptions)

    @SuppressLint("UnsafeOptInUsageError")
    override fun analyze(image: ImageProxy) {
        val mediaImage = image.image
        // カメラから上手く画像を取得することができているとき
        if (mediaImage != null) {
            // CameraXで取得した画像をInputImage形式に変換する
            val adjustedImage =
                InputImage.fromMediaImage(mediaImage, image.imageInfo.rotationDegrees)

            qrScanner.process(adjustedImage)
                .addOnSuccessListener {
                    if (it.isNotEmpty()) {
                        onQrDetected(it[0].rawValue.toString())
                    }
                }
                .addOnCompleteListener { image.close() }
        }
    }
}