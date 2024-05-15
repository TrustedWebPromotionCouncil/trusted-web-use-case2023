namespace Prototype02.Forms
{
    partial class FrmNewSubject
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
            this.btnCancel = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.panel1 = new System.Windows.Forms.Panel();
            this.lblStudyName = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.panel2 = new System.Windows.Forms.Panel();
            this.lblHospitalName = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.btnIDCheck = new System.Windows.Forms.Button();
            this.btnQRCode = new System.Windows.Forms.Button();
            this.btnApproval = new System.Windows.Forms.Button();
            this.txtSubjectCode = new System.Windows.Forms.TextBox();
            this.panel1.SuspendLayout();
            this.panel2.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnCancel
            // 
            this.btnCancel.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnCancel.Location = new System.Drawing.Point(566, 312);
            this.btnCancel.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new System.Drawing.Size(150, 85);
            this.btnCancel.TabIndex = 35;
            this.btnCancel.Text = "Cancel";
            this.btnCancel.UseVisualStyleBackColor = true;
            this.btnCancel.Click += new System.EventHandler(this.BtnCancel_Click);
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
            this.panel1.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
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
            this.panel2.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
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
            this.label3.Location = new System.Drawing.Point(14, 196);
            this.label3.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(193, 25);
            this.label3.TabIndex = 40;
            this.label3.Text = "New Subject Code";
            // 
            // btnIDCheck
            // 
            this.btnIDCheck.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnIDCheck.Location = new System.Drawing.Point(26, 312);
            this.btnIDCheck.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.btnIDCheck.Name = "btnIDCheck";
            this.btnIDCheck.Size = new System.Drawing.Size(150, 85);
            this.btnIDCheck.TabIndex = 42;
            this.btnIDCheck.Text = "ID Check";
            this.btnIDCheck.UseVisualStyleBackColor = true;
            this.btnIDCheck.Click += new System.EventHandler(this.BtnIDCheck_Click);
            // 
            // btnQRCode
            // 
            this.btnQRCode.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnQRCode.Location = new System.Drawing.Point(206, 312);
            this.btnQRCode.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.btnQRCode.Name = "btnQRCode";
            this.btnQRCode.Size = new System.Drawing.Size(150, 85);
            this.btnQRCode.TabIndex = 43;
            this.btnQRCode.Text = "QR Code";
            this.btnQRCode.UseVisualStyleBackColor = true;
            this.btnQRCode.Click += new System.EventHandler(this.BtnQRCode_Click);
            // 
            // btnApproval
            // 
            this.btnApproval.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnApproval.Location = new System.Drawing.Point(386, 312);
            this.btnApproval.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.btnApproval.Name = "btnApproval";
            this.btnApproval.Size = new System.Drawing.Size(150, 85);
            this.btnApproval.TabIndex = 44;
            this.btnApproval.Text = "Approval";
            this.btnApproval.UseVisualStyleBackColor = true;
            this.btnApproval.Click += new System.EventHandler(this.BtnApproval_Click);
            // 
            // txtSubjectCode
            // 
            this.txtSubjectCode.BackColor = System.Drawing.Color.LightYellow;
            this.txtSubjectCode.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.txtSubjectCode.Location = new System.Drawing.Point(24, 224);
            this.txtSubjectCode.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.txtSubjectCode.Name = "txtSubjectCode";
            this.txtSubjectCode.Size = new System.Drawing.Size(198, 33);
            this.txtSubjectCode.TabIndex = 57;
            this.txtSubjectCode.TextChanged += new System.EventHandler(this.TxtSubjectCode_TextChanged);
            // 
            // FrmNewSubject
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(144F, 144F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.ClientSize = new System.Drawing.Size(741, 444);
            this.Controls.Add(this.txtSubjectCode);
            this.Controls.Add(this.btnApproval);
            this.Controls.Add(this.btnQRCode);
            this.Controls.Add(this.btnIDCheck);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.btnCancel);
            this.DoubleBuffered = true;
            this.MaximumSize = new System.Drawing.Size(763, 500);
            this.MinimumSize = new System.Drawing.Size(763, 500);
            this.Name = "FrmNewSubject";
            this.ShowIcon = false;
            this.Text = "New Subject";
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.FrmNewSubject_FormClosed);
            this.Load += new System.EventHandler(this.FrmNewSubject_Load);
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.panel2.ResumeLayout(false);
            this.panel2.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnCancel;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Label lblStudyName;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Label lblHospitalName;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button btnIDCheck;
        private System.Windows.Forms.Button btnQRCode;
        private System.Windows.Forms.Button btnApproval;
        private System.Windows.Forms.TextBox txtSubjectCode;
    }
}