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
    public partial class FrmSubjectDataDownload : Form
    {
        //画面内で保持するプロパティ
        private DeviceActivity deviceActivity;      //デバイス情報
        private bool taskComplete = false;          //タスクが終了したかどうか
        //private SubjectContact selectedSubjectItem;
        //private Activity selectedDataItem;

        public FrmSubjectDataDownload()
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

            //デバイス情報保持
            deviceActivity = MainModel.ds.GetDeviceActivity();

            //Subjctの初期設定
            lstSubject.ValueMember = "Id";
            lstSubject.DisplayMember = "SubjectCode";
            List<SubjectContact> subjectList = new List<SubjectContact>();
            foreach (SubjectContact subject in MainModel.ds.GetSubjectList(MainModel.selectedStudyHospital))
            {
                if (subject.FirstAccess == "true" && subject.Accepted == "true")
                {
                    subjectList.Add(subject);
                }
            }
            lstSubject.DataSource = subjectList;
            lstSubject.ClearSelected();

            //Dataの初期設定
            lstData.ValueMember = "Id";
            lstData.DisplayMember = "ActivityName";

            //List<Activity> activityList = deviceActivity.Activities.OrderBy(s => s.Id).ToList();
            foreach (Activity activity in deviceActivity.Activities.OrderBy(s => s.Id).ToList())
            {
                String deviceName = "";
                foreach (Devices devices in deviceActivity.Devices)
                {
                    if (devices.Id == activity.DeviceId)
                    {
                        deviceName = devices.DeviceName + "-";
                        break;
                    }
                }
                activity.ActivityName = deviceName + activity.ActivityName;
            }
            lstData.DataSource = deviceActivity.Activities;
            lstData.ClearSelected();

            dtpStartDate.Value = DateTime.Today;
            dtpEndDate.Value = DateTime.Today;

            //ダウンロードボタンの非活性化
            btnDownload.Enabled = false;
            lblMessage.Visible = false;
        }


        //BACKボタン押下時
        private void BtnBack_Click(object sender, EventArgs e)
        {
            //画面遷移
            FrmStudySubjectList form = new FrmStudySubjectList();
            MainModel.MyApplicationContext.MainForm = form;

            //表示位置をキープ
            Point point = this.Location;
            form.StartPosition = FormStartPosition.Manual;
            form.Location = point;

            form.Show();
            this.Close();
        }

        //Subjectリストの選択時
        private void LstSubject_SelectedIndexChanged(object sender, EventArgs e)
        {
            //ダウンロードボタン有効化判定
            DownloadButtonActivate();
        }

        //Dataリストの選択時
        private void LstData_SelectedIndexChanged(object sender, EventArgs e)
        {
            //ダウンロードボタン有効化判定
            DownloadButtonActivate();
        }

        //ダウンロードボタン有効化判定
        private void DownloadButtonActivate()
        {
            if (lstSubject.SelectedItems.Count > 0 && lstData.SelectedItems.Count > 0)
            {
                btnDownload.Enabled = true;
            }
            else
            {
                btnDownload.Enabled = false;
            }
        }

        //ダウンロードボタン押下時
        private void BtnDownload_Click(object sender, EventArgs e)
        {
            //画面の非活性化
            lstSubject.Enabled = false;
            lstData.Enabled = false;
            dtpStartDate.Enabled = false;
            dtpEndDate.Enabled = false;
            btnDownload.Enabled = false;
            btnBack.Enabled = false;


            //デバイスデータの取得
            IList<MyDeviceData> deviceDataList = new List<MyDeviceData>();
            foreach (SubjectContact subjectContact in lstSubject.SelectedItems)
            {
                foreach (Activity acrivity in lstData.SelectedItems)
                {
                    MyDeviceData myDeviceData = new MyDeviceData
                    {
                        DeviceDataList = MainModel.ds.GetDeviceDatas(subjectContact.Id, acrivity.Id, dtpStartDate.Value.Date, dtpEndDate.Value.Date),
                        subjectContact = subjectContact,
                        acrivity = acrivity
                    };
                    if (myDeviceData.DeviceDataList.Count > 0 )
                    {
                        deviceDataList.Add(myDeviceData);
                    }
                }
            }

            if (deviceDataList.Count == 0)
            {
                MessageManager.ShowCenter(this, "M0801E");
            } else
            {
                String filename = "datadownload_" + DateManager.Now().ToString("yyyyMMddHHmmss") + ".zip";

                //ファイルの保存先指定
                FolderBrowserDialog fbd = new FolderBrowserDialog();
                fbd.Description = "ダウンロードしたファイルを出力するフォルダを選択してください。";
                if (fbd.ShowDialog() == DialogResult.OK)
                {
                    string path = fbd.SelectedPath;
                    if (path.GetRight(1) != "\\") path += "\\";
                    path += filename;

                    //ファイルの存在チェック
                    if (System.IO.File.Exists(path ))
                    {
                        //ダウンロードキャンセル処理
                        MessageManager.ShowCenter(this, "M0802E", new string[] { filename });
                    }
                    else
                    {
                        lblMessage.Text = "";
                        lblMessage.Visible = true;

                        //ダウンロード開始（バックグラウンド処理）
                        List<object> arg = new List<object>();
                        arg.Add(deviceDataList);
                        arg.Add(path);
                        bgDownload.RunWorkerAsync(arg);
                    }
                }
                else
                {
                    //ダウンロードのキャンセルメッセージの表示
                    MessageManager.ShowCenter(this, "M0803I");                    
                }
            }
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
            lstSubject.Enabled = true;
            lstData.Enabled = true;
            dtpStartDate.Enabled = true;
            dtpEndDate.Enabled = true;
            btnDownload.Enabled = true;
            btnBack.Enabled = true;
        }
    }
}
