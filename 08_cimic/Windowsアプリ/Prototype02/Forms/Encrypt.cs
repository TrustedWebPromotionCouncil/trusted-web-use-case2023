using Prototype02.Models;
using Prototype02.Common;
using System;
using System.Drawing;
using System.Windows.Forms;
using System.IO;
using System.Collections.Generic;
using CroTrustedDirectory.Models;
using System.Threading;
using System.Threading.Tasks;

namespace Prototype02.Forms
{
    public partial class FrmEncrypt : Form
    {
        public FrmEncrypt()
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
            btnEncrypt.Enabled = false;
            lblMessage.Visible = false;
            lblMessage.Text = "";
            //Contact Listで選択できてしまうと、選択した人に対し暗号化すると勘違いしそうなので選択時の色を変えないようにする
            grdContactList.DefaultCellStyle.SelectionBackColor = grdContactList.DefaultCellStyle.BackColor;
            grdContactList.DefaultCellStyle.SelectionForeColor = grdContactList.DefaultCellStyle.ForeColor;
            grdContactList.ClearSelection();
            //ファイルリストの設定
            lstEncrypt.DisplayMember = "FileName";
            lstEncrypt.ValueMember = "FileFullName";
            lstEncrypt.ClearSelected();
            //高さが勝手に変わってしまうため強制的に設定（※lstEncryptのHeightは自動調整される場合があるので注意）
            grdContactList.Height = 274;
            lstEncrypt.Height = 274;

            //コンタクトリスト表示
            //grdContactList.AutoGenerateColumns = false;
            //List<StudyContact> studyContact = MainModel.ds.getContract(MainModel.selectedStudyHospital);
            //grdContactList.DataSource = studyContact;

