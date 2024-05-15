package com.example.wearable.trustapp.biowatcher.infrastructure.network

//import android.content.Context
//import androidx.room.Room
import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.wearable.trustapp.biowatcher.infrastructure.dao.HeartRateDao
import com.example.wearable.trustapp.biowatcher.infrastructure.dao.StepDao
import com.example.wearable.trustapp.biowatcher.domain.entity.HeartRate
import com.example.wearable.trustapp.biowatcher.domain.entity.Step
import com.example.wearable.trustapp.biowatcher.common.Constants.DATABASE_NAME

@Database(
    entities = [
        HeartRate::class,   // 心拍数
        Step::class,        // 歩数
    ],
    version = 1,
    exportSchema = true // データベースのスキーマをエクスポートするかどうか
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun heartRateDao(): HeartRateDao
    abstract fun stepDao(): StepDao

    // シングルトンパターン
    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    DATABASE_NAME
                )
                    .fallbackToDestructiveMigration()   // Version違ってMigrationなかったら削除
                    .build()
                    .also { INSTANCE = it }
            }
        }
    }
}