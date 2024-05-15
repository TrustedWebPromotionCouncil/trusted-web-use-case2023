using Prototype02.Forms;
using Prototype02.Models;
using Prototype02.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Threading;

namespace Prototype02
{
    static class Program
    {
        /// <summary>
        /// アプリケーションのメイン エントリ ポイントです。
        /// </summary>
        [STAThread]
        static void Main()
        {
            //**************************************************
            // 初期処理
            //**************************************************
            //ThreadExceptionイベントにメインに対する例外処理を追加する
            Application.ThreadException += new ThreadExceptionEventHandler(Application_ThreadException);
            //UnhandledExceptionイベントに別スレッドに対する例外処理を追加する
            Thread.GetDomain().UnhandledException += new UnhandledExceptionEventHandler(Application_UnhandledException);

            //**************************************************
            // 多重起動防止チェック
            //**************************************************
            bool isNew = false;
            Mutex mutex = new Mutex(true, Constans.APPL_MUTEX_NAME, out isNew);
            //ミューテックスの初期所有権が付与されたか調べる
            if (!isNew)
            {
                //されなかった場合は、すでに起動していると判断して終了 ※ここでは画面が出ていないので中央表示は考慮しない
                MessageManager.Show("M0001E");
                mutex.Close();
                return;
            }

            //**************************************************
            // 画面表示処理
            //**************************************************
            try
            {
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);

                //最初はログイン画面をメインフォームとして起動する。
                MainModel.MyApplicationContext.MainForm = new FrmLogin();

                //MainModel.MyApplicationContext.MainForm = new Form1();
                Application.Run(MainModel.MyApplicationContext);
            }
            finally
            {
                //ミューテックスを解放する
                mutex.ReleaseMutex();
                mutex.Close();
            }
        }


        /*
         * Windowsフォーム内にて発生した未ハンドル例外をキャッチする
         */
        public static void Application_ThreadException(object sender, ThreadExceptionEventArgs e)
        {
            string[] args = { e.Exception.Message };
            MessageManager.Show("M9000E", args);

            Logger.Error(e.Exception);
            Application.Exit();
        }

        /*
         * フォーム以外で発生した未ハンドル例外ををキャッチする
         */
        public static void Application_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            Exception ex = e.ExceptionObject as Exception;
            if (ex != null)
            {
                string[] args = { ex.Message };
                MessageManager.Show("M9000E", args);
                Logger.Error(ex);
                Application.Exit();
            }
        }

    }
}
