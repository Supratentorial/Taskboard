using Newtonsoft.Json;
using System;

namespace taskboard.Models
{
    public class Task
    {
        public int TaskId { get; set; }
        public DateTime TimeCreated { get; set; }
        public String Description { get; set; }
        public String Background { get; set; }
        public String Status { get; set; }
        public String CreatedBy { get; set; }
        public String ContactNumber { get; set; }
    }
}