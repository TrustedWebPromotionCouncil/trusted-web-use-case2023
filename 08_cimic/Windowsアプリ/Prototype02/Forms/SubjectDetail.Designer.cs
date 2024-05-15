namespace Prototype02.Forms
{
    partial class FrmSubjectDetail
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
            this.btnClose = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.panel1 = new System.Windows.Forms.Panel();
            this.lblStudyName = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.panel2 = new System.Windows.Forms.Panel();
            this.lblHospitalName = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.panel3 = new System.Windows.Forms.Panel();
            this.lblSubjectID = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.label9 = new System.Windows.Forms.Label();
            this.label10 = new System.Windows.Forms.Label();
            this.panel7 = new System.Windows.Forms.Panel();
            this.rdbBeforeIc = new System.Windows.Forms.RadioButton();
            this.rdbComplete = new System.Windows.Forms.RadioButton();
            this.rdbDiscontinuation = new System.Windows.Forms.RadioButton();
            this.btnUpdate = new System.Windows.Forms.Button();
            this.rdbOnGoing = new System.Windows.Forms.RadioButton();
            this.txtIcCancelReason = new System.Windows.Forms.TextBox();
            this.txtIcCancelDate = new System.Windows.Forms.TextBox();
            this.txtIcDate = new System.Windows.Forms.TextBox();
            this.txtEndDate = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.panel1.SuspendLayout();
            this.panel2.SuspendLayout();
            this.panel3.SuspendLayout();
            this.panel7.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnClose
            // 
            this.btnClose.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnClose.Location = new System.Drawing.Point(297, 684);
            this.btnClose.Name = "btnClose";
            this.btnClose.Size = new System.Drawing.Size(150, 48);
            this.btnClose.TabIndex = 35;
            this.btnClose.Text = "Close";
            this.btnClose.UseVisualStyleBackColor = true;
            this.btnClose.Click += new System.EventHandler(this.BtnClose_Click);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label2.Location = new System.Drawing.Point(15, 9);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(218, 25);
            this.label2.TabIndex = 36;
            this.label2.Text = "Selected study name";
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.White;
            this.panel1.Controls.Add(this.lblStudyName);
            this.panel1.Location = new System.Drawing.Point(24, 45);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(693, 39);
            this.panel1.TabIndex = 37;
            // 
            // lblStudyName
            // 
            this.lblStudyName.AutoSize = true;
            this.lblStudyName.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.lblStudyName.Location = new System.Drawing.Point(9, 9);
            this.lblStudyName.Name = "lblStudyName";
            this.lblStudyName.Size = new System.Drawing.Size(133, 25);
            this.lblStudyName.TabIndex = 0;
            this.lblStudyName.Text = "Study Name";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label1.Location = new System.Drawing.Point(15, 96);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(244, 25);
            this.label1.TabIndex = 38;
            this.label1.Text = "Selected Hospital name";
            // 
            // panel2
            // 
            this.panel2.BackColor = System.Drawing.Color.White;
            this.panel2.Controls.Add(this.lblHospitalName);
            this.panel2.Location = new System.Drawing.Point(24, 129);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(693, 39);
            this.panel2.TabIndex = 39;
            // 
            // lblHospitalName
            // 
            this.lblHospitalName.AutoSize = true;
            this.lblHospitalName.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.lblHospitalName.Location = new System.Drawing.Point(6, 9);
            this.lblHospitalName.Name = "lblHospitalName";
            this.lblHospitalName.Size = new System.Drawing.Size(156, 25);
            this.lblHospitalName.TabIndex = 0;
            this.lblHospitalName.Text = "Hospital Name";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label3.Location = new System.Drawing.Point(15, 183);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(240, 25);
            this.label3.TabIndex = 40;
            this.label3.Text = "Selected Study Subject";
            // 
            // panel3
            // 
            this.panel3.BackColor = System.Drawing.Color.White;
            this.panel3.Controls.Add(this.lblSubjectID);
            this.panel3.Location = new System.Drawing.Point(24, 216);
            this.panel3.Name = "panel3";
            this.panel3.Size = new System.Drawing.Size(693, 39);
            this.panel3.TabIndex = 41;
            // 
            // lblSubjectID
            // 
            this.lblSubjectID.AutoSize = true;
            this.lblSubjectID.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.lblSubjectID.Location = new System.Drawing.Point(6, 9);
            this.lblSubjectID.Name = "lblSubjectID";
            this.lblSubjectID.Size = new System.Drawing.Size(116, 25);
            this.lblSubjectID.TabIndex = 0;
            this.lblSubjectID.Text = "Subject ID";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label5.Location = new System.Drawing.Point(15, 276);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(152, 25);
            this.label5.TabIndex = 42;
            this.label5.Text = "初回同意取得日";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label7.Location = new System.Drawing.Point(15, 346);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(112, 25);
            this.label7.TabIndex = 44;
            this.label7.Text = "同意撤回日";
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label9.Location = new System.Drawing.Point(10, 414);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(132, 25);
            this.label9.TabIndex = 46;
            this.label9.Text = "同意撤回理由";
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label10.Location = new System.Drawing.Point(444, 279);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(87, 25);
            this.label10.TabIndex = 48;
            this.label10.Text = "ステータス";
            // 
            // panel7
            // 
            this.panel7.BackColor = System.Drawing.Color.LightYellow;
            this.panel7.Controls.Add(this.rdbBeforeIc);
            this.panel7.Controls.Add(this.rdbComplete);
            this.panel7.Controls.Add(this.rdbDiscontinuation);
            this.panel7.Controls.Add(this.btnUpdate);
            this.panel7.Controls.Add(this.rdbOnGoing);
            this.panel7.Location = new System.Drawing.Point(449, 309);
            this.panel7.Name = "panel7";
            this.panel7.Size = new System.Drawing.Size(266, 356);
            this.panel7.TabIndex = 49;
            // 
            // rdbBeforeIc
            // 
            this.rdbBeforeIc.AutoSize = true;
            this.rdbBeforeIc.Location = new System.Drawing.Point(26, 40);
            this.rdbBeforeIc.Name = "rdbBeforeIc";
            this.rdbBeforeIc.Size = new System.Drawing.Size(90, 20);
            this.rdbBeforeIc.TabIndex = 3;
            this.rdbBeforeIc.TabStop = true;
            this.rdbBeforeIc.Text = "同意取得前";
            this.rdbBeforeIc.UseVisualStyleBackColor = true;
            // 
            // rdbComplete
            // 
            this.rdbComplete.AutoSize = true;
            this.rdbComplete.Location = new System.Drawing.Point(26, 210);
            this.rdbComplete.Name = "rdbComplete";
            this.rdbComplete.Size = new System.Drawing.Size(102, 20);
            this.rdbComplete.TabIndex = 2;
            this.rdbComplete.TabStop = true;
            this.rdbComplete.Text = "治験参加終了";
            this.rdbComplete.UseVisualStyleBackColor = true;
            this.rdbComplete.Click += new System.EventHandler(this.RdbComplete_Click);
            // 
            // rdbDiscontinuation
            // 
            this.rdbDiscontinuation.AutoSize = true;
            this.rdbDiscontinuation.Location = new System.Drawing.Point(26, 153);
            this.rdbDiscontinuation.Name = "rdbDiscontinuation";
            this.rdbDiscontinuation.Size = new System.Drawing.Size(102, 20);
            this.rdbDiscontinuation.TabIndex = 1;
            this.rdbDiscontinuation.TabStop = true;
            this.rdbDiscontinuation.Text = "治験参加中止";
            this.rdbDiscontinuation.UseVisualStyleBackColor = true;
            this.rdbDiscontinuation.Click += new System.EventHandler(this.RdbDiscontinuation_Click);
            // 
            // btnUpdate
            // 
            this.btnUpdate.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnUpdate.Location = new System.Drawing.Point(46, 252);
            this.btnUpdate.Name = "btnUpdate";
            this.btnUpdate.Size = new System.Drawing.Size(183, 83);
            this.btnUpdate.TabIndex = 50;
            this.btnUpdate.Text = "ステータス更新";
            this.btnUpdate.UseVisualStyleBackColor = true;
            this.btnUpdate.Click += new System.EventHandler(this.BtnUpdate_Click);
            // 
            // rdbOnGoing
            // 
            this.rdbOnGoing.AutoSize = true;
            this.rdbOnGoing.Location = new System.Drawing.Point(26, 96);
            this.rdbOnGoing.Name = "rdbOnGoing";
            this.rdbOnGoing.Size = new System.Drawing.Size(90, 20);
            this.rdbOnGoing.TabIndex = 0;
            this.rdbOnGoing.TabStop = true;
            this.rdbOnGoing.Text = "治験参加中";
            this.rdbOnGoing.UseVisualStyleBackColor = true;
            // 
            // txtIcCancelReason
            // 
            this.txtIcCancelReason.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.txtIcCancelReason.Location = new System.Drawing.Point(24, 442);
            this.txtIcCancelReason.Multiline = true;
            this.txtIcCancelReason.Name = "txtIcCancelReason";
            this.txtIcCancelReason.ReadOnly = true;
            this.txtIcCancelReason.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.txtIcCancelReason.Size = new System.Drawing.Size(405, 145);
            this.txtIcCancelReason.TabIndex = 51;
            // 
            // txtIcCancelDate
            // 
            this.txtIcCancelDate.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.txtIcCancelDate.Location = new System.Drawing.Point(24, 374);
            this.txtIcCancelDate.Name = "txtIcCancelDate";
            this.txtIcCancelDate.ReadOnly = true;
            this.txtIcCancelDate.Size = new System.Drawing.Size(145, 33);
            this.txtIcCancelDate.TabIndex = 52;
            // 
            // txtIcDate
            // 
            this.txtIcDate.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.txtIcDate.Location = new System.Drawing.Point(24, 306);
            this.txtIcDate.Name = "txtIcDate";
            this.txtIcDate.ReadOnly = true;
            this.txtIcDate.Size = new System.Drawing.Size(145, 33);
            this.txtIcDate.TabIndex = 53;
            // 
            // txtEndDate
            // 
            this.txtEndDate.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.txtEndDate.Location = new System.Drawing.Point(24, 628);
            this.txtEndDate.Name = "txtEndDate";
            this.txtEndDate.ReadOnly = true;
            this.txtEndDate.Size = new System.Drawing.Size(145, 33);
            this.txtEndDate.TabIndex = 55;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label4.Location = new System.Drawing.Point(15, 600);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(112, 25);
            this.label4.TabIndex = 54;
            this.label4.Text = "試験終了日";
            // 
            // FrmSubjectDetail
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(144F, 144F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.ClientSize = new System.Drawing.Size(778, 744);
            this.Controls.Add(this.txtEndDate);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.txtIcDate);
            this.Controls.Add(this.txtIcCancelDate);
            this.Controls.Add(this.txtIcCancelReason);
            this.Controls.Add(this.panel7);
            this.Controls.Add(this.label10);
            this.Controls.Add(this.label9);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.panel3);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.btnClose);
            this.DoubleBuffered = true;
            this.MaximumSize = new System.Drawing.Size(800, 800);
            this.MinimumSize = new System.Drawing.Size(800, 800);
            this.Name = "FrmSubjectDetail";
            this.ShowIcon = false;
            this.Text = "Subject Detail";
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.FrmSubjectDetail_FormClosed);
            this.Load += new System.EventHandler(this.FrmSubjectDetail_Load);
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.panel2.ResumeLayout(false);
            this.panel2.PerformLayout();
            this.panel3.ResumeLayout(false);
            this.panel3.PerformLayout();
            this.panel7.ResumeLayout(false);
            this.panel7.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnClose;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Label lblStudyName;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Label lblHospitalName;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Panel panel3;
        private System.Windows.Forms.Label lblSubjectID;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.Panel panel7;
        private System.Windows.Forms.RadioButton rdbComplete;
        private System.Windows.Forms.RadioButton rdbDiscontinuation;
        private System.Windows.Forms.Button btnUpdate;
        private System.Windows.Forms.TextBox txtIcCancelReason;
        private System.Windows.Forms.RadioButton rdbBeforeIc;
        private System.Windows.Forms.RadioButton rdbOnGoing;
        private System.Windows.Forms.TextBox txtIcCancelDate;
        private System.Windows.Forms.TextBox txtIcDate;
        private System.Windows.Forms.TextBox txtEndDate;
        private System.Windows.Forms.Label label4;
    }
}