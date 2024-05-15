using CroTrustedDirectory.Models.AuditLog;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prototype02
{
    public class AuditLogEntryJP
    {
        [JsonProperty("date_of_action")]
        public DateTime DateOfAction { get; set; }
        //フェーズ２では日本時間で登録するため不要
        //[JsonProperty("date_of_action_JP")]
        //public string DateOfActionJP { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("sub_name")]
        public string SubName { get; set; }
        //フェーズ２ではPaticipantIdもしくはStudy_Id-Subject_codeを戻すActionUserIdとして
        //[JsonProperty("participant_id")]
        //public string ParticipantId { get; set; }
        [JsonProperty("action_user_id")]
        public string ActionUserId { get; set; }
        [JsonProperty("action")]
        public AuditLogAction Action { get; set; }
        [JsonProperty("contact_list")]
        public string ContactList { get; set; }
        [JsonProperty("file_name")]
        public string FileName { get; set; }
        [JsonProperty("study_hospital_id")]
        public int StudyHospitalId { get; set; }
        //フェーズ２ではStudy_Id-Subject_codeを戻す（通常の暗号化・復号化ではNULL）
        [JsonProperty("study_subject")]
        public int? StudySubject { get; set; }
        //フェーズ２では廃止
        //[JsonProperty("uri")]
        //public string Uri { get; set; }
        [JsonProperty("hash")]
        public string Hash { get; set; }

        /// <summary>
        /// コンストラクタ（AuditLogEntityの日付を文字列変換し他をそのままコピー）
        /// </summary>
        /// <param name="ent"></param>
        public AuditLogEntryJP(AuditLogEntry ent)
        {
            this.DateOfAction = ent.DateOfAction;
            this.Name = ent.Name;
            this.SubName = ent.SubName;
            this.ActionUserId = ent.ActionUserId;
            this.Action = ent.Action;
            this.ContactList = ent.ContactList;
            this.FileName = ent.FileName;
            this.StudyHospitalId = ent.StudyHospitalId;
            this.StudySubject = ent.StudySubjectId;    
            this.Hash = ent.Hash;
        }
    }
}
