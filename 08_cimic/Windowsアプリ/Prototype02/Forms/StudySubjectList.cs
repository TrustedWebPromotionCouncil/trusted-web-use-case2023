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
using CroTrustedDirectory.Services;

namespace Prototype02.Forms
{
    public partial class FrmStudySubjectList : Form
    {
        //子画面のリスト（重複表示の禁止のため）
        private List<int> _openSubjectList = new List<int>();
        public List<int> OpenSubjectList
        {
            set { _openSubjectList = value; }
            get { return _openSubjectList; }
        }

        public FrmStudySubjectList()
        {
            InitializeComponent();

            //デザイン
            this.BackColor = Constans.GeBackClor();
        }

        //フォーム表示
        private void FrmStudySubjectList_Load(object sender, EventArgs e)
        {
            //初期表示
            this.Text = Constans.APPL_PRODUCT_NAME;

            //施設、試験情報表示
            lblHospitalName.Text = MainModel.selectedStudyHospital.HospitalName;
            lblStudyName.Text = MainModel.selectedStudyHospital.StudyName;

            //初期表示設定

            //高さが勝手に変わってしまうため強制的に設定（※lstDecryptのHeightは自動調整される場合があるので注意）
            grdSubjectList.Height = 250;

            //Subject List表示
            grdSubjectList.AutoGenerateColumns = false;

            //画面表示
            DispForm();
        }

        //画面表示
        public void DispForm()
        {
            //対象のSubjectをリストに設定
            List<mySubjectContact> subjectList = new List<mySubjectContact>();
            foreach (SubjectContact subject in MainModel.ds.GetSubjectList(MainModel.selectedStudyHospital))
            {
                if (subject.FirstAccess == "true" && subject.Accepted == "true")
                {
                    //日付表示プロパティをもった派生クラスに格納する
                    mySubjectContact mySubject = new mySubjectContact(subject);
                    subjectList.Add(mySubject);
                }
            }
            grdSubjectList.DataSource = subjectList;
            grdSubjectList.ClearSelection();


            //アプリケーション切替 
            if (MainModel.ds.participant.Role != "S")
            {
                //施設スタッフ以外は利用不可
                btnNewSubject.Enabled = false;
            }

            //対象のSubjectがなければ各種ボタンを非活性化
            bool btnActivate = (subjectList.Count > 0);
            btnInformedConsent.Enabled = btnActivate;
            btnSubjectDetail.Enabled = btnActivate;
            btnSubjectDataDownload.Enabled = btnActivate;
        }

        //選択されている行のSubjectContactを保持
        private SubjectContact GetSubject()
        {
            SubjectContact subject = new SubjectContact();
            if (grdSubjectList.SelectedRows.Count == 1)
            {
                //選択された内容をセット
                foreach (DataGridViewRow row in grdSubjectList.SelectedRows)
                {
                    subject = (SubjectContact)row.DataBoundItem;
                }
            }
            return subject;
        }

        //New Subjectボタン押下時（自身はそのままで子画面表示）
        private void BtnNewSubject_Click(object sender, EventArgs e)
        {
            //画面遷移
            FrmNewSubject form = new FrmNewSubject();

            //表示位置をキープ
            Point point = this.Location;
            form.StartPosition = FormStartPosition.Manual;
            form.Location = point;

            form.Show(this);    //自身を親画面とする
        }

        //Informed Consentボタン押下時（自身はそのままで子画面表示）
        private void BtnInformedConsent_Click(object sender, EventArgs e)
        {
            //SubjectIDの取得＆重複オープンチェック ※重複オープンチェックは同意画面、詳細画面で共有（同意によってステータスが変更され、詳細画面に影響するため）
            SubjectContact subject = GetSubject();
            if (subject.Id != 0 && !_openSubjectList.Contains(subject.Id))
            { 
                //画面遷移
                FrmIC form = new FrmIC();
                form.SubjectId = subject.Id; //選択されている被検者IDを渡す
                _openSubjectList.Add(subject.Id);

                //表示位置をキープ
                Point point = this.Location;
                form.StartPosition = FormStartPosition.Manual;
                form.Location = point;
                form.Show(this);    //自身を親画面とする
            }
        }

        //Subject Detailボタン押下時（自身はそのままで子画面表示）
        private void BtnSubjectDetail_Click(object sender, EventArgs e)
        {
            //SubjectIDの取得＆重複オープンチェック ※重複オープンチェックは同意画面、詳細画面で共有（同意によってステータスが変更され、詳細画面に影響するため）
            SubjectContact subject = GetSubject();
            if (subject.Id != 0 && !_openSubjectList.Contains(subject.Id))
            {
                ////画面遷移
                //if (subject.Status == "B")
                //{
                //FrmNewSubject form = new FrmNewSubject();
                //form.subjectId = subject.Id;    //選択されている被検者IDを渡す
                //_openSubjectList.Add(subject.Id);

                ////表示位置をキープ
                //Point point = this.Location;
                //form.StartPosition = FormStartPosition.Manual;
                //form.Location = point;
                //form.Show(this);    //自身を親画面とする

                //} else
                //{
                FrmSubjectDetail form = new FrmSubjectDetail();
                form.SubjectId = subject.Id;      //選択されている被検者IDを渡す
                _openSubjectList.Add(subject.Id);

                //表示位置をキープ
                Point point = this.Location;
                form.StartPosition = FormStartPosition.Manual;
                form.Location = point;

                    form.Show(this);    //自身を親画面とする
                //}
            }

        }

        //Subject Data Downloadボタン押下時（画面遷移）
        private void BtnSubjectDataDownload_Click(object sender, EventArgs e)
        {
            //画面遷移
            FrmSubjectDataDownload form = new FrmSubjectDataDownload();
            MainModel.MyApplicationContext.MainForm = form;

            //表示位置をキープ
            Point point = this.Location;
            form.StartPosition = FormStartPosition.Manual;
            form.Location = point;

            form.Show();
            this.Close(); 
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
    }
}
