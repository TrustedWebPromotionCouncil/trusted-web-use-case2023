
using Prototype02.Common;
using Prototype02.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Prototype02.Common
{
    public static class Logger
    {
        /*LogTimingGetData
         * 外部定数
         */
        public const string LogTimingSystemError = "99";	//本ツールの想定外のエラー発生時
        public const string LogTimingOther = "00";          //その他（デバッグ等）
        public const string LogTimingEncriptConfirm = "01"; //暗号化時の試験確認のログ
        public const string LogTimingErrorDialog = "90";    //エラーダイアログが表示された場合のメッセージ

        /*
         * 内部定数
         */
        private const string LOG_DIV_ERROR = "ERROR";
        private const string LOG_DIV_INFO = "INFO";
        private const string LOG_DIV_WARNING = "WARNING";
        private const string LOG_DIV_DEBUG = "DEBUG";

        /*
         * 内部変数
         */
        private static string logFolder = "";

        /*
         * コンストラクタ（静的）
         */
        static Logger()
        {
            logFolder = Util.GetLogPath();
            //存在しない場合は作成する
            if (!Directory.Exists(logFolder)) Directory.CreateDirectory(logFolder);

            logFolder += Path.DirectorySeparatorChar;
        }

        /*
         * エラーログを出力する
         */
        public static void Error(string value)
        {
            string message = Util.GetResourceString("L9000");
            message = string.Format(message, value);
            WriteLog(LOG_DIV_ERROR, LogTimingSystemError, message);
        }
        /*
         * エラーログを出力する
         */
        public static void Error(Exception e)
        {
            List<string> values = new List<string>();
            values.Add(e.Message);
            values.Add(e.StackTrace);
            /*
            //一つ前のスタックを取得
            StackFrame callerFrame = new StackFrame(2);
            //メソッド名
            string methodName = callerFrame.GetMethod().Name;
            //クラス名
            string className = callerFrame.GetMethod().ReflectedType.FullName;
            */

            string message = Util.GetResourceString("L9000");
            message = string.Format(message, string.Join(Environment.NewLine, values));

            WriteLog(LOG_DIV_ERROR, LogTimingSystemError, message);
        }
        /*
         * インフォログを出力する
         */
        public static void Info(string timing, string value)
        {
            WriteLog(LOG_DIV_INFO, timing, value);
        }
        /*
         * ワーニングログを出力する
         */
        public static void Warning(string timing, string value)
        {
            WriteLog(LOG_DIV_WARNING, timing, value);
        }
        /*
         * ワーニングログを出力する
         */
        public static void Debug(string value)
        {
            if (MainModel.Config.Debug)
            {
                WriteLog(LOG_DIV_DEBUG, LogTimingOther, value);
            }
        }

        /*
         * ログ出力の共通処理
         */
        private static void WriteLog(string div, string timing, string value)
        {
            //ファイルパスを取得する
            string path = GetLogFile();

            //ファイルが存在していない場合はローテーション処理を行う
            if (!File.Exists(path)) RotationFile();

            //ログフォーマット
            List<string> items = new List<string>();
            DateTime now = DateManager.Now();

            items.Add(now.ToString("yyyy/MM/dd"));      //日付
            items.Add(now.ToString("HH:mm:ss,FFF"));    //時間
            items.Add(div);                             //ログ区分
            //items.Add(MainModel.CurrentUser.UserId);    //実行ユーザID
            items.Add(timing);                          //タイミング
            items.Add(value);                           //ログ内容

            string line = string.Join("\t", items);

            //書き出す
            using (StreamWriter sw = new StreamWriter(path, true, Encoding.GetEncoding(Constans.FILE_ENCODE)))
            {
                sw.WriteLine(line);
            }
        }

        /*
         * ファイルパスを生成して返す
         */
        private static string GetLogFile(int split = 0)
        {
            string file = Path.GetFileNameWithoutExtension(Constans.LOG_FILE);
            string ext = Path.GetExtension(Constans.LOG_FILE);
            string eda = (split > 0) ? "-" + (split + 1).ToString() : "";
            file = logFolder + file + '_' + DateManager.Now().ToString("yyyyMM") + eda + ext;

            //ファイルが存在していて、規定サイズよりも大きかった場合は再起して再取得する
            if (MainModel.Config.LogMaxSize > 0 && File.Exists(file))
            {
                FileInfo info = new FileInfo(file);
                long maxSize = MainModel.Config.LogMaxSize * 1024 * 1024;
                if (info.Length >= maxSize)
                {
                    file = GetLogFile(++split);
                }
            }
            return file;
        }

        /*
         * ログファイルローテーション
         */
        private static void RotationFile()
        {
            //保持期間がマイナスの場合はローテーションを行わない
            if (MainModel.Config.LogKeepMonth < 0) return;

            //ディレクトリが存在しない場合はローテーションを行わない
            string path = Util.GetLogPath();
            if (!Directory.Exists(path)) return;

            //ログファイル名を取得
            string fileName = Path.GetFileNameWithoutExtension(Constans.LOG_FILE);
            string ext = Path.GetExtension(Constans.LOG_FILE);

            //期限を設定（保持期間から算出）
            string limitDate = DateManager.Now().AddMonths(-1 * MainModel.Config.LogKeepMonth).ToString("yyyyMM");

            //ファイルの一覧を取得（直下のフォルダのみ参照）
            IEnumerable<string> files = Directory.EnumerateFiles(path, fileName + "*" + ext, SearchOption.TopDirectoryOnly);

            //比較してより古いものは削除する
            foreach (string file in files)
            {
                //ファイル名から日付を取得する(yyyymmdd文字列)
                string targetFileDate = Path.GetFileName(file).Replace(fileName　+ "_", "").Substring(0, 6);

                //保有期間を過ぎている場合は削除する
                if (String.Compare(limitDate, targetFileDate, true) >= 0)
                {
                    File.Delete(file);
                }
            }

        }


    }
}
