namespace Prototype02.Forms
{
    partial class FrmIC
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.Windows.Forms.TreeNode treeNode1 = new System.Windows.Forms.TreeNode("説明 山田 太郎（2023/01/01）");
            System.Windows.Forms.TreeNode treeNode2 = new System.Windows.Forms.TreeNode("同意 患者１（2023/01/01）");
            System.Windows.Forms.TreeNode treeNode3 = new System.Windows.Forms.TreeNode("同意文書Ver1（2023/01/01)", new System.Windows.Forms.TreeNode[] {
            treeNode1,
            treeNode2});
            System.Windows.Forms.TreeNode treeNode4 = new System.Windows.Forms.TreeNode("説明 山田 太郎（2023/02/01)");
            System.Windows.Forms.TreeNode treeNode5 = new System.Windows.Forms.TreeNode("説明 鈴木花子郎（2023/02/02)");
            System.Windows.Forms.TreeNode treeNode6 = new System.Windows.Forms.TreeNode("同意 患者１（2023/02/02)");
            System.Windows.Forms.TreeNode treeNode7 = new System.Windows.Forms.TreeNode("同意文書Ver2（2023/02/01)", new System.Windows.Forms.TreeNode[] {
            treeNode4,
            treeNode5,
            treeNode6});
            System.Windows.Forms.TreeNode treeNode8 = new System.Windows.Forms.TreeNode("同意撤回 患者１（2023/03/01)");
            this.panel3 = new System.Windows.Forms.Panel();
            this.lblSubjectID = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.panel2 = new System.Windows.Forms.Panel();
            this.lblHospitalName = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.panel1 = new System.Windows.Forms.Panel();
            this.lblStudyName = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.btnClose = new System.Windows.Forms.Button();
            this.btnDocSign = new System.Windows.Forms.Button();
            this.btnDocAddSignner = new System.Windows.Forms.Button();
            this.btnDowload = new System.Windows.Forms.Button();
            this.tvIc = new System.Windows.Forms.TreeView();
            this.label5 = new System.Windows.Forms.Label();
            this.bgDownload = new System.ComponentModel.BackgroundWorker();
            this.lblMessageDownload = new System.Windows.Forms.Label();
            this.lblMessageSign = new System.Windows.Forms.Label();
            this.bgSign = new System.ComponentModel.BackgroundWorker();
            this.txtIcCancelReason = new System.Windows.Forms.TextBox();
            this.panel3.SuspendLayout();
            this.panel2.SuspendLayout();
            this.panel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // panel3
            // 
            this.panel3.BackColor = System.Drawing.Color.White;
            this.panel3.Controls.Add(this.lblSubjectID);
            this.panel3.Location = new System.Drawing.Point(24, 216);
            this.panel3.Margin = new System.Windows.Forms.Padding(4);
            this.panel3.Name = "panel3";
            this.panel3.Size = new System.Drawing.Size(692, 38);
            this.panel3.TabIndex = 48;
            // 
            // lblSubjectID
            // 
            this.lblSubjectID.AutoSize = true;
            this.lblSubjectID.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.lblSubjectID.Location = new System.Drawing.Point(6, 8);
            this.lblSubjectID.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblSubjectID.Name = "lblSubjectID";
            this.lblSubjectID.Size = new System.Drawing.Size(116, 25);
            this.lblSubjectID.TabIndex = 0;
            this.lblSubjectID.Text = "Subject ID";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label3.Location = new System.Drawing.Point(14, 182);
            this.label3.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(240, 25);
            this.label3.TabIndex = 47;
            this.label3.Text = "Selected Study Subject";
            // 
            // panel2
            // 
            this.panel2.BackColor = System.Drawing.Color.White;
            this.panel2.Controls.Add(this.lblHospitalName);
            this.panel2.Location = new System.Drawing.Point(24, 130);
            this.panel2.Margin = new System.Windows.Forms.Padding(4);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(692, 38);
            this.panel2.TabIndex = 46;
            // 
            // lblHospitalName
            // 
            this.lblHospitalName.AutoSize = true;
            this.lblHospitalName.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.lblHospitalName.Location = new System.Drawing.Point(6, 8);
            this.lblHospitalName.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblHospitalName.Name = "lblHospitalName";
            this.lblHospitalName.Size = new System.Drawing.Size(156, 25);
            this.lblHospitalName.TabIndex = 0;
            this.lblHospitalName.Text = "Hospital Name";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label1.Location = new System.Drawing.Point(14, 96);
            this.label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(244, 25);
            this.label1.TabIndex = 45;
            this.label1.Text = "Selected Hospital name";
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.White;
            this.panel1.Controls.Add(this.lblStudyName);
            this.panel1.Location = new System.Drawing.Point(24, 44);
            this.panel1.Margin = new System.Windows.Forms.Padding(4);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(692, 38);
            this.panel1.TabIndex = 44;
            // 
            // lblStudyName
            // 
            this.lblStudyName.AutoSize = true;
            this.lblStudyName.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.lblStudyName.Location = new System.Drawing.Point(8, 8);
            this.lblStudyName.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblStudyName.Name = "lblStudyName";
            this.lblStudyName.Size = new System.Drawing.Size(133, 25);
            this.lblStudyName.TabIndex = 0;
            this.lblStudyName.Text = "Study Name";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label2.Location = new System.Drawing.Point(14, 10);
            this.label2.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(218, 25);
            this.label2.TabIndex = 43;
            this.label2.Text = "Selected study name";
            // 
            // btnClose
            // 
            this.btnClose.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnClose.Location = new System.Drawing.Point(738, 744);
            this.btnClose.Margin = new System.Windows.Forms.Padding(4);
            this.btnClose.Name = "btnClose";
            this.btnClose.Size = new System.Drawing.Size(231, 48);
            this.btnClose.TabIndex = 55;
            this.btnClose.Text = "Close";
            this.btnClose.UseVisualStyleBackColor = true;
            this.btnClose.Click += new System.EventHandler(this.BtnClose_Click);
            // 
            // btnDocSign
            // 
            this.btnDocSign.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnDocSign.Location = new System.Drawing.Point(737, 493);
            this.btnDocSign.Margin = new System.Windows.Forms.Padding(4);
            this.btnDocSign.Name = "btnDocSign";
            this.btnDocSign.Size = new System.Drawing.Size(231, 74);
            this.btnDocSign.TabIndex = 57;
            this.btnDocSign.Text = "説明文書署名";
            this.btnDocSign.UseVisualStyleBackColor = true;
            this.btnDocSign.Click += new System.EventHandler(this.BtnDocSign_Click);
            // 
            // btnDocAddSignner
            // 
            this.btnDocAddSignner.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnDocAddSignner.Location = new System.Drawing.Point(738, 278);
            this.btnDocAddSignner.Margin = new System.Windows.Forms.Padding(4);
            this.btnDocAddSignner.Name = "btnDocAddSignner";
            this.btnDocAddSignner.Size = new System.Drawing.Size(231, 77);
            this.btnDocAddSignner.TabIndex = 58;
            this.btnDocAddSignner.Text = "説明文書署名者追加";
            this.btnDocAddSignner.UseVisualStyleBackColor = true;
            this.btnDocAddSignner.Click += new System.EventHandler(this.BtnDocAddSignner_Click);
            // 
            // btnDowload
            // 
            this.btnDowload.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnDowload.Location = new System.Drawing.Point(738, 383);
            this.btnDowload.Margin = new System.Windows.Forms.Padding(4);
            this.btnDowload.Name = "btnDowload";
            this.btnDowload.Size = new System.Drawing.Size(231, 75);
            this.btnDowload.TabIndex = 59;
            this.btnDowload.Text = "説明文書ダウンロード";
            this.btnDowload.UseVisualStyleBackColor = true;
            this.btnDowload.Click += new System.EventHandler(this.BtnDowload_Click);
            // 
            // tvIc
            // 
            this.tvIc.Font = new System.Drawing.Font("MS UI Gothic", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
            this.tvIc.ItemHeight = 25;
            this.tvIc.Location = new System.Drawing.Point(24, 278);
            this.tvIc.Margin = new System.Windows.Forms.Padding(4);
            this.tvIc.Name = "tvIc";
            treeNode1.Name = "ノード1";
            treeNode1.Text = "説明 山田 太郎（2023/01/01）";
            treeNode2.Name = "ノード2";
            treeNode2.Text = "同意 患者１（2023/01/01）";
            treeNode3.Name = "ノード0";
            treeNode3.Text = "同意文書Ver1（2023/01/01)";
            treeNode4.Name = "ノード4";
            treeNode4.Text = "説明 山田 太郎（2023/02/01)";
            treeNode5.Name = "ノード5";
            treeNode5.Text = "説明 鈴木花子郎（2023/02/02)";
            treeNode6.Name = "ノード6";
            treeNode6.Text = "同意 患者１（2023/02/02)";
            treeNode7.Name = "ノード3";
            treeNode7.Text = "同意文書Ver2（2023/02/01)";
            treeNode8.Name = "ノード7";
            treeNode8.Text = "同意撤回 患者１（2023/03/01)";
            this.tvIc.Nodes.AddRange(new System.Windows.Forms.TreeNode[] {
            treeNode3,
            treeNode7,
            treeNode8});
            this.tvIc.Size = new System.Drawing.Size(692, 288);
            this.tvIc.TabIndex = 60;
            this.tvIc.AfterSelect += new System.Windows.Forms.TreeViewEventHandler(this.TvIc_AfterSelect);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label5.Location = new System.Drawing.Point(13, 568);
            this.label5.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(132, 25);
            this.label5.TabIndex = 61;
            this.label5.Text = "同意撤回理由";
            // 
            // bgDownload
            // 
            this.bgDownload.WorkerReportsProgress = true;
            this.bgDownload.DoWork += new System.ComponentModel.DoWorkEventHandler(this.BgDownload_DoWork);
            this.bgDownload.ProgressChanged += new System.ComponentModel.ProgressChangedEventHandler(this.BgDownload_ProgressChanged);
            this.bgDownload.RunWorkerCompleted += new System.ComponentModel.RunWorkerCompletedEventHandler(this.BgDownload_RunWorkerCompleted);
            // 
            // lblMessageDownload
            // 
            this.lblMessageDownload.AutoSize = true;
            this.lblMessageDownload.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.lblMessageDownload.ForeColor = System.Drawing.Color.Red;
            this.lblMessageDownload.Location = new System.Drawing.Point(733, 462);
            this.lblMessageDownload.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblMessageDownload.Name = "lblMessageDownload";
            this.lblMessageDownload.Size = new System.Drawing.Size(87, 25);
            this.lblMessageDownload.TabIndex = 63;
            this.lblMessageDownload.Text = "メッセージ";
            // 
            // lblMessageSign
            // 
            this.lblMessageSign.AutoSize = true;
            this.lblMessageSign.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.lblMessageSign.ForeColor = System.Drawing.Color.Red;
            this.lblMessageSign.Location = new System.Drawing.Point(733, 571);
            this.lblMessageSign.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblMessageSign.Name = "lblMessageSign";
            this.lblMessageSign.Size = new System.Drawing.Size(87, 25);
            this.lblMessageSign.TabIndex = 64;
            this.lblMessageSign.Text = "メッセージ";
            // 
            // bgSign
            // 
            this.bgSign.WorkerReportsProgress = true;
            this.bgSign.DoWork += new System.ComponentModel.DoWorkEventHandler(this.BgSign_DoWork);
            this.bgSign.ProgressChanged += new System.ComponentModel.ProgressChangedEventHandler(this.BgSign_ProgressChanged);
            this.bgSign.RunWorkerCompleted += new System.ComponentModel.RunWorkerCompletedEventHandler(this.BgSign_RunWorkerCompleted);
            // 
            // txtIcCancelReason
            // 
            this.txtIcCancelReason.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.txtIcCancelReason.Location = new System.Drawing.Point(24, 602);
            this.txtIcCancelReason.Multiline = true;
            this.txtIcCancelReason.Name = "txtIcCancelReason";
            this.txtIcCancelReason.ReadOnly = true;
            this.txtIcCancelReason.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.txtIcCancelReason.Size = new System.Drawing.Size(692, 190);
            this.txtIcCancelReason.TabIndex = 65;
            // 
            // FrmIC
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(144F, 144F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.ClientSize = new System.Drawing.Size(1002, 846);
            this.Controls.Add(this.txtIcCancelReason);
            this.Controls.Add(this.lblMessageSign);
            this.Controls.Add(this.lblMessageDownload);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.tvIc);
            this.Controls.Add(this.btnDowload);
            this.Controls.Add(this.btnDocAddSignner);
            this.Controls.Add(this.btnDocSign);
            this.Controls.Add(this.btnClose);
            this.Controls.Add(this.panel3);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.label2);
            this.DoubleBuffered = true;
            this.Margin = new System.Windows.Forms.Padding(2);
            this.MaximumSize = new System.Drawing.Size(1024, 902);
            this.MinimumSize = new System.Drawing.Size(1024, 857);
            this.Name = "FrmIC";
            this.ShowIcon = false;
            this.Text = "Template";
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.FrmIC_FormClosed);
            this.Load += new System.EventHandler(this.FrmIC_Load);
            this.panel3.ResumeLayout(false);
            this.panel3.PerformLayout();
            this.panel2.ResumeLayout(false);
            this.panel2.PerformLayout();
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Panel panel3;
        private System.Windows.Forms.Label lblSubjectID;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Label lblHospitalName;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Label lblStudyName;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button btnClose;
        private System.Windows.Forms.Button btnDocSign;
        private System.Windows.Forms.Button btnDocAddSignner;
        private System.Windows.Forms.Button btnDowload;
        private System.Windows.Forms.TreeView tvIc;
        private System.Windows.Forms.Label label5;
        private System.ComponentModel.BackgroundWorker bgDownload;
        private System.Windows.Forms.Label lblMessageDownload;
        private System.Windows.Forms.Label lblMessageSign;
        private System.ComponentModel.BackgroundWorker bgSign;
        private System.Windows.Forms.TextBox txtIcCancelReason;
    }
}