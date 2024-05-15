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
using System.IO.Compression;
using System.Text;
using System.Linq;

namespace Prototype02.Forms
{
    public partial class FrmAuditTrailDataDownload : Form
    {
        //画面内で保持するプロパティ
        private bool taskComplete = false;          //タスクが終了したかどうか
        //private SubjectContact selectedSubjectItem;
        //private Activity selectedDataItem;

        public FrmAuditTrailDataDownload()
        {
            InitializeComponent();

            //デザイン
            this.BackColor = Constans.GeBackClor();
        }

        private void FrmSubjectDataDownload_Load(object sender, EventArgs e)
        {
            //初期表示
            this.Text = Constans.APPL_PRODUCT_NAME;

            //施設、試験情報表示
            lblHospitalName.Text = MainModel.selectedStudyHospital.HospitalName;
            lblStudyName.Text = MainModel.selectedStudyHospital.StudyName;

            dtpStartDate.Value = DateTime.Today;
            dtpEndDate.Value = DateTime.Today;

            lblMessage.Visible = false;
        }


        //BACKボタン押下時
        private void BtnBack_Click(object sender, EventArgs e)
        {
            //画面遷移
            FrmMenu form = new FrmMenu();
            MainModel.MyApplicationContext.MainForm = form;

            //表示位置をキープ
            Point point = this.Location;
            form.StartPosition = FormStartPosition.Manual;
            form.Location = point;

            form.Show();
            this.Close();
        }


        //ダウンロードボタン押下時
        private void BtnDownload_Click(object sender, EventArgs e)
        {
            //画面の非活性化
            dtpStartDate.Enabled = false;
            dtpEndDate.Enabled = false;
            btnDownload.Enabled = false;
            btnBack.Enabled = false;

            //監査証跡の出力
            List<AuditLogEntryJP> targetLogs = new List<AuditLogEntryJP>();
            int result = MainModel.ds.getAuditReportTerm(out targetLogs, MainModel.selectedStudyHospital, dtpStartDate.Value, dtpEndDate.Value);

            //ゼロ件だとエラーになる？状況確認中とりあえずエラー処理せずゼロ件扱いとする
            //if (result != 0)
            //{
            //    MessageManager.ShowCenter(this, "M0901E", new string[] { "btnAuditTrail_Click.DirectoryServiceImpl.getAuditReport \n" + MessageManager.GetMessage("K" + Convert.ToString(result)) });
            //}
            //else
            //{
            if (targetLogs.Count == 0)
            {
                MessageManager.ShowCenter(this, "M0403I");

            }
            else
            {
                //ファイルの保存先指定
                FolderBrowserDialog fbd = new FolderBrowserDialog();
                fbd.Description = "audit trailを出力するフォルダを選択してください。";
                if (fbd.ShowDialog() == DialogResult.OK)
                {
                    string path = fbd.SelectedPath;
                    if (path.GetRight(1) != "\\") path += "\\";
                    path += "audit-report_" + DateManager.Now().ToString("yyyyMMddHHmmss") + ".csv";

                    result = MainModel.ds.downloadAuditReportTerm(targetLogs, path);
                    if (result == 0)
                    {
                        //完了メッセージの表示
                        MessageManager.ShowCenter(this, "M0401I");
                    }
                }
                else
                {
                    //キャンセルメッセージの表示
                    MessageManager.ShowCenter(this, "M0402I");
                }
            }
            //}

            //ダウンロード終了
            Download_end();
        }

        private void BgDownload_DoWork(object sender, System.ComponentModel.DoWorkEventArgs e)
        {
            List<object> arg = e.Argument as List<object>;
            Task<int> task = Task.Run(() =>
            {
                return MainModel.ds.DeviceDataDownload(
                    (IList<MyDeviceData>)arg[0]
                    , (string)arg[1]
                    , MainModel.selectedStudyHospital
                    );
            });

            //進捗表示
            int sleepTime = 200;
            int i = 0;
            while (!task.IsCompleted)
            {
                i += 1;
                bgDownload.ReportProgress(i);
                Thread.Sleep(sleepTime);
                //タスクが完了したら終了
                if (task.IsCompleted)
                {
                    if (task.Result == 0)
                    {
                        //boxFiles = task.Result;
                        taskComplete = true;
                    }

                    break;
                }
                else if (i * sleepTime > 1000 * 60 * 20)
                {
                    //ファイル取得に20分以上かかったらいったん終了
                    break;
                }
            }
        }

        //バックグラウンド処理の状況更新
        private void BgDownload_ProgressChanged(object sender, System.ComponentModel.ProgressChangedEventArgs e)
        {
            string tmp = "";
            for (int i = 1; i <= e.ProgressPercentage % 10; i++)
            {
                tmp += ".";
            }
            lblMessage.Text = MessageManager.GetMessage("M0804") + tmp;
        }

        //バックグラウンド処理の完了
        private void BgDownload_RunWorkerCompleted(object sender, System.ComponentModel.RunWorkerCompletedEventArgs e)
        {
            if (taskComplete)
            {
                MessageManager.ShowCenter(this, "M0805I");
            }
            else
            {
                //メッセージ初期化
                lblMessage.Text = "";
                //エラー表示
                MessageManager.ShowCenter(this, "M0901E", new string[] { "bgDownload.DirectoryServiceImpl.getBoxFiles" });
            }

            //ダウンロード終了
            Download_end();
        }

        //ダウンロード終了
        private void Download_end()
        {
            //メッセージ初期化
            lblMessage.Text = "";
            lblMessage.Visible = false;

            //画面の活性化
            dtpStartDate.Enabled = true;
            dtpEndDate.Enabled = true;
            btnDownload.Enabled = true;
            btnBack.Enabled = true;
        }
    }
}
