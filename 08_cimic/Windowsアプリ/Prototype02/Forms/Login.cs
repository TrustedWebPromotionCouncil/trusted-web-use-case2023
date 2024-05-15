using Prototype02.Models;
using Prototype02.Common;
using System;
using System.Drawing;
using System.Windows.Forms;
using System.Threading;
using System.Threading.Tasks;

namespace Prototype02.Forms
{
    public partial class FrmLogin : Form
    {
        //ペルソナ作成
        private int prsonaResult = 0;

        //createPersonaの実行カウント
        private int createPersonaCnt = 1;

        public FrmLogin()
        {
            InitializeComponent();

            //デザイン
            this.BackColor = Constans.GeBackClor();
        }

        //初期表示
        private void FrmLogin_Load(object sender, EventArgs e)
        {
            //初期表示
            this.Text = Constans.APPL_PRODUCT_NAME;

            //ログインボタン非活性化
            txtUserId.Text = "";
            btnLogin.Enabled = false;

            //メッセージ非表示
            lblMessage.Text = "";


            //★開発用
            //txtUserId.Text = "P5R7NG";
        }

        //ログインボタン押下時
        private void btnLogin_Click(object sender, EventArgs e)
        {
            //画面非活性化
            txtUserId.Enabled = false;
            btnLogin.Enabled = false;

            //TD認証
            try
            {
                if (MainModel.ds.getMyInfo(txtUserId.Text.Trim()))
                {
                    //本来TD的にはSubnameは必須だがString.Emptyをセットすることで回避
                    MainModel.ds.participant.SubName = MainModel.ds.participant.SubName ?? String.Empty;

                    //バックグラウンドでペルソナ作成
                    bgPersona.RunWorkerAsync();
                }
                else
                {
                    Logger.Debug("participantが取得できませんでした:" + txtUserId.Text.Trim());
                    MessageManager.ShowCenter(this, "M0002E");

                    //画面の活性化
                    formActivate();
                }
            }
            catch (Exception err)
            {
                MessageManager.ShowCenter(this, "M0901E", new string[] { "btnLogin_Click\n" + err.Message});
                //画面の活性化
                formActivate();
            }
        }

        private void txtUserId_TextChanged(object sender, EventArgs e)
        {
            //ログインボタン活性化
            btnLogin.Enabled = (txtUserId.Text != "");
        }

        //画面遷移
        private void nextForm()
        {
            FrmSelectStudyHospital form = new FrmSelectStudyHospital();
            MainModel.MyApplicationContext.MainForm = form;

            //表示位置をキープ
            Point point = this.Location;
            form.StartPosition = FormStartPosition.Manual;
            form.Location = point;

            form.Show();
            this.Close();
        }


        //バックグラウンド処理
        private void bgPersona_DoWork(object sender, System.ComponentModel.DoWorkEventArgs e)
        {

            prsonaResult = -1; //初期値
            //ペルソナの作成
            Logger.Debug("ペルソナ作成:" + txtUserId.Text);
            Task<int> task = Task.Run(() =>
            {
                //createPersonaでgetActivePersona出来なかった場合は
                //再度createPersonaを実行してペルソナ作成を行うため
                //引数：isFirstにcreatePersonaCntを判定した結果を渡す
                return MainModel.ds.createPersona(MainModel.ds.participant.Name, MainModel.ds.participant.SubName, createPersonaCnt == 1);
            });

            //既に作成済みの場合は設定中メッセージを表示しないようにすこしSleepさせる。（Sleepしている間にTask終了）
            Thread.Sleep(2000);


            //進捗表示
            int sleepTime = 200;
            int i = 0;
            while (!task.IsCompleted)
            {
                i += 1;
                bgPersona.ReportProgress(i);
                Thread.Sleep(sleepTime);
                //タスクが完了したら終了
                if (task.IsCompleted)
                {
                    Logger.Debug("ペルソナ作成完了:" + MainModel.ds.participant.Uri);
                    prsonaResult = task.Result;
                    break;
                }
                else if (i * sleepTime > 1000 * 60 * 20)
                {
                    //ペルソナ作成に20分以上かかったらいったん終了
                    break;
                }
            }
            //whileに入る前にタスクが完了した場合に備えて念のため
            prsonaResult = task.Result;
        }

        ////バックグラウンド処理変更時
        private void bgPersona_ProgressChanged(object sender, System.ComponentModel.ProgressChangedEventArgs e)
        {
            //メッセージ表示
            string tmp = "";
            for (int i = 1; i <= e.ProgressPercentage % 10; i++)
            {
                tmp += ".";
            }
            lblMessage.Text = MessageManager.GetMessage("M0003") + tmp;
        }

        //バックグラウンド処理完了
        private void bgPersona_RunWorkerCompleted(object sender, System.ComponentModel.RunWorkerCompletedEventArgs e)
        {            
            if (prsonaResult < 0)
            {
                string[] args; //メッセージ用のパラメータ変数
                args = new string[] { MainModel.ds.participant.Name , MainModel.ds.participant.SubName, Util.DecodeRole(MainModel.ds.participant.Role) };
                if (MessageManager.ShowCenter(this, "M0006Q", args) == DialogResult.Yes)
                {
                    //createPersonaの実行回数カウントアップ
                    createPersonaCnt = createPersonaCnt + 1;
                    //再度バックグラウンドでペルソナ作成
                    bgPersona.RunWorkerAsync();

                } else
                {
                    //画面の活性化
                    formActivate();
                }
            } else if (prsonaResult > 0) { 

                //エラー表示
                MessageManager.ShowCenter(this, "M0901E", new string[] { "bgPersona.DirectoryServiceImpl.createPersona\n" + MessageManager.GetMessage("K" + Convert.ToString(prsonaResult)) });
                
                //画面の活性化
                formActivate();
            } else {
                //ログインのログ出力
                Logger.Info(Logger.LogTimingOther, Util.GetResourceString("L0001"));

                //ペルソナ作成が行われた場合は初回ログインのメッセージを表示
                if (createPersonaCnt != 1)
                {
                    MessageManager.ShowCenter(this, "M0007I");
                }
                
                //画面遷移
                nextForm();
            }
        }


        //画面の活性化
        private void formActivate()
        {
            //メッセージ初期化
            lblMessage.Text = "";

            //画面活性化
            txtUserId.Enabled = true;
            btnLogin.Enabled = true;
        }

    }
}
