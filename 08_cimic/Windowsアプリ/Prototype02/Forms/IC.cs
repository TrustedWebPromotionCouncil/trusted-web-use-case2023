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
using System.Linq;

namespace Prototype02.Forms
{
    public partial class FrmIC : Form
    {
        //親画面から設定するプロパティ
        private int _subjectId;                         //対象とする被検者ID
        public int SubjectId
        {
            set { _subjectId = value; }
            get { return _subjectId; }
        }
        //画面内で保持するプロパティ
        private StudySubjectInfo studySubjectInfo;      //被検者情報を保持
        private IList<IcDoc> icDocList;                 //試験-施設の同意文書を保持
        private int aciveIcDocId;                       //有効な同意文書IDを保持
        private List<BoxFileInfo> boxFiles = new List<BoxFileInfo>();   //ボックスから取得したファイルリスト
        private int icDownloadResult = 0;       //同意書ダウンロードの結果
        private int icSignResult = 0;           //署名の結果
        private Boolean withdraw = false;       //同意撤回の有無
        private MyTreeNode selectedIcTreeNode = new MyTreeNode();   //選択した署名ノード
        private string icDocBoxId = "";                             //同意署名文書のIdを取得
        private int explainCount = 0;                               //同意説明回数
        private int lastIcSignedId = 0;                             //最終の署名のIdを取得
        private string singDocBoxId = "";                           //署名を追加するファイルのBox Id


        public FrmIC()
        {
            InitializeComponent();

            //デザイン
            this.BackColor = Constans.GeBackClor();

            //tvIc.ExpandAll();
        }

        //フォームの初期表示
        private void FrmIC_Load(object sender, EventArgs e)
        {
            //初期表示
            this.Text = Constans.APPL_PRODUCT_NAME;
            
            //TDの情報取得
            studySubjectInfo = MainModel.ds.GetStudySubject(_subjectId);
            icDocList = MainModel.ds.GetIcDocument(MainModel.selectedStudyHospital.StudyId, MainModel.selectedStudyHospital.HospitalId);

            //情報表示
            lblHospitalName.Text = MainModel.selectedStudyHospital.HospitalName;
            lblStudyName.Text = MainModel.selectedStudyHospital.StudyName;
            lblSubjectID.Text = studySubjectInfo.StudySubject.SubjectCode;
            txtIcCancelReason.Text = "";

            //画面表示
            DispForm();
        }

        //画面表示
        public void DispForm()
        {
            //初期表示
            lblMessageDownload.Text = "";
            lblMessageDownload.Visible = false;
            lblMessageSign.Text = "";
            lblMessageSign.Visible = false;

            btnDocAddSignner.Enabled = false;
            btnDowload.Enabled = false;
            btnDocSign.Enabled = false;

            //TreeViewの表示
            DispTreeView();
        }

        //TreeViewの表示
        private void DispTreeView()
        {
            //TDの情報取得
            studySubjectInfo = MainModel.ds.GetStudySubject(_subjectId);

            tvIc.Nodes.Clear();
            foreach (IcDoc icDoc in icDocList)
            {
                MyTreeNode tn = new MyTreeNode();
                tn.Name = icDoc.Id.ToString();
                tn.IcId = icDoc.Id;
                tn.Text = icDoc.IcDocName;
                tn.IcDocSeq = icDoc.IcDocSeq;
                tn.IcDocBoxId = icDoc.IcDocBoxId;
                tn.IcDocName = icDoc.IcDocName;

                foreach (SubjectIc subjectIc in studySubjectInfo.SubjectIcs
                        .Where(s => s.IcDoc.Id == icDoc.Id && s.IcType != "WI")
                        .OrderBy(s =>
                        {
                            if (s.EsignStatus == "E")
                                return 0; // 署名を先
                            else
                                return 1; // 署名以外（同意）を後
                        })
                        .ThenBy(s =>
                        {
                            if (s.EsignDate.CompareTo(new DateTime()) != 0)
                                return 0; // サイン済を上位
                            else
                                return s.Id; // サイン未はID順
                        })
                        .ThenBy(s => s.EsignDate ) //署名日の降順にソート
                    )
                {
                    //if (subjectIc.IcDoc.Id == icDoc.Id ) {
                    MyTreeNode tnChild = new MyTreeNode();
                    String esignSigner = "";
                    if (subjectIc.EsignStatus == "E")
                    {
                        esignSigner = "署名 " + subjectIc.EsignSigner.Name;
                    }
                    else if (subjectIc.EsignStatus == "C")
                    {
                        esignSigner = "同意";
                    }

                    if (subjectIc.EsignDate.CompareTo(new DateTime()) != 0)
                    {
                        esignSigner += "（" + ExtensionMethod.ToFormatString(subjectIc.EsignDate) + "）";
                    } else
                    {
                        esignSigner += "（署名未）";
                    }
                    tnChild.IcId = subjectIc.Id;
                    tnChild.EsignStatus = subjectIc.EsignStatus;
                    tnChild.Name = subjectIc.Id.ToString();
                    tnChild.Text = esignSigner;
                    tnChild.EsignSignerId = subjectIc.EsignSignerId.ToString();
                    tnChild.EsignDate = subjectIc.EsignDate;
                    tnChild.IcDocBoxId = subjectIc.IcSigndocBoxId;
                    tnChild.IcDocName = subjectIc.IcSigndocNm;
                    tnChild.IcNumber = subjectIc.IcNumber;

                    tn.Nodes.Add(tnChild);

                    //}
                }
                tvIc.Nodes.Add(tn);

                //最後のIcのIdをセット ★同意がオープンの時のみチェックを入れた
                aciveIcDocId = icDoc.Id;
            }


            //同意撤回のノード追加
            withdraw = false;
            foreach (SubjectIc subjectIc in studySubjectInfo.SubjectIcs)
            {
                if (subjectIc.IcType == "WI")
                {
                    MyTreeNode tn = new MyTreeNode();
                    tn.Name = "同意撤回";
                    tn.Text = "同意撤回（" + ExtensionMethod.ToFormatString(subjectIc.Created) + "）";
                    tvIc.Nodes.Add(tn);

                    withdraw = true;

                    //同意撤回の理由が設定されていたらセット
                    if (!subjectIc.WithdrawReason.IsNullOrEmpty())
                    {
                        txtIcCancelReason.Text = subjectIc.WithdrawReason;
                    }
                }
            }

            tvIc.ExpandAll();
        }

