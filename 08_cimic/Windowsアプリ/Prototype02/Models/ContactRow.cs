using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prototype02.Models
{
    class ContactRow
    {
        //区分（P:Paticipant,S:Subject）
        public string Div { get; set; }
        public string Name { get; set; }
        public string SubName { get; set; }
        public string Uri { get; set; }
    }
}
