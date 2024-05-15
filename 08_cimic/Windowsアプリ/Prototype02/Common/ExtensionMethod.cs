
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Runtime.InteropServices;
using System.Runtime.Serialization.Formatters.Binary;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Windows.Forms;
using System.Xml.Serialization;

namespace Prototype02.Common
{
    public static class ExtensionMethod
    {
        /**
         * クラスのディープコピー
         */
        public static T DeepCopy<T>(this T src)
        {
            using (var memoryStream = new MemoryStream())
            {
                var binaryFormatter = new BinaryFormatter();
                binaryFormatter.Serialize(memoryStream, src);
                memoryStream.Seek(0, SeekOrigin.Begin);
                return (T)binaryFormatter.Deserialize(memoryStream);
            }
        }

        /*
         * 文字列の未設定を判定する。
         */
        public static bool IsNullOrEmpty(this string value)
        {
            return (value == null || DBNull.Value.Equals(value) || value == "");
        }

        /*
         * 文字列が全て全角か判定する。
         */
        public static bool IsZenkaku(this string value)
        {
            return value.Length * 2 == Encoding.GetEncoding("shift_jis").GetByteCount(value);
        }

        /*
         * 文字列が全て半角か判定する。
         */
        public static bool IsHankaku(this string value)
        {
            return value.Length == Encoding.GetEncoding("shift_jis").GetByteCount(value);
        }
        /*
         * 文字列が日付けか判定する。
         */
        public static bool IsDate(this string value)
        {
            DateTime dummy;
            return DateTime.TryParse(value, out dummy);

        }

        /*
         * 文字列の右側からして文字列分切り出す。
         */
        public static string GetRight(this string value, int count)
        {
            //valueがNullや空欄、countがマイナスの場合は長さゼロ文字列を返す
            if (count < 0 || value.IsNullOrEmpty()) return "";

            if (value.Length <= count) return value;

            return value.Substring(value.Length - count, count);
        }

        /*
         * 文字列の左側からして文字列分切り出す。
         */
        public static string GetLeft(this string value, int count)
        {
            //valueがNullや空欄、countがマイナスの場合は長さゼロ文字列を返す
            if (count < 0 || value.IsNullOrEmpty()) return "";

            if (value.Length <= count) return value;

            return value.Substring(0, count);
        }

