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

namespace Prototype02.Forms
{
    public partial class FrmDecrypt : Form
    {

        //ボックスから取得したファイルリスト
        private List<BoxFileInfo> boxFiles = new List<BoxFileInfo>();

        //タスクが終了したかどうか
        private bool taskComplete = false;
        
        //復号化の結果
        private int decryptResult = 0;

        public FrmDecrypt()
        {
            InitializeComponent();

            //デザイン
            this.BackColor = Constans.GeBackClor();
        }

        //初期表示
        private void FrmEncrypt_Load(object sender, EventArgs e)
        {
            //初期表示
            this.Text = Constans.APPL_PRODUCT_NAME;

            //施設、試験情報表示
            lblHospitalName.Text = MainModel.selectedStudyHospital.HospitalName;
            lblStudyName.Text = MainModel.selectedStudyHospital.StudyName;

            //初期表示設定
            btnDecrypt.Enabled = false;
            txtSearchArea.Enabled = false;
            lstDecrypt.Visible = false;
            lblMessage.Visible = true;
            lblMessage.Text = "";
            lblMessageDecrypt.Visible = false;
            lblMessageDecrypt.Text = "";
            //Contact Listで選択できてしまうと、選択した人に対し暗号化すると勘違いしそうなので選択時の色を変えないようにする
            grdContactList.DefaultCellStyle.SelectionBackColor = grdContactList.DefaultCellStyle.BackColor;
            grdContactList.DefaultCellStyle.SelectionForeColor = grdContactList.DefaultCellStyle.ForeColor;
            grdContactList.ClearSelection();
            //ファイルリストの設定
            lstDecrypt.DisplayMember = "nm";
            lstDecrypt.ValueMember = "Id";
            //高さが勝手に変わってしまうため強制的に設定（※lstDecryptのHeightは自動調整される場合があるので注意）
            grdContactList.Height = 274;
            lstDecrypt.Height = 242;


            ////コンタクトリスト表示
            bool getContactListFlg = false;
            grdContactList.AutoGenerateColumns = false;
            List<ParticipantContact> studyContact = Util.FilterNoUrl(MainModel.ds.GetContract(MainModel.selectedStudyHospital));
            if (studyContact != null)
            {
                if (studyContact.Count > 0)
                {
                    getContactListFlg = true;
                    grdContactList.DataSource = studyContact;
                }
                else
                {
                    MessageManager.ShowCenter(this, "M0902E");
                }
            }
            else
            {
                MessageManager.ShowCenter(this, "M0901E", new string[] { "FrmEncrypt_Load.DirectoryServiceImpl.getContract" });
            }

            if (!getContactListFlg)
            {
                //ファイルリスト非表示
                lstDecrypt.Visible = false;
                //ContactListを表示しない
                grdContactList.Visible = false;

            } else
            {
                //ファイル取得は多少時間がかかるためバックグラウンド処理とする
                bgDownload.RunWorkerAsync();
            }
            
        }


