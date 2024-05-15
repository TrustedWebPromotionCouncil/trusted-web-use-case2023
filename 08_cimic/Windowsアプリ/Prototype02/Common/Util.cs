using Prototype02.Models;
using CroTrustedDirectory.Models;
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Reflection;
using System.Resources;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows.Forms;


namespace Prototype02.Common
{
    public static class Util
    {

        /*
         * アプリケーションバージョンを取得する。
         */
        public static string GetVersion()
        {
            string result = "";
            //Assemblyを取得
            System.Reflection.Assembly asm = System.Reflection.Assembly.GetExecutingAssembly();
            //バージョンの取得
            System.Version ver = asm.GetName().Version;
            result = ver.ToString();
            return result;
        }

        /*
         * アプリケーションコピーライトを取得する。
         */
        public static string GetCopyright()
        {
            string result = "";
            //FileVersionInfoを取得
            var info = FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location);
            //著作権の取得
            result = info.LegalCopyright;
            return result;
        }

        /*
         * リソースファイルから文字列を取得する。
         */
        public static string GetResourceString(string key)
        {
            //リソースファイルからキーに該当する文字列を取得する
            string result = Properties.Resources.ResourceManager.GetString(key);
            //該当するものが設定されていなければ空欄とする
            if (result.IsNullOrEmpty()) result = "";

            //改行文字の置き換え
            if (result.Contains(@"\n")) result = result.Replace(@"\n", Environment.NewLine);
            
            return result;
        }

        /*
         * タイムアウト監視用の最後に操作した時間をリセットする。。
         */
        //public static void ResetTimeoutTimer()
        //{
        //    MainModel.LastOperationTime = DateManager.Now();
        //}
        

        /**
         * テキストをファイルに書き込む
         * 
         * 引数:ファイル名
         * 引数:書き込む文字列
         * 引数:文字コード(省略時はUTF-8)
         * 結果:文字列
         */
        public static void WriteFile(string value, string file, bool isMod = false, string encode = Constans.FILE_ENCODE)
        {
            using (StreamWriter sw = new StreamWriter(file, isMod, Encoding.GetEncoding(encode)))
            {
                //sw.WriteLine(value);
                sw.Write(value);
            }
        }
        

        /**
         * ファイル名に使えない文字を除外する
         */
        public static string ReplaceInvalidFileChar(string value)
        {
            char[] invalidFileChars = Path.GetInvalidFileNameChars();
            foreach (char invalidChar in invalidFileChars)
            {
                value = value.Replace(invalidChar, '?');
                value = Regex.Replace(value, @"[?]+", "");
            }
            return value;
        }

        /**
         * プログラム用のデータ保存の基本パスを取得する
         */
        private static string GetBaseDataPath()
        {
            //設定ファイルに指定がある場合はそこを用いる
            string result = MainModel.Config.ProgramDataFolder;
            if (result.IsNullOrEmpty())
            {
                //規定値としては「C:\ProgramData\Philips\care exporter\」とする
                result = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
                result += Path.DirectorySeparatorChar + Constans.APPL_MANUFACTURER + Path.DirectorySeparatorChar + Constans.APPL_PRODUCT_NAME;
            }
            else
            {
                //データフォルダの指定がある場合は、そのフォルダは存在することを前提とする
                if (!Directory.Exists(result))
                {
                    //指定したデータフォルダが存在しません。
                    MessageManager.Show("M0046E", new string[] { result });
                    Environment.Exit(0);    //ログ出力もできないため「Application.Exit()」ではなくあえて強制終了する
                }
            }

            return result;
        }

        /**
         * プログラム用のデータ保存パスを取得する
         */
        public static string GetLogPath()
        {
            //データ保存の基本パスを取得する
            string result = GetBaseDataPath();

            //ログフォルダを生成
            result += Path.DirectorySeparatorChar + Constans.LOG_FOLDER;

            //存在しない場合は作成する
            if (!Directory.Exists(result)) Directory.CreateDirectory(result);

            return result;
        }

        ///**
        // * プログラム用のデータ保存パスを取得する
        // */
        //public static string GetProgramDataPath(string value, bool isMakeDataFolder = false)
        //{
        //    //データ保存の基本パスを取得する
        //    string result = GetBaseDataPath();

        //    //データフォルダを生成
        //    if (isMakeDataFolder)
        //    {
        //        result += Path.DirectorySeparatorChar + Constans.DATA_FOLDER + Path.DirectorySeparatorChar + value + Path.DirectorySeparatorChar + MainModel.SelectData.GetName();
        //    }
        //    else
        //    {
        //        result += Path.DirectorySeparatorChar + Constans.DATA_FOLDER + Path.DirectorySeparatorChar + value;
        //    }

        //    //存在しない場合は作成する
        //    if (!Directory.Exists(result)) Directory.CreateDirectory(result);

        //    return result;
        //}

        /**
         * Windowsユーザ毎のデータ保存パスを取得する
         */
        public static string GetWindowsDataPath(string value = "")
        {
            string result = "";
            result = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            result += Path.DirectorySeparatorChar + Constans.APPL_MANUFACTURER + Path.DirectorySeparatorChar + Constans.APPL_PRODUCT_NAME;

            //存在しない場合は作成する
            if (!Directory.Exists(result)) Directory.CreateDirectory(result);

            result += Path.DirectorySeparatorChar + value;

            return result;
        }
        /**
         * 一時ディレクトリを取得する
         */
        public static string GetTempFolderPath()
        {
            string tempPath = Path.GetTempPath();
            tempPath = tempPath.TrimEnd(new char[] { Path.DirectorySeparatorChar });
            string[] paths = new string[] {
                tempPath,
                Constans.APPL_MANUFACTURER,
                Constans.APPL_PRODUCT_NAME,
            };

            return string.Join(Path.DirectorySeparatorChar.ToString(), paths);
        }
        public static string GetTempFolderPath(string subFolder)
        {
            string temp = GetTempFolderPath();
            return subFolder.IsNullOrEmpty() ? temp : temp + Path.DirectorySeparatorChar + subFolder;
        }
        public static void ClearTempFolder()
        {
            string path = GetTempFolderPath();
            if (Directory.Exists(path))
            {
                Directory.Delete(path, true);
            }
        }


        //TDにURIが設定されていないユーザーは対象外とする
        //ついでにRoleをコードから変換
        public static List<ParticipantContact> FilterNoUrl(List<ParticipantContact> list)
        {
            List<ParticipantContact> ParticipantContact;

            if (list != null) {
                ParticipantContact = new List<ParticipantContact>();
                foreach (ParticipantContact row in list)
                {
                    //URIが設定されているpatisipantsのみ追加
                    if (!row.Uri.IsNullOrEmpty())
                    {
                        //Roleを変換
                        row.Role = DecodeRole(row.Role);
                        //結果に追加
                        ParticipantContact.Add(row);
                    }
                }
            } else
            {
                ParticipantContact = null;
            }
            return ParticipantContact;
        }

        public static String DecodeRole(String code)
        {
            //Roleを変換
            if (code == "S")
            {
                return "Hospital Staff";
            }
            else if (code == "C")
            {
                return "Pharma or CRO";
            } else
            {
                return "";
            }
        }

    }
}
