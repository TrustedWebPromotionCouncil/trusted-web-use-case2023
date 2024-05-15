using Prototype02.Models;
using Prototype02.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using CroTrustedDirectory.Models;


namespace Prototype02.Models
{
    class MainModel
    {
        //アプリ内でメイン画面となるフォームのコンテキスト
        public static ApplicationContext MyApplicationContext { get; set; } = new ApplicationContext();

        public static DirectoryServiceImpl ds = new DirectoryServiceImpl();

        //ユーザ情報
        //public static Participant paticipnt = new Participant();

        //試験、施設リスト
        public static IList<StudyHospitalData> studyHospitalList = new List<StudyHospitalData>();

        //選択した試験-施設
        public static StudyHospital selectedStudyHospital = new StudyHospital();

        //選択した被検者
        //public static int selectedSubjectId;
        public static string selectedSubjectCode = "";

        //環境設定
        public static ConfigModel Config = new ConfigModel();
    }
}