        //ノード選択時
        private void TvIc_AfterSelect(object sender, TreeViewEventArgs e)
        {
            MyTreeNode selectedNode = (MyTreeNode)tvIc.SelectedNode;
            MyTreeNode selectedIcNode = GetSelectedIcNode();

            //署名社追加の有効化判定（最新の同意文書）
            if (aciveIcDocId == selectedNode.IcId)
            {
                //以下の場合のみ署名者追加可能
                //・同意がない
                //・同意撤回がない
                //・ステータスが同意前、もしくは試験参加中
                //・次の同意文書が登録されていない
                bool checkIc = false;
                foreach (MyTreeNode tnChild in  selectedNode.Nodes)
                {
                    if (tnChild.EsignStatus == "C")
                    {
                        checkIc = true;
                    }
                }

                if (checkIc == false  
                    && withdraw == false 
                    && (studySubjectInfo.StudySubject.Status == "B" || studySubjectInfo.StudySubject.Status == "O")
                    && icDocList.Count(s => s.IcDocSeq > selectedIcNode.IcDocSeq) == 0
                    )
                {
                    //施設スタッフのみ活性
                    if (MainModel.ds.participant.Role == "S")
                    {
                        btnDocAddSignner.Enabled = true;
                    }
                } else
                {
                    btnDocAddSignner.Enabled = false;
                }
            }
            else
            {
                btnDocAddSignner.Enabled = false;
            }

            //同意書ダウンロードの有効化判定（選択肢が同意文書）
            if (selectedNode.Level == 0 && !selectedNode.IcDocBoxId.IsNullOrEmpty())
            {
                //オリジナルの同意書はダウンロード可
                btnDowload.Enabled = true;
            }
            else
            {
                //署名文書のみダウンロード可
                if (selectedNode.Level == 1 && selectedNode.EsignDate.CompareTo(new DateTime()) != 0)
                {
                    btnDowload.Enabled = true;
                } else
                {
                    btnDowload.Enabled = false;
                }
            }

            //署名の有効化判定（同意および同意撤回がされていない、かつ選択肢が署名者、署名者がログイン者自身、署名日がセットされていない）
            if (withdraw == false 
                && (studySubjectInfo.StudySubject.Status == "B" || studySubjectInfo.StudySubject.Status == "O")
                && selectedNode.Level == 1
                && aciveIcDocId == selectedIcNode.IcId
                && selectedNode.EsignStatus == "E" 
                && selectedNode.EsignSignerId == MainModel.ds.participant.Id.ToString() 
                && selectedNode.EsignDate.CompareTo(new DateTime()) == 0
                )
            {
                //施設スタッフのみ活性
                if (MainModel.ds.participant.Role == "S")
                {
                    btnDocSign.Enabled = true;
                }
            } else
            {
                btnDocSign.Enabled = false;
            }
        }

        //選択された同意文書IDの取得
        private MyTreeNode GetSelectedIcNode()
        {
            MyTreeNode selectedIcNode = new MyTreeNode();
            if (tvIc.SelectedNode != null)
            {
                if (tvIc.SelectedNode.Level == 0)
                {
                    selectedIcNode = (MyTreeNode)tvIc.SelectedNode;
                }
                else
                {
                    selectedIcNode = (MyTreeNode)tvIc.SelectedNode.Parent;
                }
            }
            return selectedIcNode;
        }

