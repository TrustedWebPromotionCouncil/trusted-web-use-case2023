package com.example.wearable.trustapp.biowatcher.viewModel.consent

import android.app.Application
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.SavedStateHandle
import com.example.wearable.trustapp.biowatcher.common.Constants.STUDY_HOSPITAL_ID
import com.example.wearable.trustapp.biowatcher.common.Constants.STUDY_HOSPITAL_NAME
import com.example.wearable.trustapp.biowatcher.common.Constants.STUDY_SUBJECT_ID


class ConsentViewModel(
    application: Application,
    savedStateHandle: SavedStateHandle,
) : MainViewModel(application) {
    // 試験・病院ID
    val studySubjectId: String = checkNotNull(savedStateHandle[STUDY_SUBJECT_ID])
    val studyHospitalId: String = checkNotNull(savedStateHandle[STUDY_HOSPITAL_ID])
    val studyHospitalName: String = checkNotNull(savedStateHandle[STUDY_HOSPITAL_NAME])
    val studySiteName: String get() = STUDY_SITE + studyHospitalName
    private val _isLoading = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading
    fun setLoading(loading: Boolean) {
        _isLoading.value = loading
    }

    // 画面遷移
    private val _navigationList: MutableLiveData<ConsentPage> = MutableLiveData(ConsentPage.MAIN)
    var navigationList: LiveData<ConsentPage> = _navigationList
    fun changePageList(page: ConsentPage) {
        _navigationList.value = page
    }

    init {
        Log.i(TAG, "init Start")
        setLoading(false)   // ローディングフラグをfalseにする
        Log.i(TAG, "init End")
    }


    // ログ用オブジェクト
    companion object {
        private const val TAG = "ConsentViewModel"
        private const val STUDY_SITE = "試験-病院 : "
    }
}

// enumでページリスト
enum class ConsentPage {
    MAIN, CONSENT_DOCUMENT_LIST, CONSENT_HISTORY
}

enum class ConsentAction {
    NONE,
    CONSENT,
    RECONSENT,
    WITHDRAW,
}
