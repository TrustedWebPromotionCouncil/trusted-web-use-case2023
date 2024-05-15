using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prototype02
{
    public class BoxFileInfo
    {
        public string id { get; set; } = "";
        public string nm { get; set; } = "";
        public DateTimeOffset createDate { get; set; }
        public DateTimeOffset modifyDate { get; set; }
    }
}
