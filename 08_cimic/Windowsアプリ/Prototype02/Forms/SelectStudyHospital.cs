using Prototype02.Models;
using Prototype02.Common;
using System;
using System.Drawing;
using System.Windows.Forms;
using System.Collections.Generic;
using System.Linq;
using CroTrustedDirectory.Models;



namespace Prototype02.Forms
{
    public partial class FrmSelectStudyHospital : Form
    {

        public FrmSelectStudyHospital()
        {
            InitializeComponent();

            //デザイン
            this.BackColor = Constans.GeBackClor();
        }

        //初期表示
        private void FrmSelectStudyHospital_Load(object sender, EventArgs e)
        {
            //初期表示
            this.Text = Constans.APPL_PRODUCT_NAME;
            lblMessage.Text = "";

            //画面表示
            setDisplay();
        }

        //画面表示
        private void setDisplay()
        {
            //Study Hospitalの取得
            List<StudyHospital> studyHospital = MainModel.ds.getMyStudies();
            if (studyHospital != null)
            {
                if (studyHospital.Count > 0)
                {
                    lstStudyHospital.DisplayMember = "";    //lstStudyHospital_Formatで編集
                    lstStudyHospital.ValueMember = "Id";
                    lstStudyHospital.DataSource = studyHospital;
                    lstStudyHospital.ClearSelected();
                }
                else
                {
                    lblMessage.Text = MessageManager.GetMessage("M0010I");
                }
            } else
            {
                MessageManager.ShowCenter(this, "M0901E", new string[] { "setDisplay.DirectoryServiceImpl.getMyStudies" });
            }
            
            //選択ボタン非活性化
            btnSelect.Enabled = false;
        }

        //Study Hospital選択時
        private void lstStudyHospital_SelectedIndexChanged(object sender, EventArgs e)
        {
            //選択ボタン非活性化
            btnSelect.Enabled = true;
        }

        //selectボタン押下時
        private void btnSelect_Click(object sender, EventArgs e)
        {
            //Study-Hospital選択
            selectStudyHospital();
        }

        //Study-Hospitalリストダブルクリック時
        private void lstStudyHospital_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            //Study-Hospital選択
            selectStudyHospital();
        }

        //Study-Hospital選択
        private void selectStudyHospital()
        {
            if (lstStudyHospital.SelectedIndex > -1)
            {
                //選択された内容をセット
                MainModel.selectedStudyHospital = (StudyHospital)lstStudyHospital.SelectedItem;

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

        //リストボックスの表示カスタマイズ
        private void lstStudyHospital_Format(object sender, ListControlConvertEventArgs e)
        {
            e.Value = ((StudyHospital)e.ListItem).StudyName + " - " + ((StudyHospital)e.ListItem).HospitalName;

        }
    }
}
