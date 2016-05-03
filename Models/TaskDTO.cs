using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace taskboard.Models
{
    public class TaskDTO
    {
        public DateTime TimeCreated { get; set; }
        public String Description { get; set; }
        public String Background { get; set; }
        public String Status { get; set; }
        public String CreatedBy { get; set; }
        public String ContactNumber { get; set; }
        public int PatientId { get; set; }
        public int PatientUrn { get; set; }
        public DateTime DateOfBirth { get; set; }
        public String LastName { get; set; }
        public String FirstName { get; set; }
        public String Site { get; set; }
        public String Ward { get; set; }
        public int Bed { get; set; }
        public String Unit { get; set; }

        public TaskDTO()
        {
            
        }
    }
}