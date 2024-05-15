using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace Prototype02.Models
{
    public class FileModel
    {
        public int? Test { get; set; }

        public string FileFullName { get; set; } = "";

        public string FileName { get; set; } = "";
        
        public string BoxId { get; set; } = "";
        
        public bool EncryptSuccess { get; set; } = false;

        public string EncryptErrorId { get; set; } = "";

        public string[] EncryptErrorArg;

        public FileModel(string str)
        {
            FileFullName = str;
            FileName = Path.GetFileName(FileFullName);
        }



    }
}
