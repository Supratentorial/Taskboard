using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace taskboard.Models
{
    public class TaskboardDbContext : DbContext
    {
        public DbSet<Task> Tasks { get; set; }
        public DbSet<Patient> Patients { get; set; }

    }
}