package com.example.wearable.trustapp.biowatcher.viewModel.studySite

import android.app.Application
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.example.wearable.trustapp.biowatcher.common.RequestDataList
import com.example.wearable.trustapp.biowatcher.common.Util
import com.example.wearable.trustapp.biowatcher.common.Util.Companion.jsonDecode
import com.example.wearable.trustapp.biowatcher.common.WebResponseData
import com.example.wearable.trustapp.biowatcher.domain.repository.StudySubjectRepository
import com.example.wearable.trustapp.biowatcher.infrastructure.network.AppDatabase
import com.example.wearable.trustapp.biowatcher.infrastructure.repository.StudySubjectRepositoryImpl
import com.example.wearable.trustapp.biowatcher.service.WebRequestService
import com.example.wearable.trustapp.mobile.BaseApplication
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

class StudySiteViewModel(application: Application) : MainViewModel(application) {
    // ドロップダウンリスト[データ種類, データ形式]
    private val _selectedStudySubjectId: MutableLiveData<String> = MutableLiveData("")
    private val _selectedStudyHospitalName: MutableLiveData<String> = MutableLiveData("")
    private val _selectedHospitalId: MutableLiveData<String> = MutableLiveData("")
    val selectedStudySubjectId: LiveData<String> = _selectedStudySubjectId
    val selectedStudyHospitalName: LiveData<String> = _selectedStudyHospitalName
    val selectedHospitalId: LiveData<String> = _selectedHospitalId
    fun changeSelectedItem(studySubject: StudySubject) {
        Log.d(
            TAG,
            "changeSelectedItem: studySubject.studySubjectId: ${studySubject.studySubjectId}"
        )
        Log.d(
            TAG,
            "changeSelectedItem: studySubject.studyHospitalId: ${studySubject.studyHospitalId}"
        )
        Log.d(
            TAG,
            "changeSelectedItem: studySubject.studyHospitalName: ${studySubject.studyHospitalName}"
        )
        _selectedStudySubjectId.value = studySubject.studySubjectId
        _selectedHospitalId.value = studySubject.studyHospitalId
        _selectedStudyHospitalName.value = studySubject.studyHospitalName
    }

    private val _studySubjectLiveList: MutableLiveData<List<StudySubject>> = MutableLiveData()
    val studySubjectLiveList: LiveData<List<StudySubject>> = _studySubjectLiveList

    // コルーチン
    private val job = SupervisorJob()
    private val scope = CoroutineScope(Dispatchers.IO + job)

    // DB
    private var studySubjectRepository: StudySubjectRepository? = null

    // ローディングフラグ(試験-病院リスト取得中)
    private val _isLoading: MutableLiveData<Boolean> = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading

    init {
        // リポジトリ取得(シングルトン)
        studySubjectRepository = StudySubjectRepositoryImpl(
            AppDatabase.getInstance(application.applicationContext).studySubjectDao()
        )
        scope.launch {
            getStudySite()
        }
    }

    // 試験－病院取得
    private suspend fun getStudySite() {
        // StudySubjectEntityの取得
        Log.d(TAG, "getStudySite START ")
        val studySubjectList = studySubjectRepository?.getAll()
        var count = studySubjectList?.count()
        var loopCount = 0
        var tmpStudySubjectList: MutableList<StudySubject> = mutableListOf()
        studySubjectList?.forEach { studySubject ->
            _isLoading.postValue(true)  // ローディング開始
            try {
                Log.i(TAG, "studySubjectList: $studySubject")
                val request = RequestDataList().getRequestData(
                    RequestDataList.RequestDataKind.StudyHospitalList,
                    arrayOf(studySubject.studySubjectId.toString()),
                    mapOf()
                )
                WebRequestService(getApplication<BaseApplication>().applicationContext).requestSaveData(
                    webRequestData = request
                ) { studyHospital ->
                    try {
                        if (!Util.isValidResponseJsonString(studyHospital)) {
                            Log.e(TAG, "studyHospital(callback) : $studyHospital")
                            _isLoading.postValue(false)  // ローディング終了
                            return@requestSaveData
                        }
                        // studyHospitalListにstudyHospitalを追加
                        val studyHospital = jsonDecode<WebResponseData.StudyHospital>(studyHospital)
                        tmpStudySubjectList.add(
                            StudySubject(
                                studySubjectId = studySubject.studySubjectId.toString(),
                                studyHospitalId = studyHospital.studyHospitalId.toString(),
                                studyHospitalName = studyHospital.studyHospitalName
                            )
                        )
                    } catch (e: Exception) {
                        Log.e(TAG, "getStudySite : $e")
                    }
                    loopCount++
                    if (count == loopCount) {
                        // tmpStudySubjectListを昇順に修正して、_studySubjectLiveListにセット
                        tmpStudySubjectList.sortBy { it.studySubjectId }
                        _studySubjectLiveList.postValue(tmpStudySubjectList)
                        _isLoading.postValue(false)  // ローディング終了
                        Log.i(TAG, "getStudySite END ")
                    }
                }
            } catch (e: Exception) {
                _isLoading.postValue(false)  // ローディング終了
                Log.e(TAG, "getStudySite : $e")
            }
        }
    }

    // ログ用オブジェクト
    companion object {
        private const val TAG = "StudySiteViewModel"
//        const val PERSONA_ALREADY_EXISTS = "Persona already exists"
    }
}


data class StudySubject(
    val studySubjectId: String,
    val studyHospitalId: String,
    val studyHospitalName: String,
)