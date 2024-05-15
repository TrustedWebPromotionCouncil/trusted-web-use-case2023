using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prototype02
{
    [System.Runtime.Serialization.DataContract]
    class BoxAuth
    {
        [System.Runtime.Serialization.DataMember()]
        public string access_token { get; set; }
    }
}
