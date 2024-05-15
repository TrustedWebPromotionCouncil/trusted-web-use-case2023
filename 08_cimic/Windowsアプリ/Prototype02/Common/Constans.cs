using System;
using System.Drawing;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace Prototype02.Common
{
    public static class Constans
    {
        //----------------------------------------------------------------------------------------------------
        // アプリケーケーション情報
        //----------------------------------------------------------------------------------------------------
        public const string APPL_MANUFACTURER = "CMIC";      //プログラム提供元名
        public const string APPL_PRODUCT_NAME = "CT-Chain-Prototype02"; //プロダクト名
        public const string APPL_MUTEX_NAME = "MUTEX_" + APPL_MANUFACTURER + "_" + APPL_PRODUCT_NAME;   //ミューテックス


        //----------------------------------------------------------------------------------------------------
        // 全体
        //----------------------------------------------------------------------------------------------------
        public const string FILE_ENCODE = "UTF-8";                      //ファイル文字コード
        public const string FORMAT_DATE = "yyyy/MM/dd";                 //日付けフォーマット
        public const string FORMAT_DATE_TIME = "yyyy/MM/dd HH:mm:ss";   //日時フォーマット
        public const string FORMAT_DATE_JP = "yyyy年MM月dd日";          //日付けフォーマット(日本語)


        //----------------------------------------------------------------------------------------------------
        // データ保存
        // ※１：Environment.SpecialFolder.ApplicationData直下に作成
        // ※２：Environment.SpecialFolder.CommonApplicationData直下に作成
        //----------------------------------------------------------------------------------------------------
        public const string LOGIN_USER_FILE = "setting.dat";    //Windowsログインユーザ毎の情報保存ファイル名（※１）
        public const string DATA_FOLDER = "Data";               //アプリケーション共通データフォルダー名（※２）
        public const string SETTING_FOLDER = "Settings";        //ユーザ個別設定ファイルフォルダー名（※２）
        public const string PATIENT_FOLDER = "Patinets";        //患者一覧ファイルフォルダー名（※２）
        public const string FILTER_FOLDER = "Filters";          //登録済みフィルターファイルフォルダー名（※２）
        public const string SETTING_FILE_EXT = ".dat";          //ユーザ個別設定ファイルの拡張子

        //----------------------------------------------------------------------------------------------------
        // ログファイル設定
        // ※保持期間はconfigファイルにて設定
        // ※Environment.SpecialFolder.CommonApplicationData + APPL_MANUFACTURER + APPL_PRODUCT_NAME 以下にフォルダを作成
        //----------------------------------------------------------------------------------------------------
        public const string LOG_FOLDER = "Logs";                    //ログ出力先フォルダー名
        public const string LOG_FILE = APPL_PRODUCT_NAME + ".log";  //ログファイル名（このファイルの拡張子前に_yyyyMMddが設定される）

        //----------------------------------------------------------------------------------------------------
        // その他
        //----------------------------------------------------------------------------------------------------
        public const string FILE_SIZE_LIMIT = "1000000";                    //ファイルサイズの上限Byte数

        //----------------------------------------------------------------------------------------------------
        // デザイン
        //----------------------------------------------------------------------------------------------------
        //public System.Drawing.Color BAKC_COLOR = Color.FromArgb(84, 188, 235);


        //----------------------------------------------------------------------------------------------------
        // コンタクトリストの区分
        //----------------------------------------------------------------------------------------------------
        public const string CONTACT_DIV_PATICIPANT = "P";
        public const string CONTACT_DIV_SUBJECT = "S";

        public static Color GeBackClor()
        {
            return Color.FromArgb(84, 188, 235);
        }
    }
}
