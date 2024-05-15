using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace Prototype02.Common
{
    public static class MessageManager
    {
        /*
         * 内部定数
         */
         //メッセージタイプ
        private const string MESSAGE_TYPE_ERROR = "E";
        private const string MESSAGE_TYPE_INFO = "I";
        private const string MESSAGE_TYPE_QUESTION = "Q";
        private const string MESSAGE_TYPE_WARNING = "W";
        //タイトル取得用キー
        private const string MESSAGE_TITLE_ERROR = "MESSAGE_TITLE_ERROR";
        private const string MESSAGE_TITLE_INFO = "MESSAGE_TITLE_INFO";
        private const string MESSAGE_TITLE_QUESTION = "MESSAGE_TITLE_QUESTION";
        private const string MESSAGE_TITLE_WARNING = "MESSAGE_TITLE_WARNING";

        /*
         * コンストラクタ（静的）
         */
        static MessageManager()
        {

        }

        /*
         * メッセージIDに該当する規定のボタンを取得する
         */
        public static DialogResult Show(string messageId, string[] args = null, MessageBoxDefaultButton defaultButton = MessageBoxDefaultButton.Button1)
        {
            //メッセージの引数を決定
            string message = GetMessage(messageId, args);
            string title = GetTitle(messageId);
            MessageBoxIcon icon = GetIcon(messageId);
            MessageBoxButtons buttons = GetButtons(messageId);


            return MessageBox.Show(message, title, buttons, icon, defaultButton);
            
        }
        /*
         * メッセージIDに該当する規定のボタンを取得する（中央表示）
         */
        public static DialogResult ShowCenter(IWin32Window owner, string messageId, string[] args = null)
        {
            //メッセージの引数を決定
            string message = GetMessage(messageId, args);
            string title = GetTitle(messageId);
            MessageBoxIcon icon = GetIcon(messageId);
            MessageBoxButtons buttons = GetButtons(messageId);

            //ログ出力
            OutputLog(messageId, message);

            return CustomMessageBox.Show(owner, message, title, buttons, icon);
        }

        /*
         * メッセージIDに該当するメッセージを取得する
         */
        public static string GetMessage(string messageId, string[] args = null)
        {
            //リソースファイルからIDに該当するメッセージを取得する
            string message = Util.GetResourceString(messageId);
            //引数のセット
            if (args != null && args.Length > 0) message = string.Format(message, args);

            return message;
        }

        /*
         * メッセージIDに該当するタイトルを取得する
         */
        public static string GetTitle(string messageId)
        {
            //メッセージIDからメッセージタイプを取得
            string type = messageId.GetRight(1).ToUpper();

            //リソースファイルからタイトルを取得
            string key = "";
            switch (type)
            {
                case MESSAGE_TYPE_ERROR:
                    key = MESSAGE_TITLE_ERROR;
                    break;
                case MESSAGE_TYPE_INFO:
                    key = MESSAGE_TITLE_INFO;
                    break;
                case MESSAGE_TYPE_QUESTION:
                    key = MESSAGE_TITLE_QUESTION;
                    break;
                case MESSAGE_TYPE_WARNING:
                    key = MESSAGE_TITLE_WARNING;
                    break;
            }
            return Util.GetResourceString(key);
        }

        /*
         * メッセージIDに該当する規定のボタンを取得する
         */
        public static MessageBoxButtons GetButtons(string messageId)
        {
            //メッセージIDからメッセージタイプを取得
            string type = messageId.GetRight(1).ToUpper();

            //メッセージタイプに対応したディフォルトのボタンを特定
            switch (type)
            {
                case MESSAGE_TYPE_ERROR:
                    return MessageBoxButtons.OK;
                case MESSAGE_TYPE_INFO:
                    return MessageBoxButtons.OK;
                case MESSAGE_TYPE_QUESTION:
                    return MessageBoxButtons.YesNo;
                case MESSAGE_TYPE_WARNING:
                    return MessageBoxButtons.OK;
                default:
                    return MessageBoxButtons.OK;
            }
        }

        /*
         * メッセージIDに該当する規定のボタンを取得する
         */
        public static MessageBoxIcon GetIcon(string messageId)
        {
            //メッセージIDからメッセージタイプを取得
            string type = messageId.GetRight(1).ToUpper();

            //メッセージタイプに対応したディフォルトのボタンを特定
            switch (type)
            {
                case MESSAGE_TYPE_ERROR:
                    return MessageBoxIcon.Error;
                case MESSAGE_TYPE_INFO:
                    return MessageBoxIcon.Information;
                case MESSAGE_TYPE_QUESTION:
                    //return MessageBoxIcon.Question;   //推奨されていない
                    return MessageBoxIcon.Warning;
                case MESSAGE_TYPE_WARNING:
                    return MessageBoxIcon.Warning;
                default:
                    return MessageBoxIcon.None;
            }
        }


        /*
         * ログ出力
         */
        public static void OutputLog(string messageId, string message)
        {
            //メッセージIDからメッセージタイプを取得
            string type = messageId.GetRight(1).ToUpper();

            string[] args;
            //メッセージタイプに対応したディフォルトのボタンを特定
            switch (type)
            {
                case MESSAGE_TYPE_ERROR:
                    args = new string[] { message };
                    Logger.Info(Logger.LogTimingErrorDialog, GetMessage("L0002", args));
                    break;

                case MESSAGE_TYPE_INFO:
                    break;  //ログ出力不要
                case MESSAGE_TYPE_QUESTION:
                    break;  //ログ出力不要
                case MESSAGE_TYPE_WARNING:
                    break;  //ログ出力不要
                default:
                    break;  //ログ出力不要
            }
        }

    }
}
