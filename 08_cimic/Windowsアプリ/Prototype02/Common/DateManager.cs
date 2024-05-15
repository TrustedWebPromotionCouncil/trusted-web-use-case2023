using System;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Sockets;

namespace Prototype02.Common
{
    public class DateManager
    {
        /*
         * プロパティ
         */
        //NTPサーバを利用した補正を行っている場合はtrue
        public static bool isUseNTP { get; set; } = false;
        //NTPサーバをアクセス時のエラーコード
        public static int ErrorCode { get; set; } = 0;
        //NTP時刻とPC時刻との差分（秒）
        public static TimeSpan Equation { get; set; } = new TimeSpan(0, 0, 0);

        /*
         * コンストラクタ
         */
        static DateManager()
        {

        }

        /*
         * NTP時刻とPC時刻との差分をチェック
         */
        public static void CheckEquationTime(String server, int port, int timeout)
        {
            Equation = GetEquationTime(server, port, timeout);
        }

        /*
         * 現在(UTC)時刻を返す
         */
        public static DateTime UtcNow()
        {
            return DateTime.UtcNow - Equation;
        }

        /*
         * 現在時刻を返す
         */
        public static DateTime Now()
        {
            return DateTime.Now - Equation;
        }

        /*
         * NTP時刻とPC時刻との差分をチェック（実装部）
         */
        private static TimeSpan GetEquationTime(String server, int port, int timeout)
        {
            TimeSpan result = new TimeSpan(0,0,0);
            try
            {
                //サーバ未設定の場合はNTPを利用しない
                if (server.IsNullOrEmpty())
                {
                    isUseNTP = false;
                    return result;
                }

                //UDP生成
                IPEndPoint ipAny = new IPEndPoint(IPAddress.Any, 0);
                UdpClient udp = new UdpClient(ipAny);
                udp.Client.ReceiveTimeout = timeout * 1000;

                //Send UDP
                Byte[] sendData = new Byte[48];
                sendData[0] = 0xE3; //LI, Version, Mode
                sendData[1] = 0;    //Stratum
                sendData[2] = 6;    //Polling Interval
                sendData[3] = 0xEC; //Precision
                udp.Send(sendData, sendData.GetLength(0), server, port);

                //Recieve UDP
                Byte[] resultData = udp.Receive(ref ipAny);

                //1900/01/01から経過秒数
                long passSec = 0;
                //Transmit Timestampの40バイト目からはじまる4バイトのデータ
                long b0 = (long)resultData[40];
                long b1 = (long)resultData[41];
                long b2 = (long)resultData[42];
                long b3 = (long)resultData[43];
                passSec = (b0 << 24 | b1 << 16) | (b2 << 8 | b3);
                DateTime dateTime = new DateTime(1900, 1, 1);   //基準時間に経過乗数を加える
                dateTime = dateTime.AddSeconds(passSec);

                //UTCのまま差を求める
                result = DateTime.UtcNow - dateTime;
                isUseNTP = true;

                return result;
            }
            catch (SocketException e)
            {
                isUseNTP = false;
                ErrorCode = e.ErrorCode;
                return result;
            }
        }

    }
}
