namespace Prototype02.Forms
{
    partial class FrmICSignature
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
            this.btnBack = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.panel1 = new System.Windows.Forms.Panel();
            this.lblStudyName = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.panel2 = new System.Windows.Forms.Panel();
            this.lblHospitalName = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.panel3 = new System.Windows.Forms.Panel();
            this.lblSubjectID = new System.Windows.Forms.Label();
            this.lstCandidate = new System.Windows.Forms.ListBox();
            this.label4 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.lstSigner = new System.Windows.Forms.ListBox();
            this.btnSend = new System.Windows.Forms.Button();
            this.btnAdd = new System.Windows.Forms.Button();
            this.btnDelete = new System.Windows.Forms.Button();
            this.panel1.SuspendLayout();
            this.panel2.SuspendLayout();
            this.panel3.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnBack
            // 
            this.btnBack.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnBack.Location = new System.Drawing.Point(315, 672);
            this.btnBack.Margin = new System.Windows.Forms.Padding(4);
            this.btnBack.Name = "btnBack";
            this.btnBack.Size = new System.Drawing.Size(150, 48);
            this.btnBack.TabIndex = 35;
            this.btnBack.Text = "Back";
            this.btnBack.UseVisualStyleBackColor = true;
            this.btnBack.Click += new System.EventHandler(this.BtnBack_Click);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label2.Location = new System.Drawing.Point(14, 10);
            this.label2.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(218, 25);
            this.label2.TabIndex = 36;
            this.label2.Text = "Selected study name";
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.White;
            this.panel1.Controls.Add(this.lblStudyName);
            this.panel1.Location = new System.Drawing.Point(24, 44);
            this.panel1.Margin = new System.Windows.Forms.Padding(4);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(692, 38);
            this.panel1.TabIndex = 37;
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
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label1.Location = new System.Drawing.Point(14, 96);
            this.label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(244, 25);
            this.label1.TabIndex = 38;
            this.label1.Text = "Selected Hospital name";
            // 
            // panel2
            // 
            this.panel2.BackColor = System.Drawing.Color.White;
            this.panel2.Controls.Add(this.lblHospitalName);
            this.panel2.Location = new System.Drawing.Point(24, 130);
            this.panel2.Margin = new System.Windows.Forms.Padding(4);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(692, 38);
            this.panel2.TabIndex = 39;
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
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label3.Location = new System.Drawing.Point(14, 182);
            this.label3.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(240, 25);
            this.label3.TabIndex = 41;
            this.label3.Text = "Selected Study Subject";
            // 
            // panel3
            // 
            this.panel3.BackColor = System.Drawing.Color.White;
            this.panel3.Controls.Add(this.lblSubjectID);
            this.panel3.Location = new System.Drawing.Point(24, 216);
            this.panel3.Margin = new System.Windows.Forms.Padding(4);
            this.panel3.Name = "panel3";
            this.panel3.Size = new System.Drawing.Size(692, 38);
            this.panel3.TabIndex = 42;
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
            // lstCandidate
            // 
            this.lstCandidate.AllowDrop = true;
            this.lstCandidate.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.lstCandidate.FormattingEnabled = true;
            this.lstCandidate.HorizontalScrollbar = true;
            this.lstCandidate.ItemHeight = 25;
            this.lstCandidate.Location = new System.Drawing.Point(24, 310);
            this.lstCandidate.Margin = new System.Windows.Forms.Padding(4);
            this.lstCandidate.Name = "lstCandidate";
            this.lstCandidate.Size = new System.Drawing.Size(234, 304);
            this.lstCandidate.TabIndex = 43;
            this.lstCandidate.Enter += new System.EventHandler(this.LstCandidate_Enter);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label4.Location = new System.Drawing.Point(14, 274);
            this.label4.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(110, 25);
            this.label4.TabIndex = 44;
            this.label4.Text = "Candidate";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label5.Location = new System.Drawing.Point(316, 274);
            this.label5.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(74, 25);
            this.label5.TabIndex = 45;
            this.label5.Text = "Signer";
            // 
            // lstSigner
            // 
            this.lstSigner.AllowDrop = true;
            this.lstSigner.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.lstSigner.FormattingEnabled = true;
            this.lstSigner.HorizontalScrollbar = true;
            this.lstSigner.ItemHeight = 25;
            this.lstSigner.Location = new System.Drawing.Point(330, 310);
            this.lstSigner.Margin = new System.Windows.Forms.Padding(4);
            this.lstSigner.Name = "lstSigner";
            this.lstSigner.Size = new System.Drawing.Size(234, 304);
            this.lstSigner.TabIndex = 46;
            this.lstSigner.Enter += new System.EventHandler(this.LstSigner_Enter);
            // 
            // btnSend
            // 
            this.btnSend.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnSend.Location = new System.Drawing.Point(579, 418);
            this.btnSend.Margin = new System.Windows.Forms.Padding(4);
            this.btnSend.Name = "btnSend";
            this.btnSend.Size = new System.Drawing.Size(150, 89);
            this.btnSend.TabIndex = 47;
            this.btnSend.Text = "署名者設定";
            this.btnSend.UseVisualStyleBackColor = true;
            this.btnSend.Click += new System.EventHandler(this.BtnSend_Click);
            // 
            // btnAdd
            // 
            this.btnAdd.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnAdd.Location = new System.Drawing.Point(273, 410);
            this.btnAdd.Margin = new System.Windows.Forms.Padding(4);
            this.btnAdd.Name = "btnAdd";
            this.btnAdd.Size = new System.Drawing.Size(44, 48);
            this.btnAdd.TabIndex = 49;
            this.btnAdd.Text = "▶";
            this.btnAdd.UseVisualStyleBackColor = true;
            this.btnAdd.Click += new System.EventHandler(this.BtnAdd_Click);
            // 
            // btnDelete
            // 
            this.btnDelete.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnDelete.Location = new System.Drawing.Point(273, 483);
            this.btnDelete.Margin = new System.Windows.Forms.Padding(4);
            this.btnDelete.Name = "btnDelete";
            this.btnDelete.Size = new System.Drawing.Size(44, 48);
            this.btnDelete.TabIndex = 50;
            this.btnDelete.Text = "◀";
            this.btnDelete.UseVisualStyleBackColor = true;
            this.btnDelete.Click += new System.EventHandler(this.BtnDelete_Click);
            // 
            // FrmICSignature
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(144F, 144F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.ClientSize = new System.Drawing.Size(741, 735);
            this.Controls.Add(this.btnDelete);
            this.Controls.Add(this.btnAdd);
            this.Controls.Add(this.btnSend);
            this.Controls.Add(this.lstSigner);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.lstCandidate);
            this.Controls.Add(this.panel3);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.btnBack);
            this.DoubleBuffered = true;
            this.MaximumSize = new System.Drawing.Size(763, 791);
            this.MinimumSize = new System.Drawing.Size(763, 791);
            this.Name = "FrmICSignature";
            this.ShowIcon = false;
            this.Text = "Informed Consent";
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.FrmICSignature_FormClosed);
            this.Load += new System.EventHandler(this.FrmInformedConsent_Load);
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.panel2.ResumeLayout(false);
            this.panel2.PerformLayout();
            this.panel3.ResumeLayout(false);
            this.panel3.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnBack;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Label lblStudyName;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Label lblHospitalName;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Panel panel3;
        private System.Windows.Forms.Label lblSubjectID;
        private System.Windows.Forms.ListBox lstCandidate;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.ListBox lstSigner;
        private System.Windows.Forms.Button btnSend;
        private System.Windows.Forms.Button btnAdd;
        private System.Windows.Forms.Button btnDelete;
    }
}