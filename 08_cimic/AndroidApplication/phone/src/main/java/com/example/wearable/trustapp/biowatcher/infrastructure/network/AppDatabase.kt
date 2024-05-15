package com.example.wearable.trustapp.biowatcher.infrastructure.network

//import android.content.Context
//import androidx.room.Room
import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.wearable.trustapp.BuildConfig
import com.example.wearable.trustapp.biowatcher.infrastructure.dao.EncryptDao
import com.example.wearable.trustapp.biowatcher.domain.entity.EncryptEntity
import com.example.wearable.trustapp.biowatcher.common.Constants.DATABASE_NAME
import com.example.wearable.trustapp.biowatcher.common.Constants.DEVICE_TABLE
import com.example.wearable.trustapp.biowatcher.common.Constants.FITBIT_ID
import com.example.wearable.trustapp.biowatcher.common.Constants.FITBIT_TOKEN_TABLE
import com.example.wearable.trustapp.biowatcher.domain.entity.DeviceEntity
import com.example.wearable.trustapp.biowatcher.domain.entity.FitbitTokenEntity
import com.example.wearable.trustapp.biowatcher.domain.entity.StudySubjectEntity
import com.example.wearable.trustapp.biowatcher.infrastructure.dao.DeviceDao
import com.example.wearable.trustapp.biowatcher.infrastructure.dao.FitbitTokenDao
import com.example.wearable.trustapp.biowatcher.infrastructure.dao.StudySubjectDao

@Database(
    entities = [
        EncryptEntity::class,       // ウェアラブルデータ
        StudySubjectEntity::class,  // 試験病院-被験者テーブル
        DeviceEntity::class,        // デバイステーブル
        FitbitTokenEntity::class,   // FitbitTokenテーブル
    ],
    version = 1, // データベースのバージョン
    exportSchema = true // データベースのスキーマをエクスポートするかどうか
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun encryptDataDao(): EncryptDao
    abstract fun studySubjectDao(): StudySubjectDao
    abstract fun deviceDao(): DeviceDao
    abstract fun fitbitTokenDao(): FitbitTokenDao

    // シングルトンパターン
    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    DATABASE_NAME
                )
                    .fallbackToDestructiveMigration()   // Version違ってMigrationなかったら削除
//                    .addMigrations(MIGRATION_1_2)
                    .addCallback(object : Callback() {
                        override fun onCreate(database: SupportSQLiteDatabase) {
                            super.onCreate(database)
                            // BuildConfigにFitbit情報が入力されていない場合は、初期データを追加しない
                            if (BuildConfig.FITBIT_CLIENT_ID_01.isNullOrEmpty() ||
                                BuildConfig.FITBIT_AUTH_CODE_01.isNullOrEmpty() ||
                                BuildConfig.FITBIT_CLIENT_SECRET_01.isNullOrEmpty() ||
                                BuildConfig.FITBIT_ACCESS_TOKEN_01.isNullOrEmpty() ||
                                BuildConfig.FITBIT_REFRESH_TOKEN_01.isNullOrEmpty() ||
                                BuildConfig.FITBIT_USER_ID.isNullOrEmpty()) {
                                return
                            }

                            database.beginTransaction()
                            try {
                                // デバイステーブルに初期データ(Fitbit)を追加
                                database.execSQL(getSqlInsertDevice())
                                // FitbitTokenテーブルに初期データを追加
                                database.execSQL(getSqlInsertFitbitToken(
                                    BuildConfig.FITBIT_CLIENT_ID_01,
                                    BuildConfig.FITBIT_AUTH_CODE_01,
                                    BuildConfig.FITBIT_CLIENT_SECRET_01,
                                    BuildConfig.FITBIT_ACCESS_TOKEN_01,
                                    BuildConfig.FITBIT_REFRESH_TOKEN_01,
                                    BuildConfig.FITBIT_USER_ID
                                ))

                                // コミット
                                database.setTransactionSuccessful()
                            } finally {
                                database.endTransaction()
                            }
                        }
                    })
                    .build()
                    .also { INSTANCE = it }
            }
        }

        private val MIGRATION_1_2 = object : Migration(1, 2) {
            override fun migrate(database: SupportSQLiteDatabase) {
                database.beginTransaction()
                try {
                    // デバイステーブルに初期データ(Fitbit)を追加
                    database.execSQL(getSqlInsertDevice())
                    // FitbitTokenテーブルに初期データを追加
                    database.execSQL(getSqlInsertFitbitToken(
                        BuildConfig.FITBIT_CLIENT_ID_01,
                        BuildConfig.FITBIT_AUTH_CODE_01,
                        BuildConfig.FITBIT_CLIENT_SECRET_01,
                        BuildConfig.FITBIT_ACCESS_TOKEN_01,
                        BuildConfig.FITBIT_REFRESH_TOKEN_01,
                        BuildConfig.FITBIT_USER_ID
                    ))

                    // コミット
                    database.setTransactionSuccessful()
                } finally {
                    database.endTransaction()
                }
            }
        }
        // デバイステーブルに初期データ(Fitbit)を追加
        fun getSqlInsertDevice(): String {
            return """
                INSERT INTO $DEVICE_TABLE (
                    device_type_id,
                    device_uri,
                    device_name,
                    device_sub_name,
                    is_valid,
                    created_at,
                    updated_at
                ) VALUES (
                    $FITBIT_ID,
                    "",
                    "Fitbit",
                    "",
                    true,
                    "2023/12/14 22:39:57",
                    "2023/12/14 22:39:57"
                )
                """.trimIndent()
        }

        // FitbitTokenテーブルに初期データを追加
        fun getSqlInsertFitbitToken(
            fitbitClientId : String,
            fitbitAuthCode : String,
            fitbitClientSecret : String,
            fitbitAccessToken : String,
            fitbitRefreshToken : String,
            fitbitUserId : String
            ): String {
            return """
                INSERT INTO $FITBIT_TOKEN_TABLE (
                    device_id,
                    client_id,
                    auth_code,
                    client_secret,
                    access_token,
                    refresh_token,
                    user_id,
                    created_at,
                    updated_at
                )
                    SELECT id,
                    "$fitbitClientId",
                    "$fitbitAuthCode",
                    "$fitbitClientSecret",
                    "$fitbitAccessToken",
                    "$fitbitRefreshToken",
                    "$fitbitUserId",
                    "2023/12/28 16:29:00",
                    "2023/12/28 16:29:00"
                    FROM $DEVICE_TABLE 
                    WHERE device_type_id = $FITBIT_ID
                """.trimIndent()
        }
    }
}