        //説明文書署名者追加
        private void BtnDocAddSignner_Click(object sender, EventArgs e)
        {
            if (tvIc.SelectedNode != null)
            {
                //選択された同意文書IDの取得
                MyTreeNode selectedIcNode = GetSelectedIcNode();

                //画面遷移
                FrmICSignature form = new FrmICSignature();
                form.SubjectId = SubjectId; //選択されている被検者IDを渡す
                form.IcDocId = int.Parse(selectedIcNode.Name);     //選択されている同意書IDを渡す

                //表示位置をキープ
                Point point = this.Location;
                form.StartPosition = FormStartPosition.Manual;
                form.Location = point;
                form.Show(this);    //自身を親画面とする
            }
        }


        //署名文書ダウンロードボタン押下時
        private void BtnDowload_Click(object sender, EventArgs e)
        {
            //バックグラウンド処理画面準備
            btnDowload.Enabled = false;
            btnClose.Enabled = false;
            lblMessageDownload.Text = "";
            lblMessageDownload.Visible = true;


            //選択された同意文書IDの取得
            MyTreeNode selectedNode = (MyTreeNode)tvIc.SelectedNode;
            MyTreeNode selectedIcNode = GetSelectedIcNode();

            //ファイルの保存先指定
            FolderBrowserDialog fbd = new FolderBrowserDialog();
            fbd.Description = "ファイルを出力するフォルダを選択してください。";
            if (fbd.ShowDialog() == DialogResult.OK)
            {
                string path = fbd.SelectedPath;
                if (path.GetRight(1) != "\\") path += "\\";
                
                //ダウンロード開始（バックグラウンド処理）
                List<object> arg = new List<object>();
                if (selectedNode.Level == 0)
                {
                    arg.Add(selectedIcNode.EsignStatus);
                    arg.Add(selectedIcNode.IcDocBoxId);
                    arg.Add(selectedIcNode.IcDocName);
                } else
                {
                    arg.Add(selectedNode.EsignStatus);
                    arg.Add(selectedNode.IcDocBoxId);
                    arg.Add(selectedNode.IcDocName);
                }
                
                arg.Add(path);
                bgDownload.RunWorkerAsync(arg);
            }
            else
            {
                //復号化のキャンセルメッセージの表示
                MessageManager.ShowCenter(this, "M0603I");
                //終了時の画面表示
                BackgroudEnd();
            }
        }

        //署名文書ダウンロードボタン非同期処理
        private void BgDownload_DoWork(object sender, System.ComponentModel.DoWorkEventArgs e)
        {
            icDownloadResult = -1; //初期値
            List<object> arg = e.Argument as List<object>;
            Task<int> task = Task.Run(() =>
            {
                if (((string)arg[0]).IsNullOrEmpty())
                {
                    //同意文書は復号化は不要
                    return MainModel.ds.icFileDownloadOnly((string)arg[1], (string)arg[3]);
                } else
                {
                    //署名や同意の場合は復号化が必要
                    return MainModel.ds.IcFileDownload((string)arg[1], (string)arg[2], (string)arg[3], MainModel.selectedStudyHospital, studySubjectInfo.StudySubject.Id);
                }
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
                    icDownloadResult = task.Result;
                    break;
                }
                else if (i * sleepTime > 1000 * 60 * 5)
                {
                    //5分以上かかったらいったん終了
                    break;
                }
            }
        }
        //同意書ダウンロード処理の状況更新
        private void BgDownload_ProgressChanged(object sender, System.ComponentModel.ProgressChangedEventArgs e)
        {
            string tmp = "";
            for (int i = 1; i <= e.ProgressPercentage % 10; i++)
            {
                tmp += ".";
            }
            lblMessageDownload.Text = MessageManager.GetMessage("M0605I") + tmp;
        }

        //署名文書ダウンロードボタン完了処理
        private void BgDownload_RunWorkerCompleted(object sender, System.ComponentModel.RunWorkerCompletedEventArgs e)
        {
            if (icDownloadResult != 0)
            {
                if (icDownloadResult == 8)
                {
                    //キャンセル処理
                    MessageManager.ShowCenter(this, "M0602E");
                }
                else
                {
                    //エラー表示
                    MessageManager.ShowCenter(this, "M0901E", new string[] { "bgDownload.DirectoryServiceImpl.getBoxFiles" });
                }
            }
            else
            {
                //完了メッセージの表示
                MessageManager.ShowCenter(this, "M0604I");
            }

            //終了時の画面表示
            BackgroudEnd();
        }


