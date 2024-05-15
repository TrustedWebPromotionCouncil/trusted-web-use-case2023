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
    public partial class FrmTemplate : Form
    {
        public FrmTemplate()
        {
            InitializeComponent();

            //デザイン
            this.BackColor = Constans.GeBackClor();
        }
    }
}
