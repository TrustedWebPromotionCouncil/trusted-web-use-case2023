namespace Prototype02.Forms
{
    partial class FrmSelectStudyHospital
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
            this.lstStudyHospital = new System.Windows.Forms.ListBox();
            this.lblStudyHospital = new System.Windows.Forms.Label();
            this.btnSelect = new System.Windows.Forms.Button();
            this.lblMessage = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // lstStudyHospital
            // 
            this.lstStudyHospital.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.lstStudyHospital.FormattingEnabled = true;
            this.lstStudyHospital.HorizontalScrollbar = true;
            this.lstStudyHospital.ItemHeight = 25;
            this.lstStudyHospital.Location = new System.Drawing.Point(13, 47);
            this.lstStudyHospital.Margin = new System.Windows.Forms.Padding(4);
            this.lstStudyHospital.Name = "lstStudyHospital";
            this.lstStudyHospital.Size = new System.Drawing.Size(463, 279);
            this.lstStudyHospital.TabIndex = 8;
            this.lstStudyHospital.SelectedIndexChanged += new System.EventHandler(this.lstStudyHospital_SelectedIndexChanged);
            this.lstStudyHospital.Format += new System.Windows.Forms.ListControlConvertEventHandler(this.lstStudyHospital_Format);
            this.lstStudyHospital.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.lstStudyHospital_MouseDoubleClick);
            // 
            // lblStudyHospital
            // 
            this.lblStudyHospital.AutoSize = true;
            this.lblStudyHospital.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.lblStudyHospital.Location = new System.Drawing.Point(14, 18);
            this.lblStudyHospital.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblStudyHospital.Name = "lblStudyHospital";
            this.lblStudyHospital.Size = new System.Drawing.Size(223, 25);
            this.lblStudyHospital.TabIndex = 7;
            this.lblStudyHospital.Text = "Select Study-Hospital";
            // 
            // btnSelect
            // 
            this.btnSelect.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.btnSelect.Location = new System.Drawing.Point(152, 366);
            this.btnSelect.Margin = new System.Windows.Forms.Padding(4);
            this.btnSelect.Name = "btnSelect";
            this.btnSelect.Size = new System.Drawing.Size(192, 59);
            this.btnSelect.TabIndex = 6;
            this.btnSelect.Text = "Select";
            this.btnSelect.UseVisualStyleBackColor = true;
            this.btnSelect.Click += new System.EventHandler(this.btnSelect_Click);
            // 
            // lblMessage
            // 
            this.lblMessage.AutoSize = true;
            this.lblMessage.Font = new System.Drawing.Font("Meiryo UI", 10F);
            this.lblMessage.ForeColor = System.Drawing.Color.Red;
            this.lblMessage.Location = new System.Drawing.Point(15, 334);
            this.lblMessage.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblMessage.Name = "lblMessage";
            this.lblMessage.Size = new System.Drawing.Size(87, 25);
            this.lblMessage.TabIndex = 15;
            this.lblMessage.Text = "メッセージ";
            // 
            // FrmSelectStudyHospital
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(144F, 144F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.ClientSize = new System.Drawing.Size(492, 441);
            this.Controls.Add(this.lblMessage);
            this.Controls.Add(this.lstStudyHospital);
            this.Controls.Add(this.lblStudyHospital);
            this.Controls.Add(this.btnSelect);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Margin = new System.Windows.Forms.Padding(4);
            this.MaximumSize = new System.Drawing.Size(514, 497);
            this.MinimumSize = new System.Drawing.Size(514, 497);
            this.Name = "FrmSelectStudyHospital";
            this.ShowIcon = false;
            this.Text = "SelectStudyHospital";
            this.Load += new System.EventHandler(this.FrmSelectStudyHospital_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ListBox lstStudyHospital;
        private System.Windows.Forms.Label lblStudyHospital;
        private System.Windows.Forms.Button btnSelect;
        private System.Windows.Forms.Label lblMessage;
    }
}