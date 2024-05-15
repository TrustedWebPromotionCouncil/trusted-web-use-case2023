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
    public partial class FrmICSignature : Form
    {
        //親画面から設定するプロパティ
        private int _subjectId;         //対象とする被検者ID
        private int _icDocId;           //対象とする同意文書ID
        public int SubjectId
        {
            set { _subjectId = value; }
            get { return _subjectId; }
        }
        public int IcDocId
        {
            set { _icDocId = value; }
            get { return _icDocId; }
        }

        //画面内で保持するプロパティ
        private StudySubjectInfo studySubjectInfo;  //被検者情報を保持


        public FrmICSignature()
        {
            InitializeComponent();

            //デザイン
            this.BackColor = Constans.GeBackClor();
        }

        private void FrmInformedConsent_Load(object sender, EventArgs e)
        {
            //初期表示
            this.Text = Constans.APPL_PRODUCT_NAME;

            //TDの情報取得
            studySubjectInfo = MainModel.ds.GetStudySubject(_subjectId);

            //施設、試験情報表示
            lblHospitalName.Text = MainModel.selectedStudyHospital.HospitalName;
            lblStudyName.Text = MainModel.selectedStudyHospital.StudyName;
            lblSubjectID.Text = studySubjectInfo.StudySubject.SubjectCode;

            lstCandidate.ValueMember = "Id";
            lstCandidate.DisplayMember = "Name";
            lstSigner.ValueMember = "Id";
            lstSigner.DisplayMember = "Name";

            //初期表示設定）
            List<ParticipantContact> participantList = MainModel.ds.GetPaticipantContactList(MainModel.selectedStudyHospital);
            StudySubjectInfo subjectInfo = MainModel.ds.GetStudySubject(_subjectId);

            //未アサイン者（lstCandidate）の条件
            //・StudyContacts＞ParticipantContactのメンバー
            //・RoleがHospiralStaff
            //・StudySubjectInfo＞SubjectIcsのesign_signer_idに設定されていない（IC_DOC_IDもみること）

            //アサイン者設定（lstSigner）の条件
            //・StudySubjectInfo＞SubjectIcsのesign_signer_idに設定されている（IC_DOC_IDもみること）

            List<ParticipantContact> condidate = new List<ParticipantContact>();
            List<ParticipantContact> signer = new List<ParticipantContact>();
            
            foreach (ParticipantContact paticipant in participantList)
            {
                if (paticipant.Role == "S")
                {
                    bool icExists = false;
                    foreach (SubjectIc ic in subjectInfo.SubjectIcs)
                    {
                        if (ic.IcDoc.Id == IcDocId && ic.EsignSignerId == paticipant.Id)
                        {
                            icExists = true;

                            if (ic.EsignDate.CompareTo(new DateTime()) != 0)
                            {
                                paticipant.Name += "（Signed）";
                            }
                            signer.Add(paticipant);
                            break;
                        }   
                    }
                    if (!icExists)
                    {
                        condidate.Add(paticipant);
                    }
                }
            }

            lstCandidate.DataSource = condidate;
            lstCandidate.ClearSelected();
            lstSigner.DataSource = signer;
            lstSigner.ClearSelected();
        }


        //BACKボタン押下時
        private void BtnBack_Click(object sender, EventArgs e)
        {
            //画面遷移
            this.Close();
        }

        //追加
        private void BtnAdd_Click(object sender, EventArgs e)
        {
            List<ParticipantContact> condidate = new List<ParticipantContact>();
            List<ParticipantContact> signer = new List<ParticipantContact>();

            foreach (ParticipantContact paticipant in lstSigner.Items)
            {
                signer.Add(paticipant);
            }
            int idx = 0;
            foreach (ParticipantContact paticipant in lstCandidate.Items)
            {
                if (lstCandidate.GetSelected(idx))
                {
                    signer.Add(paticipant);
                }
                else
                {
                    condidate.Add(paticipant);
                }
                idx += 1;
            }
            condidate.Sort((s1, s2) => s1.Id.CompareTo(s2.Id));
            lstCandidate.DataSource = condidate;
            lstCandidate.ClearSelected();
            signer.Sort((s1, s2) => s1.Id.CompareTo(s2.Id));
            lstSigner.DataSource = signer;
            lstSigner.ClearSelected();
        }

        //削除
        private void BtnDelete_Click(object sender, EventArgs e)
        {
            List<ParticipantContact> condidate = new List<ParticipantContact>();
            List<ParticipantContact> signer = new List<ParticipantContact>();
            StudySubjectInfo subjectInfo = MainModel.ds.GetStudySubject(_subjectId);


            foreach (ParticipantContact paticipant in lstCandidate.Items)
            {
                condidate.Add(paticipant);
            }
            int idx = 0;
            foreach (ParticipantContact paticipant in lstSigner.Items)
            {
                if (lstSigner.GetSelected(idx))
                {
                    bool canDelete = true;
                    foreach (SubjectIc ic in subjectInfo.SubjectIcs)
                    {
                        if (ic.IcDoc.Id == IcDocId && ic.EsignSignerId == paticipant.Id && ic.EsignDate.CompareTo(new DateTime()) != 0)
                        {   
                            //すでに署名済みの場合は削除させない
                            canDelete = false;
                            break;
                        }
                    }
                    if (canDelete)
                    {
                        condidate.Add(paticipant);
                    } else
                    {
                        signer.Add(paticipant);
                    }
                }
                else
                {
                    signer.Add(paticipant);
                }
                idx += 1;
            }
            condidate.Sort((s1, s2) => s1.Id.CompareTo(s2.Id));
            lstCandidate.DataSource = condidate;
            lstCandidate.ClearSelected();
            signer.Sort((s1, s2) => s1.Id.CompareTo(s2.Id));
            lstSigner.DataSource = signer;
            lstSigner.ClearSelected();
        }

        //署名依頼
        private void BtnSend_Click(object sender, EventArgs e)
        {
            StudySubjectInfo subjectInfo = MainModel.ds.GetStudySubject(_subjectId);

            //該当の同意文書（icDocId）以前の study subject icの最大icNumberを取得して今回のicNumberを取得
            int icNumber = 0;
            bool firstIcDone = false;
            foreach (SubjectIc ic in subjectInfo.SubjectIcs)
            {
                if (ic.IcDoc.Id != _icDocId)
                {
                    if (icNumber < ic.IcNumber ) {
                        icNumber = ic.IcNumber;
                    }
                }

                if (ic.EsignStatus == "C" && ic.EsignDate.CompareTo(new DateTime()) != 0)
                {
                    firstIcDone = true;
                }
            }
            icNumber += 1; //カウントアップ（今回の同意回数）

            //最大の同意回数内連番の取得
            int icNumberSeq = 0;
            foreach (SubjectIc ic in subjectInfo.SubjectIcs)
            {
                if (ic.IcNumber == icNumber && ic.IcNumberSeq > icNumberSeq)
                {
                    icNumberSeq = ic.IcNumberSeq;
                }
            }
            icNumberSeq += 1;//カウントアップ（今回の同意回数内連番の）

            //署名依頼
            foreach (ParticipantContact paticipant in lstSigner.Items)
            {
                //いまの同意回数で署名者として登録されているようであれば
                bool icExists = false;
                foreach (SubjectIc ic in subjectInfo.SubjectIcs)
                {
                    if (ic.IcNumber == icNumber && ic.EsignSignerId == paticipant.Id)
                    {
                        icExists = true;
                    }
                }
                if (!icExists)
                {
                    MainModel.ds.CreateExplainSigner(icNumber, icNumberSeq, (!firstIcDone) ? "IC" : "RI", paticipant.Id, SubjectId, IcDocId);
                    icNumberSeq += 1;//カウントアップ
                    Console.WriteLine("icNumber:" + icNumber.ToString());
                    Console.WriteLine("icNumberSeq:" + icNumberSeq.ToString());
                    Console.WriteLine("IC/RI:" + ((!firstIcDone) ? "IC" : "RI"));
                    Console.WriteLine("paticipant.Id:" + paticipant.Id.ToString());
                    Console.WriteLine("subjectId:" + SubjectId.ToString());
                    Console.WriteLine("IcDocId:" + IcDocId.ToString());
                }
            }

            //署名削除
            foreach (ParticipantContact paticipant in lstCandidate.Items)
            {
                //いまの同意回数で署名者として登録されているようであれば削除
                foreach (SubjectIc ic in subjectInfo.SubjectIcs)    
                {
                    if (ic.IcNumber == icNumber && ic.EsignSignerId == paticipant.Id && ic.EsignDate.CompareTo(new DateTime()) == 0)
                    {
                        MainModel.ds.DeleteExplainSigner(ic.Id);
                        Console.WriteLine("ic.Id:" + ic.Id.ToString());
                    }
                }
            }
            
            MessageManager.ShowCenter(this, "M0701I");

        }

        //画面クローズ時
        private void FrmICSignature_FormClosed(object sender, FormClosedEventArgs e)
        {
            //呼び出し元の再描写
            FrmIC form = (FrmIC)this.Owner;
            form.DispForm();
        }

        //lstCandidateの選択時
        private void LstCandidate_Enter(object sender, EventArgs e)
        {
            //lstSinerの選択は解除する
            lstSigner.ClearSelected();
        }

        //lstSignerの選択時
        private void LstSigner_Enter(object sender, EventArgs e)
        {
            //lstCandidateの選択は解除する
            lstCandidate.ClearSelected();
        }
    }
}
