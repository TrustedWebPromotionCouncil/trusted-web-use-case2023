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
    public partial class FrmSubjectDetail : Form
    {

        //親画面から設定するプロパティ
        private int _subjectId;             //対象とする被検者ID
        public int SubjectId
        {
            set { _subjectId = value; }
            get { return _subjectId; }
        }
        //画面内で保持するプロパティ
        private StudySubjectInfo studySubjectInfo;      //被検者情報を保持
        private SubjectContact subjectContact;  //被検者情報を保持
        //private String beforeStatus;        //変更前のステータス   OnGoing⇒中止or完了だけなのでいったんコメントアウト
        //private String afterStatus;         //変更後のステータス   OnGoing⇒中止or完了だけなのでいったんコメントアウト


        public FrmSubjectDetail()
        {
            InitializeComponent();

            //デザイン
            this.BackColor = Constans.GeBackClor();
        }

        private void FrmSubjectDetail_Load(object sender, EventArgs e)
        {
            //初期表示
            this.Text = Constans.APPL_PRODUCT_NAME;

            //施設、試験情報表示
            lblHospitalName.Text = MainModel.selectedStudyHospital.HospitalName;
            lblStudyName.Text = MainModel.selectedStudyHospital.StudyName;

            //画面の表示
            DispForm();

        }

        //画面の表示
        private void DispForm()
        {

            studySubjectInfo = MainModel.ds.GetStudySubject(_subjectId);
            foreach (SubjectContact subject in MainModel.ds.GetSubjectList(MainModel.selectedStudyHospital))
            {
                if (subject.Id == studySubjectInfo.StudySubject.Id)
                {
                    subjectContact = subject;
                }
            }

            lblSubjectID.Text = studySubjectInfo.StudySubject.SubjectCode;
            txtIcDate.Text = ExtensionMethod.ToFormatString(subjectContact.FirstIcDate);
            txtIcCancelDate.Text = ExtensionMethod.ToFormatString(subjectContact.WithdrawIcDate);
            foreach (SubjectIc subjectIc in studySubjectInfo.SubjectIcs)
            {
                if (subjectIc.IcType == "WI")
                {
                    //同意撤回の理由が設定されていたらセット
                    if (!subjectIc.WithdrawReason.IsNullOrEmpty())
                    {
                        txtIcCancelReason.Text = subjectIc.WithdrawReason;
                    }
                }
            }
            txtEndDate.Text = ExtensionMethod.ToFormatString(subjectContact.EndDate);

            btnUpdate.Enabled = false;


            rdbBeforeIc.Checked = false;
            rdbBeforeIc.Enabled = false;
            rdbOnGoing.Checked = false;
            rdbOnGoing.Enabled = false;
            rdbDiscontinuation.Checked = false;
            rdbDiscontinuation.Enabled = false;
            rdbComplete.Checked = false;
            rdbComplete.Enabled = false;

            ////変更前のステータスを保持（変更されたときのみステータス更新ボタンを有効化するため）OnGoing⇒中止or完了だけなのでいったんコメントアウト
            //beforeStatus = studySubject.Status;
            //afterStatus = studySubject.Status;

            btnUpdate.Enabled = false;

            switch (studySubjectInfo.StudySubject.Status)
            {
                case "B":
                    rdbBeforeIc.Checked = true;
                    rdbBeforeIc.Enabled = true;
                    break;
                case "O":
                    rdbOnGoing.Checked = true;
                    rdbOnGoing.Enabled = true;

                    //施設スタッフのみ活性
                    if (MainModel.ds.participant.Role == "S")
                    {
                        //On Goingのときのみ変更可能
                        rdbDiscontinuation.Enabled = true;
                        rdbComplete.Enabled = true;

                        //更新ボタン活性
                        btnUpdate.Enabled = true;
                    }

                    break;
                case "D":
                    rdbDiscontinuation.Checked = true;
                    rdbDiscontinuation.Enabled = true;
                    break;
                case "C":
                    rdbComplete.Enabled = true;
                    rdbComplete.Checked = true;
                    break;
            }
        }

        // ラジオボタンのチェック状態変更時の処理

        private void ChangeRadioButton()
        {
            //OnGoing⇒中止or完了だけなのでいったんコメントアウト
            //if (rdbDiscontinuation.Checked == true)
            //{
            //    afterStatus = "D";
            //}
            //else if (rdbComplete.Checked == true)
            //{
            //    afterStatus = "C";
            //}

            //btnUpdate.Enabled = (beforeStatus != afterStatus);
        }
        private void RdbDiscontinuation_Click(object sender, EventArgs e)
        {
            //OnGoing⇒中止or完了だけなのでいったんコメントアウト
            //changeRadioButton();
        }

        private void RdbComplete_Click(object sender, EventArgs e)
        {
            //OnGoing⇒中止or完了だけなのでいったんコメントアウト
            //changeRadioButton();
        }

        //ステータス更新ボタン押下時
        private void BtnUpdate_Click(object sender, EventArgs e)
        {
            //ステータスの更新
            MainModel.ds.ChangeSubjectStatus(_subjectId, rdbDiscontinuation.Checked ? "D" : (rdbComplete.Checked ? "C" : ""));

            //OnGoing⇒中止or完了だけなのでいったんコメントアウト
            ////変更前の値を更新
            //beforeStatus = afterStatus;
            
            MessageManager.ShowCenter(this, "M1001I");

            //データの再取得
            studySubjectInfo = MainModel.ds.GetStudySubject(_subjectId);

            //画面の表示
            DispForm();
        }

        //Closeボタン押下時
        private void BtnClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        //フォームクローズ後
        private void FrmSubjectDetail_FormClosed(object sender, FormClosedEventArgs e)
        {
            //呼び出し元に保持されている重複確認用のSubjectIDを削除
            FrmStudySubjectList form = (FrmStudySubjectList)this.Owner;
            form.OpenSubjectList.Remove(_subjectId);

            //再描写
            form.DispForm();
        }

    }
}
