namespace Prototype02.Forms
{
    partial class FrmAuditTrailDataDownload
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
            this.label7 = new System.Windows.Forms.Label();
            this.label9 = new System.Windows.Forms.Label();
            this.btnDownload = new System.Windows.Forms.Button();
            this.dtpStartDate = new System.Windows.Forms.DateTimePicker();
            this.dtpEndDate = new System.Windows.Forms.DateTimePicker();
            this.bgDownload = new System.ComponentModel.BackgroundWorker();
            this.lblMessage = new System.Windows.Forms.Label();
            this.panel1.SuspendLayout();
            this.panel2.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnBack
            // 
            this.btnBack.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnBack.Location = new System.Drawing.Point(276, 472);
            this.btnBack.Name = "btnBack";
            this.btnBack.Size = new System.Drawing.Size(192, 48);
            this.btnBack.TabIndex = 35;
            this.btnBack.Text = "Back";
            this.btnBack.UseVisualStyleBackColor = true;
            this.btnBack.Click += new System.EventHandler(this.BtnBack_Click);
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
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label7.Location = new System.Drawing.Point(22, 195);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(115, 25);
            this.label7.TabIndex = 51;
            this.label7.Text = "Start Date";
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.label9.Location = new System.Drawing.Point(26, 260);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(102, 25);
            this.label9.TabIndex = 53;
            this.label9.Text = "End Date";
            // 
            // btnDownload
            // 
            this.btnDownload.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnDownload.Location = new System.Drawing.Point(382, 232);
            this.btnDownload.Name = "btnDownload";
            this.btnDownload.Size = new System.Drawing.Size(246, 73);
            this.btnDownload.TabIndex = 55;
            this.btnDownload.Text = "Download";
            this.btnDownload.UseVisualStyleBackColor = true;
            this.btnDownload.Click += new System.EventHandler(this.BtnDownload_Click);
            // 
            // dtpStartDate
            // 
            this.dtpStartDate.Location = new System.Drawing.Point(31, 228);
            this.dtpStartDate.Name = "dtpStartDate";
            this.dtpStartDate.Size = new System.Drawing.Size(240, 19);
            this.dtpStartDate.TabIndex = 58;
            this.dtpStartDate.Value = new System.DateTime(2024, 1, 9, 0, 0, 0, 0);
            // 
            // dtpEndDate
            // 
            this.dtpEndDate.Location = new System.Drawing.Point(35, 290);
            this.dtpEndDate.Name = "dtpEndDate";
            this.dtpEndDate.Size = new System.Drawing.Size(240, 19);
            this.dtpEndDate.TabIndex = 59;
            this.dtpEndDate.Value = new System.DateTime(2024, 1, 9, 0, 0, 0, 0);
            // 
            // bgDownload
            // 
            this.bgDownload.WorkerReportsProgress = true;
            this.bgDownload.DoWork += new System.ComponentModel.DoWorkEventHandler(this.BgDownload_DoWork);
            this.bgDownload.ProgressChanged += new System.ComponentModel.ProgressChangedEventHandler(this.BgDownload_ProgressChanged);
            this.bgDownload.RunWorkerCompleted += new System.ComponentModel.RunWorkerCompletedEventHandler(this.BgDownload_RunWorkerCompleted);
            // 
            // lblMessage
            // 
            this.lblMessage.AutoSize = true;
            this.lblMessage.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.lblMessage.ForeColor = System.Drawing.Color.Red;
            this.lblMessage.Location = new System.Drawing.Point(381, 308);
            this.lblMessage.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblMessage.Name = "lblMessage";
            this.lblMessage.Size = new System.Drawing.Size(87, 25);
            this.lblMessage.TabIndex = 60;
            this.lblMessage.Text = "メッセージ";
            // 
            // FrmAuditTrailDataDownload
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(144F, 144F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.ClientSize = new System.Drawing.Size(741, 544);
            this.Controls.Add(this.lblMessage);
            this.Controls.Add(this.dtpEndDate);
            this.Controls.Add(this.dtpStartDate);
            this.Controls.Add(this.btnDownload);
            this.Controls.Add(this.label9);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.btnBack);
            this.DoubleBuffered = true;
            this.MaximumSize = new System.Drawing.Size(763, 608);
            this.MinimumSize = new System.Drawing.Size(763, 600);
            this.Name = "FrmAuditTrailDataDownload";
            this.ShowIcon = false;
            this.Text = "Subject Data Download";
            this.Load += new System.EventHandler(this.FrmSubjectDataDownload_Load);
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.panel2.ResumeLayout(false);
            this.panel2.PerformLayout();
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
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.Button btnDownload;
        private System.Windows.Forms.DateTimePicker dtpStartDate;
        private System.Windows.Forms.DateTimePicker dtpEndDate;
        private System.ComponentModel.BackgroundWorker bgDownload;
        private System.Windows.Forms.Label lblMessage;
    }
}