        //終了時の画面表示
        private void BackgroudEnd()
        {
            //バックグラウンド処理画面完了処理
            btnDowload.Enabled = true;
            btnClose.Enabled = true;
            lblMessageDownload.Text = "";
            lblMessageDownload.Visible = false;
            lblMessageSign.Text = "";
            lblMessageSign.Visible = false;

            //画面表示
            DispForm();
        }

        //署名ボタン押下時
        private void BtnDocSign_Click(object sender, EventArgs e)
        {
            if (MessageManager.ShowCenter(this, "M0601Q") != DialogResult.Yes)
            {
                //いいえの場合はキャンセルされたメッセージ表示
                MessageManager.ShowCenter(this, "M0606I");
            }
            else
            {

                selectedIcTreeNode = ((MyTreeNode)tvIc.SelectedNode);

                //署名対象となるドキュメント
                //初回署名の場合、施設の同意文書をダウンロードして署名＆暗号化
                //２回目以降の署名の場合、最新の署名の同意文書をダウンロードして復号化＆検証＆署名追加＆暗号化

                //同意説明文書名の保持
                icDocBoxId = GetSelectedIcNode().IcDocBoxId;

                //署名済みの検索
                foreach (SubjectIc subjectIc in  studySubjectInfo.SubjectIcs
                    .Where(s => s.IcNumber == selectedIcTreeNode.IcNumber && s.EsignDate.CompareTo(new DateTime()) != 0)
                    .OrderByDescending(s => s.EsignDate)  //署名日の降順にソート
                    )
                {
                    //署名のカウント
                    explainCount += 1;
                    //最後の署名のIdを保持
                    lastIcSignedId = subjectIc.Id;
                    //署名済みのBoxファイルIdを保持
                    singDocBoxId = subjectIc.IcSigndocBoxId;
                }
                if (explainCount == 0)
                {
                    //署名済みがない場合は同意文書BoxファイルId
                    singDocBoxId = GetSelectedIcNode().IcDocBoxId;
                }
                
                //バックグラウンド処理画面準備
                btnDowload.Enabled = false;
                btnClose.Enabled = false;
                lblMessageSign.Text = "";
                lblMessageSign.Visible = true;

                //暗号化のバックグラウンド処理
                bgSign.RunWorkerAsync();
            }
            
        }

        //署名ボタン非同期処理
        private void BgSign_DoWork(object sender, System.ComponentModel.DoWorkEventArgs e)
        {

            icSignResult = -1; //初期値
            //List<object> arg = e.Argument as List<object>;
            Task<int> task = Task.Run(() =>
            {
                return MainModel.ds.IcSign(
                        MainModel.selectedStudyHospital
                        , icDocBoxId
                        , explainCount
                        , lastIcSignedId
                        , singDocBoxId
                        , studySubjectInfo.StudySubject.BoxIdSubject
                        , selectedIcTreeNode.IcId
                        , studySubjectInfo.StudySubject.Id
                        );
            });

            //進捗表示
            int sleepTime = 200;
            int i = 0;
            while (!task.IsCompleted)
            {
                i += 1;
                bgSign.ReportProgress(i);
                Thread.Sleep(sleepTime);
                //タスクが完了したら終了
                if (task.IsCompleted)
                {
                    icSignResult = task.Result;
                    break;
                }
                else if (i * sleepTime > 1000 * 60 * 5)
                {
                    //5分以上かかったらいったん終了
                    break;
                }
            }
        }
        

        //署名ボタンの状況更新
        private void BgSign_ProgressChanged(object sender, System.ComponentModel.ProgressChangedEventArgs e)
        {
            string tmp = "";
            for (int i = 1; i <= e.ProgressPercentage % 10; i++)
            {
                tmp += ".";
            }
            lblMessageSign.Text = MessageManager.GetMessage("M0607I") + tmp;
        }

        //署名ボタン完了処理
        private void BgSign_RunWorkerCompleted(object sender, System.ComponentModel.RunWorkerCompletedEventArgs e)
        {
            if (icSignResult != 0)
            {
                if (icSignResult == 8)
                {
                    //キャンセル処理
                    MessageManager.ShowCenter(this, "M0606I");
                }
                else
                {
                    //エラー表示
                    MessageManager.ShowCenter(this, "M0901E", new string[] { "bgDownload.DirectoryServiceImpl." });
                }
            }
            else
            {
                //完了メッセージの表示
                MessageManager.ShowCenter(this, "M0608I");
            }

            //終了時の画面表示
            BackgroudEnd();
        }

        //Closeボタン押下時
        private void BtnClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        //フォームクローズ後
        private void FrmIC_FormClosed(object sender, FormClosedEventArgs e)
        {
            //呼び出し元に保持されている重複確認用のSubjectIDを削除
            FrmStudySubjectList form = (FrmStudySubjectList)this.Owner;
            form.OpenSubjectList.Remove(_subjectId);
        }

    }
}
