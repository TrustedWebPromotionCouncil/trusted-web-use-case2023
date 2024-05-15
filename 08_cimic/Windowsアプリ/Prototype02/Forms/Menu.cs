using Prototype02.Models;
using Prototype02.Common;
using System;
using System.Drawing;
using System.Windows.Forms;
using System.Threading;
using Microsoft.WindowsAPICodePack.Dialogs;
using System.IO;

namespace Prototype02.Forms
{
    public partial class FrmMenu : Form
    {
        public FrmMenu()
        {
            InitializeComponent();

            //デザイン
            this.BackColor = Constans.GeBackClor();
        }

        //初期表示
        private void FrmMenu_Load(object sender, EventArgs e)
        {
            
            //初期表示
            this.Text = Constans.APPL_PRODUCT_NAME;
            
            //施設、試験情報表示
            lblHospitalName.Text = MainModel.selectedStudyHospital.HospitalName;
            lblStudyName.Text = MainModel.selectedStudyHospital.StudyName;


            //アプリケーション切替 
            if (MainModel.ds.participant.Role != "S")
            {
                //施設スタッフ以外は利用不可
                btnEncrypt.Enabled = false;
            }
            //String applType = Common.Constans.GetApplType();
            //if (applType == Common.Constans.APPL_TYPE_SITE)
            //{
            //    //施設用（両方を使用）
            //    btnEncrypt.Visible = true;
            //    btnDecrypt.Visible = true;
            //}
            //else if (applType == Common.Constans.APPL_TYPE_CRO)
            //{
            //    //CRO用（復号化機のみ使用）
            //    btnEncrypt.Visible = false;
            //    btnDecrypt.Visible = true;
            //    btnDecrypt.Location = new Point(16, 132);
            //    btnDecrypt.Height = 147;
            //}
            //else if (applType == Common.Constans.APPL_TYPE_TEST)   
            //{
            //    //TEST用（両方を使用）
            //    btnEncrypt.Visible = true;
            //    btnDecrypt.Visible = true;
            //} else
            //{
            //    //設置漏れの阿合はどちらも表示しない
            //    btnEncrypt.Visible = false;
            //    btnDecrypt.Visible = false;
            //}

        }


        //暗号化ボタン押下時
        private void btnEncrypt_Click(object sender, EventArgs e)
        {

            //画面遷移
            FrmEncrypt form = new FrmEncrypt();
            MainModel.MyApplicationContext.MainForm = form;

            //表示位置をキープ
            Point point = this.Location;
            form.StartPosition = FormStartPosition.Manual;
            form.Location = point;

            form.Show();
            this.Close();
        }


        //復号化ボタン押下時
        private void btnDecrypt_Click(object sender, EventArgs e)
        {

            //画面遷移
            FrmDecrypt form = new FrmDecrypt();
            MainModel.MyApplicationContext.MainForm = form;

            //表示位置をキープ
            Point point = this.Location;
            form.StartPosition = FormStartPosition.Manual;
            form.Location = point;

            form.Show();
            this.Close();
        }


        //BACKボタン押下時
        private void btnBack_Click(object sender, EventArgs e)
        {
            //画面遷移
            FrmSelectStudyHospital form = new FrmSelectStudyHospital();
            MainModel.MyApplicationContext.MainForm = form;

            //表示位置をキープ
            Point point = this.Location;
            form.StartPosition = FormStartPosition.Manual;
            form.Location = point;

            form.Show();
            this.Close();
        }


        private void button1_Click(object sender, EventArgs e)
        {
        }

        //Output audit trailsボタン押下時
        private void btnAuditTrail_Click(object sender, EventArgs e)
        {


            //画面遷移
            FrmAuditTrailDataDownload form = new FrmAuditTrailDataDownload();
            MainModel.MyApplicationContext.MainForm = form;

            //表示位置をキープ
            Point point = this.Location;
            form.StartPosition = FormStartPosition.Manual;
            form.Location = point;

            form.Show();
            this.Close();

            //Prototype
            ////ファイルの保存先指定
            //FolderBrowserDialog fbd = new FolderBrowserDialog();
            //fbd.Description = "audit trailを出力するフォルダを選択してください。";
            //if (fbd.ShowDialog() == DialogResult.OK)
            //{
            //    string path = fbd.SelectedPath;
            //    if (path.GetRight(1) != "\\") path += "\\";

            //    //監査証跡の出力
            //    int result = MainModel.ds.getAuditReport(MainModel.selectedStudyHospital, path);
            //    if (result != 0)
            //    {
            //        MessageManager.ShowCenter(this, "M0901E", new string[] { "btnAuditTrail_Click.DirectoryServiceImpl.getAuditReport \n" + MessageManager.GetMessage("K" + Convert.ToString(result)) });
            //    }
            //    else
            //    {
            //        //完了メッセージの表示
            //        MessageManager.ShowCenter(this, "M0401I");
            //    }
            //}
            //else
            //{
            //    //キャンセルメッセージの表示
            //    MessageManager.ShowCenter(this, "M0402I");
            //}

            //★使い勝手的にはCommonFileDialogResultを利用したいが、
            //ダイアログが開かれると呼び出し元の画面の解像度が変わって小さくなってしまう謎の不具合あり。
            //using (var cofd = new CommonOpenFileDialog()
            //{
            //    Title = "audit trailを出力するフォルダを選択してください。",
            //    //InitialDirectory = @"D:\Users\threeshark",
            //    // フォルダ選択モードにする
            //    IsFolderPicker = true,
            //})
            //{
            //    if (cofd.ShowDialog() == CommonFileDialogResult.Ok)
            //    {
            //        string path = cofd.FileName;
            //        if (path.GetRight(1) != "\\") path += "\\";

            //        //監査証跡の出力
            //        int result = MainModel.ds.getAuditReport(MainModel.selectedStudyHospital, path);
            //        if (result != 0)
            //        {
            //            MessageManager.ShowCenter(this, "M0901E", new string[] { "btnAuditTrail_Click.DirectoryServiceImpl.getAuditReport \n" + MessageManager.GetMessage("K" + Convert.ToString(result)) });
            //        }
            //        else
            //        {
            //            //完了メッセージの表示
            //            MessageManager.ShowCenter(this, "M0401I");
            //        }

            //        //
            //    }
            //    else
            //    {
            //        //キャンセルメッセージの表示
            //        MessageManager.ShowCenter(this, "M0402I");
            //    }

            //}

        }

        //Subject Listボタン押下時
        private void btnStudySubjectList_Click(object sender, EventArgs e)
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

    }
}
