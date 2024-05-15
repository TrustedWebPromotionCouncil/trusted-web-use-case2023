using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using CroTrustedDirectory.Models;
using System.Reflection;

namespace Prototype02.Common
{
    class mySubjectContact : SubjectContact
    {

        public mySubjectContact(SubjectContact subjectContact)
        {
            // 親クラスのプロパティ情報を一気に取得して使用する。
            List<PropertyInfo> props = subjectContact
                .GetType()
                .GetProperties(BindingFlags.Instance | BindingFlags.Public)?
                .ToList();

            props.ForEach(prop =>
            {
                var propValue = prop.GetValue(subjectContact);
                typeof(mySubjectContact).GetProperty(prop.Name).SetValue(this, propValue);
            });
        }

        public string FirstIcDateDisp
        {
            get { 
                return ExtensionMethod.ToFormatString(FirstIcDate);
            }
        }
        public string WithdrawIcDateDisp
        {
            get { 
                return ExtensionMethod.ToFormatString(WithdrawIcDate);
            }
        }
        public string EndDateDisp
        {
            get {
                return ExtensionMethod.ToFormatString(EndDate);
            }
        }
    }
}
