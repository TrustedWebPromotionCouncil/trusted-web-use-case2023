using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Prototype02.Common
{
    class MyTreeNode : TreeNode
    {
        public int IcId { get; set; }

        public int IcDocSeq { get; set; }

        public string EsignStatus { get; set; }
        public string IcDocBoxId { get; set; }
        public string IcDocName { get; set; }
        public string EsignSignerId { get; set; }
        public DateTime EsignDate { get; set; }

        public int IcNumber { get; set; }
    }
}