        //バックグラウンド処理開始
        private void bgDownload_DoWork(object sender, System.ComponentModel.DoWorkEventArgs e)
        {
            Task<List<BoxFileInfo>> task = Task.Run(() =>
            {
                return MainModel.ds.getBoxFiles(MainModel.selectedStudyHospital.BoxId);
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
                    if (task.Result != null) {
                        boxFiles = task.Result;
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
        private void bgDownload_ProgressChanged(object sender, System.ComponentModel.ProgressChangedEventArgs e)
        {
            string tmp = "";
            for (int i = 1; i <= e.ProgressPercentage % 10; i++)
            {
                tmp += ".";
            }
            lblMessage.Text = MessageManager.GetMessage("M0301") + tmp;
        }

        //バックグラウンド処理の完了
        private void bgDownload_RunWorkerCompleted(object sender, System.ComponentModel.RunWorkerCompletedEventArgs e)
        {
            if (taskComplete)
            {
                //メッセージ初期化
                lblMessage.Text = "";
                lblMessage.Visible = false;
                lstDecrypt.Visible = true;

                //ファイルリストのセット
                lstDecrypt.DataSource = boxFiles;

                //初期設定
                lstDecrypt.ClearSelected();
                //検索ボックスの有効化
                txtSearchArea.Enabled = true;

            }
            else
            {
                //メッセージ初期化
                lblMessage.Text = "";
                //エラー表示
                MessageManager.ShowCenter(this, "M0901E", new string[] { "bgDownload.DirectoryServiceImpl.getBoxFiles" });
            }
        }

        //復号化ファイルリストのファイル名コピー
        private void lstDecrypt_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Control && e.KeyCode == Keys.C)
            {
                Clipboard.SetText(((BoxFileInfo)lstDecrypt.SelectedItem).nm);
            }
        }

        //復号化ファイルの選択変更
        private void lstDecrypt_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (lstDecrypt.SelectedItems.Count > 0)
            {
                //復号化ボタンの制御
                btnDecrypt.Enabled = true;
            } else {   
                //復号化ボタンの制御
                btnDecrypt.Enabled = false;
            }
        }

        //検索ボックスの文字変更時
        private void txtSearchArea_TextChanged(object sender, EventArgs e)
        {
            List<BoxFileInfo> searchList = new List<BoxFileInfo>();
            foreach (BoxFileInfo item in boxFiles)
            {
                //複数の部分一致判定
                if (isMatch(item.nm, txtSearchArea.Text))
                {
                    searchList.Add(item);
                }
            }
            lstDecrypt.DataSource = searchList;
        }

        //複数の部分一致判定
        //  *で分割された文字がその順番で含まれている場合一致とする
        //  例）ファイル名：20230101_テスト.pdf
        //  検索文字：0101            OK
        //  検索文字：テスト          OK
        //  検索文字：0101*テスト     OK
        //  検索文字：テスト*0101     NG
        private bool isMatch(string fileName,string searchText)
        {
            bool result = true;
            if (searchText != "")
            {
                int pos = 0;
                foreach (var keyword in searchText.Split('*'))
                {
                    pos = fileName.IndexOf(keyword, pos);
                    if (pos < 0)
                    {
                        result = false;
                        break;
                    }
                }
            }
            return result;
        }

        //Decryptボタン押下時
        private void btnDecrypt_Click(object sender, EventArgs e)
        {
            //バックグラウンド処理画面準備
            btnDecrypt.Enabled = false;
            btnBack.Enabled = false;
            lstDecrypt.Enabled = false;
            lblMessageDecrypt.Text = "";
            lblMessageDecrypt.Visible = true;

            //ファイルの保存先指定
            FolderBrowserDialog fbd = new FolderBrowserDialog();
            fbd.Description = "復号化されたファイルを出力するフォルダを選択してください。";
            if (fbd.ShowDialog() == DialogResult.OK)
            {
                string path = fbd.SelectedPath;
                if (path.GetRight(1) != "\\") path += "\\";
                
                //ファイルの存在チェック
                if (System.IO.File.Exists(path + ((BoxFileInfo)lstDecrypt.SelectedItem).nm))
                {
                    //復号化キャンセル処理
                    MessageManager.ShowCenter(this, "M0304E", new string[] { ((BoxFileInfo)lstDecrypt.SelectedItem).nm });
                    //終了時の画面表示
                    decriptEnd();

                } else
                {
                    //復号化開始（バックグラウンド処理）
                    List<object> arg = new List<object>();
                    arg.Add(lstDecrypt.SelectedItem);
                    arg.Add(path);
                    bgDecript.RunWorkerAsync(arg);
                }
            }
            else
            {
                //復号化のキャンセルメッセージの表示
                MessageManager.ShowCenter(this, "M0303I");
                //終了時の画面表示
                decriptEnd();
            }
        }

        //終了時の画面表示
        private void decriptEnd()
        {
            //バックグラウンド処理画面完了処理
            btnDecrypt.Enabled = true;
            btnBack.Enabled = true;
            lstDecrypt.Enabled = true;
            lblMessageDecrypt.Visible = false;
        }



        //復号化バックグラウンド処理開始
        private void bgDecript_DoWork(object sender, System.ComponentModel.DoWorkEventArgs e)
        {
            decryptResult = -1; //初期値
            List<object> arg = e.Argument as List<object>;
            Task<int> task = Task.Run(() =>
            {
                return MainModel.ds.FileDownload((BoxFileInfo)arg[0], (string)arg[1], MainModel.selectedStudyHospital);
            });

            //進捗表示
            int sleepTime = 200;
            int i = 0;
            while (!task.IsCompleted)
            {
                i += 1;
                bgDecript.ReportProgress(i);
                Thread.Sleep(sleepTime);
                //タスクが完了したら終了
                if (task.IsCompleted)
                {
                    decryptResult = task.Result;
                    break;
                }
                else if (i * sleepTime > 1000 * 60 * 20)
                {
                    //ファイル取得に20分以上かかったらいったん終了
                    break;
                }
            }
            //whileに入る前にタスクが完了した場合に備えて念のため
            decryptResult = task.Result;
        }

        //復号化バックグラウンド処理の状況更新
        private void bgDecript_ProgressChanged(object sender, System.ComponentModel.ProgressChangedEventArgs e)
        {
            string tmp = "";
            for (int i = 1; i <= e.ProgressPercentage % 10; i++)
            {
                tmp += ".";
            }
            lblMessageDecrypt.Text = MessageManager.GetMessage("M0305") + tmp;

        }

        //復号化バックグラウンド処理の完了
        private void bgDecript_RunWorkerCompleted(object sender, System.ComponentModel.RunWorkerCompletedEventArgs e)
        {
            if (decryptResult != 0)
            {
                MessageManager.ShowCenter(this, "M0901E", new string[] { "bgDecript.DirectoryServiceImpl.fileDownload \n" + MessageManager.GetMessage("K" + Convert.ToString(decryptResult)) });
            }
            else
            {
                //復号化完了メッセージの表示
                MessageManager.ShowCenter(this, "M0306I");
            }

            //バックグラウンド処理画面完了処理
            btnDecrypt.Enabled = true;
            btnBack.Enabled = true;
            lstDecrypt.Enabled = true;
            lblMessageDecrypt.Visible = false;
        }


        //BACKボタン押下時
        private void btnBack_Click(object sender, EventArgs e)
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


    }
}
