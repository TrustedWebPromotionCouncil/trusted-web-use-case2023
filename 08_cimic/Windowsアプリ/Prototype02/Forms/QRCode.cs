using Prototype02.Models;
using Prototype02.Common;
using System;
using System.IO;
using System.Drawing;
using System.Windows.Forms;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using CroTrustedDirectory.Models;
using System.Threading;
using System.Threading.Tasks;
using ZXing;

namespace Prototype02.Forms
{
    public partial class FrmQRCode : Form
    {
        //親画面から設定するSubjectID
        private int _subjectId;
        public int SubjectId
        {
            set { _subjectId = value; }
            get { return _subjectId; }
        }
        private StudySubject studySubject;
        private CancellationTokenSource m_CancelToken;
        int resultDiv = 0;

        public FrmQRCode()
        {
            InitializeComponent();

            //デザイン
            this.BackColor = Constans.GeBackClor();
        }
        private void FrmQRCode_Load(object sender, EventArgs e)
        {
            //被検者情報の取得
            studySubject = MainModel.ds.GetStudySubject(_subjectId).StudySubject;

            BarcodeWriter writer = new BarcodeWriter();
            writer.Format = BarcodeFormat.QR_CODE;
            writer.Options.Height = 200;
            writer.Options.Width = 200;
            writer.Options.Margin = 2;

            writer.Options.Hints.Add(EncodeHintType.CHARACTER_SET, "UTF-8");
            writer.Options.Hints.Add(EncodeHintType.ERROR_CORRECTION, ZXing.QrCode.Internal.ErrorCorrectionLevel.M);

            pictureBox1.Image = writer.Write("{\"id\":" + studySubject.Id.ToString() +"}");
            Clipboard.SetDataObject(pictureBox1.Image);

            //QRコードの読み込み確認
            StatusConfirm();
        }

        //QRコードの読み込み確認
        //※キャンセル機能つける場合は以下を参照
        //https://araramistudio.jimdo.com/2015/08/26/async-await%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9F%E9%9D%9E%E5%90%8C%E6%9C%9F%E5%87%A6%E7%90%86/
        private async void StatusConfirm()
        {

            //キャンセル処理にはCancellationTokenSourceを使う
            m_CancelToken = new CancellationTokenSource();

            await Task.Run(() => {
                int sleep = 10000;  //10秒
                int times = 6*5;    //回数：sleep（10秒）*6*5は5分でタイムアウト
                for (int i = 1; i <= 10; ++i)
                {
                    //初回アクセス判定
                    foreach (SubjectContact subject in MainModel.ds.GetSubjectList(MainModel.selectedStudyHospital))
                    {
                        if (subject.Id == SubjectId && subject.FirstAccess == "true")
                        {
                            resultDiv = 1;
                            break;
                        }
                    }

                    //判定
                    if (resultDiv == 1)
                    {
                        //正常終了
                        break;
                    } else if (i == times)
                    {
                        //タイムアウト
                        resultDiv = 2;
                        break;
                    } else if (m_CancelToken.IsCancellationRequested)
                    {
                        //キャンセル
                        resultDiv = 3;
                        break;
                    }

                    Thread.Sleep(sleep);
                }
            });

            m_CancelToken.Dispose();
            m_CancelToken = null;
            if (resultDiv == 1)
            {   //初回アクセス完了
                MessageManager.ShowCenter(this, "M0501I");
            } else if (resultDiv == 2)
            {   //タイムアウト
                MessageManager.ShowCenter(this, "M0502I");
            } else if (resultDiv == 3)
            {   //キャンセル
                //いまのところメッセージは表示しない
            }

            this.Close();
        }

        //Closeボタン押下時
        private void BtnClose_Click(object sender, EventArgs e)
        {
            if (null != m_CancelToken)
            {
                m_CancelToken.Cancel();
            } else
            {
                this.Close();
            }
        }

        //画面Close時
        private void FrmQRCode_FormClosed(object sender, FormClosedEventArgs e)
        {
            //親画面を活性化させる
            FrmNewSubject form = (FrmNewSubject)this.Owner;
            if (resultDiv == 1) form.QrComfirmed();
            form.Enabled = true;
            
        }
    }
}
