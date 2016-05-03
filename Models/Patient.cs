using System;
using System.Collections.Generic;

namespace taskboard.Models
{
    public class Patient
    {
        public int PatientId { get; set; }
        public int PatientUrn { get; set; }
        public String LastName { get; set; }
        public String FirstName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public String Gender { get; set; }
        public String Site { get; set; }
        public String Ward { get; set; }
        public int Bed { get; set; }
        public String Unit { get; set; }
        public List<Task> Tasks { get; set; }
    }
}