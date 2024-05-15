using System;
using CroTrustedDirectory.Models;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Prototype02.Common
{

    //デバイスデータを復号化するための保持クラス
    public class MyDeviceData  
    {
        public SubjectContact subjectContact = new SubjectContact();
        public Activity acrivity = new Activity();
        public IList<DeviceData> DeviceDataList = new List<DeviceData>();
    }
}
