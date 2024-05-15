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
    public partial class FrmNewSubject : Form
    {
        //画面内で保持するプロパティ
        private StudySubject studySubject;
        private bool _qrConfirm = false;
        public bool QrConfirm
        {
            set { _qrConfirm = value; }
            get { return _qrConfirm; }
        }

        public FrmNewSubject()
        {
            InitializeComponent();

            //デザイン
            this.BackColor = Constans.GeBackClor();
        }

        //フォーム表示時
        private void FrmNewSubject_Load(object sender, EventArgs e)
        {
            //初期表示
            this.Text = Constans.APPL_PRODUCT_NAME;

            //施設、試験情報表示
            lblHospitalName.Text = MainModel.selectedStudyHospital.HospitalName;
            lblStudyName.Text = MainModel.selectedStudyHospital.StudyName;
            txtSubjectCode.Text = "";


            //表示制御
            btnIDCheck.Enabled = false;
            btnQRCode.Enabled = false;
            btnApproval.Enabled = false;
            btnCancel.Enabled = true;
        }

        //ID Checkボタン押下時
        private void BtnIDCheck_Click(object sender, EventArgs e)
        {
            //すでに被検者が登録されていて承認まで終わっていない状態であれば途中から
            List<SubjectContact> subjectList = new List<SubjectContact>();
            bool exists = false;
            bool firstAccess = false;
            //bool approval = false;
            foreach (SubjectContact subject in MainModel.ds.GetSubjectList(MainModel.selectedStudyHospital))
            {
                if ((subject.SubjectCode == txtSubjectCode.Text) && (subject.FirstAccess == "false" || subject.Accepted == "false"))
                {
                    exists = true;
                    //StudySubjectInfo studySubjectInfo = MainModel.ds.GetStudySubject(subject.Id);
                    studySubject = MainModel.ds.GetStudySubject(subject.Id).StudySubject;
                    //★GetStudySubjectでエラー「BOX APIでエラーが発生しました。不正なBOX IDが登録されている可能性があります」
                    //が出る場合は環境変数の設定が漏れている。以下を設定すること。
                    //
                    if (subject.FirstAccess == "true") { firstAccess = true; }
                    //if (subject.Accepted == "true") { approval = true; }
                }
            }
            if (!exists)
            {
                //被検者の新規登録
                studySubject = MainModel.ds.CreateSubject(txtSubjectCode.Text, MainModel.selectedStudyHospital.StudyId, MainModel.selectedStudyHospital.HospitalId);
                if (studySubject.ErrorMessage.IsNullOrEmpty())
                {
                    MessageManager.ShowCenter(this, "M0504I");

                    //txtSubjectCode.ReadOnly = true;
                    txtSubjectCode.Enabled = false;
                    btnIDCheck.Enabled = false;
                    btnQRCode.Enabled = true;
                    btnApproval.Enabled = false;
                    btnCancel.Enabled = true;

                }
                else
                {
                    MessageManager.ShowCenter(this, "M0901E", new string[] { studySubject.ErrorMessage });
                }
            }
            else
            {
                txtSubjectCode.Enabled = false;
                btnIDCheck.Enabled = false;

                //txtSubjectCode.ReadOnly = true;
                if (!firstAccess)
                {
                    MessageManager.ShowCenter(this, "M0504I");
                    btnQRCode.Enabled = true;
                    btnApproval.Enabled = false;
                } else
                {
                    MessageManager.ShowCenter(this, "M0501I");
                    btnQRCode.Enabled = false;
                    btnApproval.Enabled = true;
                }
                btnCancel.Enabled = true;
            }
        }

        //初回アクセス完了時のボタン制御
        public void QrComfirmed()
        {
            btnIDCheck.Enabled = false;
            btnQRCode.Enabled = false;
            btnApproval.Enabled = true;
            btnCancel.Enabled = true;
        }

        //QR Codeボタン押下時（自身はそのままで子画面をモーダル表示）
        private void BtnQRCode_Click(object sender, EventArgs e)
        {
            //QRコード表示
            //画面遷移
            FrmQRCode form = new FrmQRCode();
            form.SubjectId = studySubject.Id; //選択されている被検者IDを渡す

            //表示位置をキープ
            Point point = this.Location;
            form.StartPosition = FormStartPosition.Manual;
            form.Location = point;

            this.Enabled = false;
            form.Show(this);
        }

        //Approvalボタン押下時
        private void BtnApproval_Click(object sender, EventArgs e)
        {
            //承認実行
            String error = "";
            MainModel.ds.SubjectAccept(studySubject.Id, ref error);
            if (error.Length == 0)
            {
                MessageManager.ShowCenter(this, "M0503I");
                this.Close();
            }
            else
            {
                MessageManager.ShowCenter(this, "M0901E", new string[] { error });
            }
        }

        //Cancelボタン押下時
        private void BtnCancel_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        //画面クローズ時
        private void FrmNewSubject_FormClosed(object sender, FormClosedEventArgs e)
        {
            //呼び出し元の再描写
            FrmStudySubjectList form = (FrmStudySubjectList)this.Owner;
            form.DispForm();
        }


        //New Subject Code変更時
        private void TxtSubjectCode_TextChanged(object sender, EventArgs e)
        {
            //New Subject Codeが入力されたらIDチェックボタンを有効化
            btnIDCheck.Enabled = (txtSubjectCode.Text.Length > 0);
        }
    }
}