            //コンタクトリスト表示
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
                //ファイルリスト非表示（暗号化できなくするため）
                lstEncrypt.Visible = false;
                //ContactListを表示しない
                grdContactList.Visible = false;
            }
        }

        //BACKボタン押下時
        private void btnBack_Click(object sender, EventArgs e)
        {
            //フォームクローズ時のチェック
            if (closeCheck())
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

        //ドラッグ時
        private void lstEncrypt_DragEnter(object sender, DragEventArgs e)
        {
            if (e.Data.GetDataPresent(DataFormats.FileDrop))
            {
                e.Effect = DragDropEffects.All;
            }
            else
            {
                e.Effect = DragDropEffects.None;
            }
        }

        //ドラッグ＆ドロップ時
        private void lstEncrypt_DragDrop(object sender, DragEventArgs e)
        {
            foreach (string item in (string[])e.Data.GetData(DataFormats.FileDrop))
            {
                //入力チェックして追加
                if (inputcheck(item))
                {
                    lstEncrypt.Items.Add(new FileModel(item));
                }
            }

            //対象ファイルの存在判定
            targetFileExistsCheck();
        }

        //ファイルリスト（文字列）の取得
        private string getFileList()
        {
            String result = "";
            foreach (FileModel item in lstEncrypt.Items)
            {
                result += "\n・" + item.FileName;
            }
            return result;
        }

        //入力チェック
        private Boolean inputcheck(string item)
        {
            Boolean result = true;
            //フォルダチェック
            if (result && Directory.Exists(item))
            {
                //フォルダの場合はメッセージも出さずに対象外とする
                result = false;
            }

            //重複チェック
            if (result && lstEncrypt.FindStringExact(Path.GetFileName(item)) > -1)
            {
                MessageManager.ShowCenter(this, "M0101E", new string[] { Path.GetFileName(item) });
                result = false;
            }

            //サイズチェック
            if (result && new System.IO.FileInfo(item).Length > int.Parse(Common.Constans.FILE_SIZE_LIMIT))
            {
                MessageManager.ShowCenter(this,"M0102E", new string[] { Path.GetFileName(item) });
                result = false;
            }
            
            return result;
        }

        //暗号化ファイルリストダブルクリック時
        private void lstEncrypt_DoubleClick(object sender, EventArgs e)
        {
            if (lstEncrypt.Items.Count > 0)
            {
                lstEncrypt.Items.RemoveAt(lstEncrypt.SelectedIndex);
            }

            //対象ファイルの存在判定
            targetFileExistsCheck();
        }

        //フォームクローズ時のチェック
        private Boolean closeCheck()
        {
            Boolean result = true;
            if (lstEncrypt.Items.Count > 0)
            {
                result = (MessageManager.ShowCenter(this, "M0207Q") == DialogResult.Yes) ;
            }
            return result;
        }

        //暗号化ボタン押下時
        private void btnEncrypt_Click(object sender, EventArgs e)
        {
            string[] args; //メッセージ用のパラメータ変数
            //画面の非活性化
            lstEncrypt.Enabled = false;
            btnEncrypt.Enabled = false;
            btnBack.Enabled = false;

            //対象試験の確認
            args = new string[] { MainModel.selectedStudyHospital.StudyName, getFileList() };
            //対象試験確認のログ出力
            Logger.Info(Logger.LogTimingEncriptConfirm, MessageManager.GetMessage("M0203Q", args));

            if (MessageManager.ShowCenter(this, "M0203Q", args) != DialogResult.Yes)
            {
                //「いいえ」選択のログ出力
                args = new string[] { MessageManager.GetMessage("L0201Yes") };
                Logger.Info(Logger.LogTimingEncriptConfirm, MessageManager.GetMessage("L0201", args));

                //いいえの場合はキャンセルされたメッセージ表示
                MessageManager.ShowCenter(this, "M0204I");
            }
            else
            {
                //「はい」選択のログ出力
                args = new string[] { MessageManager.GetMessage("L0201No") };
                Logger.Info(Logger.LogTimingEncriptConfirm, MessageManager.GetMessage("L0201", args));
                
                lblMessage.Text = "";
                lblMessage.Visible = true;

                //暗号化のバックグラウンド処理
                bgEncrypt.RunWorkerAsync();
            }
        }

        //暗号化（バックグラウンド処理から呼び出し用）
        private async Task<int> encrypt()
        {
            foreach (FileModel item in lstEncrypt.Items)
            {
                try //バイト配列化が出来なかった場合（ファイルが掴まれている、ファイルが存在しないなど）のエラーをキャッチさせるためのTry
                {
                    //選択したファイルファイルのバイト配列化
                    FileStream fs = new FileStream(
                        @item.FileFullName,
                        FileMode.Open,
                        FileAccess.Read);
                    byte[] bs = new byte[fs.Length];
                    fs.Read(bs, 0, bs.Length);
                    fs.Close();

                    //暗号化＆BOXアップロード ※ファイル名の頭にタイムスタンプを付与
                    int result = await MainModel.ds.fileUpload(DateManager.Now().ToString("yyyyMMddHHmmss") + "_" + item.FileName, bs, MainModel.selectedStudyHospital);

                    if (result != 0)
                    {
                        //エラー処理：バックグラウンド処理中はメッセージを表示できないのでIDとパラメータを保持
                        string tmp = "btnEncrypt.DirectoryServiceImpl.fileUpload\n";
                        if (result == 1000)
                        {
                            tmp = tmp + "Contact Study Hospital Not Found";
                        } else
                        {
                            tmp = tmp + MessageManager.GetMessage("K" + Convert.ToString(result));
                        }
                        item.EncryptErrorId = "M0202E";
                        item.EncryptErrorArg = new string[] { item.FileName, tmp };

                        continue;
                    }
                }
                catch (IOException e1)
                {
                    //エラー処理：バックグラウンド処理中はメッセージを表示できないのでIDとパラメータを保持
                    item.EncryptErrorId = "M0202E";
                    item.EncryptErrorArg = new string[] { item.FileName, e1.Message };
                    continue;
                }
                //暗号化成功
                item.EncryptSuccess = true;
            }
            return 0;
        }

        //暗号化バックグラウンド処理開始
        private void bgEncrypt_DoWork(object sender, System.ComponentModel.DoWorkEventArgs e)
        {
            List<object> arg = e.Argument as List<object>;
            Task<int> task = Task.Run(() =>
            {
                return encrypt();
            });

            //進捗表示
            int sleepTime = 200;
            int i = 0;
            while (!task.IsCompleted)
            {
                i += 1;
                bgEncrypt.ReportProgress(i);
                Thread.Sleep(sleepTime);
                //タスクが完了したら終了
                if (task.IsCompleted)
                {
                    break;
                }
                else if (i * sleepTime > 1000 * 60 * 20)
                {
                    //ファイル取得に20分以上かかったらいったん終了
                    break;
                }
            }
        }

        //暗号化バックグラウンド処理の状況更新
        private void bgEncrypt_ProgressChanged(object sender, System.ComponentModel.ProgressChangedEventArgs e)
        {
            string tmp = "";
            for (int i = 1; i <= e.ProgressPercentage % 10; i++)
            {
                tmp += ".";
            }
            lblMessage.Text = MessageManager.GetMessage("M0206") + tmp;
        }

        //暗号化バックグラウンド処理の完了
        private void bgEncrypt_RunWorkerCompleted(object sender, System.ComponentModel.RunWorkerCompletedEventArgs e)
        {
            string[] args; //メッセージ用のパラメータ変数
            bool failFlg = false;   //失敗が１つでもあった場合は立てる

            //暗号化失敗のメッセージ表示
            for (int i = 0; i <= lstEncrypt.Items.Count - 1; i++)
            {
                FileModel fm = (FileModel)lstEncrypt.Items[i];
                if (!fm.EncryptSuccess)
                {
                    MessageManager.ShowCenter(this, fm.EncryptErrorId, fm.EncryptErrorArg);
                }
            }

            //暗号化が成功したファイルのみ削除
            for (int i = lstEncrypt.Items.Count - 1; i >= 0; i--)
            {
                if (((FileModel)lstEncrypt.Items[i]).EncryptSuccess)
                {
                    lstEncrypt.Items.Remove(lstEncrypt.Items[i]);
                }
                else
                {
                    failFlg = true;
                }
            }

            //全ファイルの処理終了メッセージ表示
            string tmp = "";
            if (failFlg) { tmp = MessageManager.GetMessage("M0205_1"); } else { tmp = ""; };
            args = new string[] { tmp };
            MessageManager.ShowCenter(this, "M0205I", args);

            //画面の活性化
            lstEncrypt.Enabled = true;      
            btnBack.Enabled = true;
            lblMessage.Visible = false;

            //対象ファイルの存在判定
            targetFileExistsCheck();
        }

        //対象ファイルの存在判定
        private void targetFileExistsCheck()
        {
            //暗号化ボタンの制御
            if (lstEncrypt.Items.Count > 0)
            {
                btnEncrypt.Enabled = true;
            }
            else
            {
                btnEncrypt.Enabled = false;
            }
        }

    }
}