        /**
         * 独自クラスリストからDataTableに変換して返す。
         */
        public static DataTable ConvertModelListToDataTable<T>(this IList<T> data)
        {
            PropertyDescriptorCollection props = TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            for (int i = 0; i < props.Count; i++)
            {
                PropertyDescriptor prop = props[i];
                table.Columns.Add(prop.Name, prop.PropertyType);
            }

            object[] values = new object[props.Count];

            foreach (T item in data)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = props[i].GetValue(item);
                }
                table.Rows.Add(values);
            }
            return table;
        }

        /**
         * 任意のオブジェクトを XML文字列に変換する。
         */
        public static string SerializeXml(this object value, string fileName = "", string encode = Constans.FILE_ENCODE)
        {
            XmlSerializer serializer = new XmlSerializer(value.GetType());

            using (MemoryStream stream = new MemoryStream())
            {
                serializer.Serialize(stream, value);
                return Encoding.GetEncoding(encode).GetString(stream.ToArray());
            }
        }

        /**
         * 任意のオブジェクトを XML文字列に変換する。
         */
        public static T DeserializeXml<T>(this string value, string rootElement = null, string rootNamespace = null, string encode = Constans.FILE_ENCODE)
        {
            XmlRootAttribute root = new XmlRootAttribute();
            if (!rootElement.IsNullOrEmpty()) root.ElementName = rootElement;
            if (!rootNamespace.IsNullOrEmpty()) root.Namespace = rootNamespace;

            using (var stream = new MemoryStream(Encoding.GetEncoding(encode).GetBytes(value)))
            {
                XmlSerializer serializer = new XmlSerializer(typeof(T), root);
                return (T)serializer.Deserialize(stream);
            }
        }
        
        /**
         * 文字列をMD5でハッシュ化する。
         */
        public static string GetHashString(this string value)
        {
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
            Byte[] bytes = md5.ComputeHash(Encoding.ASCII.GetBytes(value));
            StringBuilder builder = new StringBuilder();
            foreach (var word in bytes) {
                builder.Append(word.ToString("x2"));
            }
            return builder.ToString().ToLower();
        }

        /**
         * テキストをファイルに書き込む
         */
        public static void WriteFile(this string value, string file, bool isMod = false, string encode = Constans.FILE_ENCODE)
        {
            Util.WriteFile(value, file, isMod, encode);
        }
        /**
         * ファイル名に使えない文字を除外する
         */
        public static string ReplaceInvalidFileChar(this string value)
        {
            return Util.ReplaceInvalidFileChar(value);
        }

        /**
         * 少数の文字列フォーマット
         */
        public static string ToFormatString(this double value)
        {
            return string.Format("{0:#,0.0}", value);
        }
        public static string ToFormatString(this double? value)
        {
            return string.Format("{0:#,0.0}", value);
        }
        /**
         * パーセントの文字列フォーマット
         */
        public static string ToPercentFormatString(this double value)
        {
            //小数点第二位を四捨五入、パーセント表示（XX.X0%）という謎のフォーマットに注意
            //return string.Format("{0:#,0.00}", value);
            return string.Format("{0:#,0.0}", value) + "0";
        }
        /**
         * 秒の文字列フォーマット
         */
         /*
        public static string ToFormatSecondsString(this double value)
        {
            int roundUp = (int)Math.Round(value, MidpointRounding.AwayFromZero);
            int minutes = (roundUp / 60);
            int seconds = (roundUp % 60);
            int hours = (minutes / 60);
            minutes = (minutes % 60);

            return ((hours > 0) ? hours + "時間" : "") + ((minutes > 0) ? minutes + "分" : "") + seconds + "秒";
        }
        */
        /**
         * 分の文字列フォーマット
         * isSecondがfalseの場合は秒は四捨五入して非表示にする
         */
        public static string ToFormatMinutesString(this double value, bool isSecond = true)
        {
            int seconds = (int)Math.Round(((value % 1) * 60), MidpointRounding.AwayFromZero);   //少数以下を秒に換算
            //int roundUp = (isSecond) ? (int)Math.Floor(value) : (int)Math.Round(value, MidpointRounding.AwayFromZero);   //整数部のみ切り出す か　四捨五入
            int roundUp = (int)Math.Floor(value);   //整数部のみ切り出す
            int hours = (roundUp / 60);
            int minutes = (roundUp % 60);
            int days = (hours / 24);
            hours = (hours % 24);

            return ((days > 0) ? days + "日" : "") + ((hours > 0) ? hours + "時間" : "") + ((minutes > 0) ? minutes + "分" : "") + (isSecond ? seconds + "秒" : "");
        }

        /**
         * 分の文字列フォーマット
         * ゼロ以上の場合「xx分」ゼロの場合は「xx秒」と返すように
         */
        public static string ToFormatMinutesString2(this double value)
        {
            if (value == 0) return "0秒";

            int seconds = (int)Math.Round(((value % 1) * 60), MidpointRounding.AwayFromZero);   //少数以下を秒に換算
            int roundUp = (int)Math.Round(value, MidpointRounding.AwayFromZero);   //四捨五入
            int hours = (roundUp / 60);
            int minutes = (roundUp % 60);

            return ((hours > 0) ? hours + "時間" : "") + minutes + "分";
        }

        /**
         * 整数の文字列フォーマット
         */
        public static string ToFormatString(this int value)
        {
            return string.Format("{0:#,0}", value);
        }
        /**
         * 日付けの文字列フォーマット
         */
        public static string ToFormatString(this DateTime value)
        {
            string result = "";
            if (value != DateTime.MinValue)
            {
                result = value.ToString(Constans.FORMAT_DATE);
            }
            return result;
        }
        /**
         * 文字列を日付けに変換
         */
        public static DateTime ToDate(this string value)
        {
            var style = DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal;
            return (value.IsNullOrEmpty()) ? DateTime.MinValue : DateTime.Parse(value, null, style);
        }

        /**
         * 連想配列から値を取得する
         */
        public static string GetValue(this Dictionary<string, string> map, string key)
        {
            string result = "";
            if (map.ContainsKey(key)) result = map[key];
            return result;
        }


        /*
         * フォームが上にはみ出る事を調整する。
         */
        public static void Reposition(this object target)
        {
            if (target is Form)
            {
                Form form = (Form)target;
                if (form.Location.Y < 0)
                {
                    //ポジションを画面内に設定
                    form.Location = new Point(form.Location.X, 0);
                    //高さも最小サイズまで縮小
                    form.Height = form.MinimumSize.Height;
                }
            }
        }

        /*
         * マルチラインテキストボックスの折返しを考慮した行数を取得する
         */
        public static int GetMultiLineCount(this TextBox target)
        {
            //行データを格納
            List<string> lines = new List<string>();
            bool IsEnd = false;
            int i = 1;
            int j = 0;
            while (!IsEnd)
            {
                var index = target.GetFirstCharIndexFromLine(i);
                if (index != -1)
                {
                    lines.Add(target.Text.Substring(j, index - j));
                    j = index;
                    i++;
                }
                else
                {
                    lines.Add(target.Text.Substring(target.Text.Length - j));
                    IsEnd = true;
                }
            }

            //行数を返す
            return lines.Count;

        }
    }
}
