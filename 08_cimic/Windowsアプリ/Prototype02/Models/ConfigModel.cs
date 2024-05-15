using Prototype02.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Reflection;

namespace Prototype02.Models
{
    
    public class ConfigModel
    {
        public bool Debug { get; set; } = true;

        //ログイン画面初期表示ユーザー（テスト時のみ指定）
        public string DefaultTestUser { get; set; } = "";

        //データフォルダ
        public string ProgramDataFolder { get; set; } = "";

        //NTPサーバー
        public string NTPServer { get; set; } = "";
        //NTPポート番号
        public int NTPPort { get; set; } = 0;
        //NTPソケットタイムアウト
        public int NTPSocketTimeout { get; set; } = 0;
        //ログファイルの保持月数
        public int LogKeepMonth { get; set; } = -1;
        //ログファイルの最大 サイズ
        public long LogMaxSize { get; set; } = 0;
        

        /*
         * コンストラクタ
         */
        public ConfigModel()
        {
            //このクラスのプロパティ一覧を取得
            PropertyDescriptorCollection props = TypeDescriptor.GetProperties(this.GetType());

            foreach (PropertyDescriptor prop in props)
            {
                //プロパティと同じ名前の設定値をApp.configから取得
                string value = ConfigurationManager.AppSettings[prop.Name];

                //App.configになければ初期値のままとする
                if (value.IsNullOrEmpty()) continue;

                //プロパティのインスタンスを取得
                var property = this.GetType().GetProperty(prop.Name, BindingFlags.Public | BindingFlags.Instance);

                // 型ごとにキャストしてプロパティに値をセット
                if (property.PropertyType == typeof(int))
                {
                    property.SetValue(this, int.Parse(value), null);
                }
                else if (property.PropertyType == typeof(string))
                {
                    property.SetValue(this, value, null);
                }
                else if (property.PropertyType == typeof(double))
                {
                    property.SetValue(this, double.Parse(value), null);
                }
                else if (property.PropertyType == typeof(float))
                {
                    property.SetValue(this, float.Parse(value), null);
                }
                else if (property.PropertyType == typeof(long))
                {
                    property.SetValue(this, long.Parse(value), null);
                }
                else if (property.PropertyType == typeof(bool))
                {
                    property.SetValue(this, bool.Parse(value), null);
                }
            }
        }
    }
}
