package com.example.wearable.trustapp.biowatcher.common

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

class WebResponseData {
    @Serializable
    data class BooleanResponse(
        @SerialName("result") val result: String,   // true or false
    )

    @Serializable
    data class FitbitTokenResponse(
        @SerialName("user_id") val userId: String,
        @SerialName("access_token") val accessToken: String,
        @SerialName("refresh_token") val refreshToken: String,
    )

    @Serializable
    data class FitbitHeartRateTimeSeriesResponse(
        @SerialName("activities-heart") val activitiesHeart: List<ActivitiesHeart>
    )

    @Serializable
    data class ActivitiesHeart(
        @SerialName("dateTime") val dateTime: String,
        @SerialName("value") val value: HeartRateValue,
    )

    @Serializable
    data class HeartRateValue(
        @SerialName("heartRateZones") val heartRateZones: List<HeartRateZone>
    )

    @Serializable
    data class HeartRateZone(
        @SerialName("max") val max: Int,
        @SerialName("min") val min: Int,
        @SerialName("minutes") val minutes: Int,
        @SerialName("name") val name: String,
    )

    @Serializable
    data class FitbitPulseIntradayResponse(
        @SerialName("activities-heart-intraday") val activitiesHeartIntraday: ActivitiesHeartIntraday
    )
    @Serializable
    data class ActivitiesHeartIntraday(
        @SerialName("dataset") val dataset: List<IntradayDataset>
    )
    @Serializable
    data class IntradayDataset(
        @SerialName("time") val time: String,
        @SerialName("value") val value: Int,
    )

    @Serializable
    data class StudySubjectContactListResponse(
        @SerialName("subject_devices") val subjectDeviceUri: List<SubjectDeviceUri?>?,
        @SerialName("participants") val participantUri: List<ParticipantUri?>?,
    )

    @Serializable
    data class SubjectDeviceUri(
        @SerialName("device_uri") val uri: String?,
    )

    @Serializable
    data class ContactDevicesList(
        @SerialName("study_subject_id") val studySubjectId: Int?,
        @SerialName("participants") val participants: List<ParticipantUri?>,
    )

    @Serializable
    data class ParticipantUri(
        @SerialName("uri") val uri: String?,
        @SerialName("name") val name: String?,
        @SerialName("sub_name") val subName: String?,
    )

    // 試験－病院データ
    @Serializable
    data class StudyHospital(
        @SerialName("id") val studyHospitalId: Int,  //study_hospital_id
        @SerialName("study_hospital_name") val studyHospitalName: String,
    )

    // 同意文書
    @Serializable
    data class ConsentDocument(
        @SerialName("id") val id: Int,
        @SerialName("ic_type") val icType: String,
        @SerialName("ic_number") val icNumber: Int,
        @SerialName("ic_number_seq") val icNumberSeq: Int,
        @SerialName("ic_doc") val icDocId: Int?,
        @SerialName("ic_signdoc_nm") val icSignDocNm: String?,
        @SerialName("ic_signdoc_box_id") val icSignDocBoxId: String?,
        @SerialName("esign_status") val eSignStatus: String?,
        @SerialName("box_id_subject") val subjectDirBoxId: String?,
    )

    // 同意済み文書一覧
    @Serializable
    data class ConsentAfterDocumentList(
        @SerialName("id") val id: Int,
        @SerialName("study_subject") val studySubject: Int,
        @SerialName("ic_number") val icNumber: Int,
        @SerialName("ic_number_seq") val icNumberSeq: Int,
        @SerialName("ic_type") val icType: String,
        @SerialName("esign_date") val eSignDate: String?,
        @SerialName("esign_status") val eSignStatus: String?,
        @SerialName("esign_signer_id") val eSignSignerId: Int?,
        @SerialName("esign_signer") val eSignSigner: Participant?,
        @SerialName("ic_signdoc_nm") val icSignDocNm: String?,
        @SerialName("ic_signdoc_box_id") val icSignDocBoxId: String?,
        @SerialName("withdraw_reason") val withdrawReason: String?,
        @SerialName("ic_doc") val icDoc: Int?,
        @SerialName("created") val created: String?,
        @SerialName("updated") val updated: String?,
    )

    // 同意履歴文書
    @Serializable
    data class ConsentHistoryDocument(
        @SerialName("id") val id: Int,
        @SerialName("ic_number") val icNumber: Int,
        @SerialName("ic_number_seq") val icNumberSeq: Int,
        @SerialName("ic_number-ic_number_seq") val icNumberAndSeq: String,
        @SerialName("ic_type") val icType: String,
        @SerialName("ic_doc") val icDoc: Int?,
        @SerialName("esign_date") val eSignDate: String?,
        @SerialName("esign_status") val eSignStatus: String?,
        @SerialName("esign_signer_id") val eSignSignerId: Int?,
        @SerialName("esign_signer") val eSignSigner: Participant?,
        @SerialName("ic_signdoc_nm") val icSignDocNm: String?,
        @SerialName("ic_signdoc_box_id") val icSigndocBoxId: String?,
        @SerialName("study_subject") val studySubject: Int?,
        @SerialName("withdraw_reason") val withdrawReason: String?,
        @SerialName("created") val created: String?,
        @SerialName("updated") val updated: String?,
    )

    @Serializable
    data class SubjectDevice(
        @SerialName("id") val id: Int,
        @SerialName("study_subject_id") val studySubjectId: Int,
        @SerialName("subject_device_id") val subjectDeviceId: Int,
        @SerialName("is_valid") val isValid: Boolean,
    )

    @Serializable
    data class SaveDevice(
        @SerialName("id") val id: Int,
        @SerialName("study_subject_id") val studySubjectId: Int,
        @SerialName("is_valid") val isValid: Boolean,
    )

    @Serializable
    data class Participant(
        @SerialName("id") val id: Int,
        @SerialName("name") val name: String,
    )

    @Serializable
    data class DeviceMaster(
        @SerialName("devices") val devices: List<Device>,
        @SerialName("activities") val activities: List<Activity>,
    )

    @Serializable
    data class Device(
        @SerialName("id") val id: Int,
        @SerialName("device_name") val deviceName: String,
    )
    @Serializable
    data class StudySubjectStatus(
        @SerialName("status") val status: String,
    )

    @Serializable
    data class EncryptData(
        @SerialName("subject_device_id") val subjectDeviceid: Int,
        @SerialName("activity_id") val activityId: Int,
        @SerialName("collected_date") val collectedDate: String,    // yyyy-MM-dd
        @SerialName("encrypted_data") val data: String
    )

    @Serializable
    data class Activity(
        @SerialName("id") val id: Int,
        @SerialName("device_id") val deviceId: Int,
        @SerialName("activity_name") val activityName: String,
    )

    @Serializable
    data class AuditTrail(
        @SerialName("date_of_action") val dateOfAction: String,
        @SerialName("name") val name: String,
        @SerialName("sub_name") val subName: String,
        @SerialName("action_user_id") val actionUserId: String,
        @SerialName("action") val action: String,
        @SerialName("contact_list") val contactList: String,
        @SerialName("file_name") val fileName: String,
        @SerialName("study_hospital_id") val studyHospitalId: Int,
        @SerialName("study_subject_id") val studySubjectId: Int,
        @SerialName("hash") val hash: String,
    )

}