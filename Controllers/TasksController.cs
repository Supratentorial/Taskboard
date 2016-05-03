using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using taskboard.Models;

namespace taskboard.Controllers
{
    public class TasksController : ApiController
    {
        private TaskboardDbContext db = new TaskboardDbContext();

        //GET: api/alltasks
        [Route("api/alltasks")]
        [HttpGet]
        [ResponseType(typeof(TaskDTO))]
        public List<TaskDTO> GetAllTasks()
        {
            var patients = db.Patients.Where(p => p.Tasks.Any()).Include("Tasks");
            AutoMapper.Mapper.CreateMap<Patient, TaskDTO>();
            AutoMapper.Mapper.CreateMap<Task, TaskDTO>();
            List<TaskDTO> tasks = new List<TaskDTO>();
            foreach (Patient patient in patients)
            {
                foreach (Task task in patient.Tasks)
                {
                    {
                        TaskDTO dto = AutoMapper.Mapper.Map<Patient, TaskDTO>(patient);
                        AutoMapper.Mapper.Map<Task, TaskDTO>(task, dto);
                        tasks.Add(dto);
                    }
                }
            }
            return tasks;
        }

        // GET: api/newtasks
        [Route("api/newtasks")]
        [HttpGet]
        [ResponseType(typeof(TaskDTO))]
        public List<TaskDTO> GetNewTasks()
        {
            var patients = db.Patients.Where(p => p.Tasks.Any()).Include("Tasks");
            AutoMapper.Mapper.CreateMap<Patient, TaskDTO>();
            AutoMapper.Mapper.CreateMap<Task, TaskDTO>();
            List<TaskDTO> tasks = new List<TaskDTO>();
            foreach (Patient patient in patients)
            {
                foreach (Task task in patient.Tasks)
                {
                    if (task.Status == "New")
                    {
                        TaskDTO dto = AutoMapper.Mapper.Map<Patient, TaskDTO>(patient);
                        AutoMapper.Mapper.Map<Task, TaskDTO>(task, dto);
                        tasks.Add(dto);
                    }
                }
            }
            return tasks;
        }

        [Route ("api/acknowledgedtasks")]
        [HttpGet]
        public List<TaskDTO> GetAcknowledgedTasks()
        {
            var patients = db.Patients.Where(p => p.Tasks.Any()).Include("Tasks");
            AutoMapper.Mapper.CreateMap<Patient, TaskDTO>();
            AutoMapper.Mapper.CreateMap<Task, TaskDTO>();
            List<TaskDTO> tasks = new List<TaskDTO>();
            foreach (Patient patient in patients)
            {
                foreach (Task task in patient.Tasks)
                {
                    if (task.Status == "Acknowledged")
                    {
                        TaskDTO dto = AutoMapper.Mapper.Map<Patient, TaskDTO>(patient);
                        AutoMapper.Mapper.Map<Task, TaskDTO>(task, dto);
                        tasks.Add(dto);
                    }
                }
            }
            return tasks;
        }

         //GET: api/completedtasks
        [Route("api/completedtasks")]
        [HttpGet]
        public List<TaskDTO> GetCompletedTasks()
        {
            var patients = db.Patients.Where(p => p.Tasks.Any()).Include("Tasks");
            AutoMapper.Mapper.CreateMap<Patient, TaskDTO>();
            AutoMapper.Mapper.CreateMap<Task, TaskDTO>();
            List<TaskDTO> tasks = new List<TaskDTO>();
            foreach (Patient patient in patients)
            {
                foreach (Task task in patient.Tasks)
                {
                    if (task.Status == "Completed")
                    {
                        TaskDTO dto = AutoMapper.Mapper.Map<Patient, TaskDTO>(patient);
                        AutoMapper.Mapper.Map<Task, TaskDTO>(task, dto);
                        tasks.Add(dto);
                    }
                }
            }
            return tasks;
        }

        // GET: api/Tasks/5
        [ResponseType(typeof(Task))]
        public IHttpActionResult GetTask(int id)
        {
            Task task = db.Tasks.Find(id);
            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        // PUT: api/Tasks/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTask(int id, Task task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != task.TaskId)
            {
                return BadRequest();
            }

            db.Entry(task).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Tasks
        [ResponseType(typeof(Task))]
        public IHttpActionResult PostTask(TaskDTO taskDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            AutoMapper.Mapper.CreateMap<TaskDTO, Task>();
            var newTask = AutoMapper.Mapper.Map<TaskDTO, Task>(taskDTO);
            var patient = db.Patients.Where(p => p.PatientId == taskDTO.PatientId).Include(p => p.Tasks).Single();
            if (newTask.TaskId == 0)
            {
                patient.Tasks.Add(newTask);
                db.Entry(newTask).State = EntityState.Added;
                db.Entry(patient).State = EntityState.Modified;
            }
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = newTask.TaskId }, newTask);
        }

        // DELETE: api/Tasks/5
        [ResponseType(typeof(Task))]
        public IHttpActionResult DeleteTask(int id)
        {
            Task task = db.Tasks.Find(id);
            if (task == null)
            {
                return NotFound();
            }

            db.Tasks.Remove(task);
            db.SaveChanges();

            return Ok(task);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TaskExists(int id)
        {
            return db.Tasks.Count(e => e.TaskId == id) > 0;
        }
    }
}