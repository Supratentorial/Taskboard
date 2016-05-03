using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using taskboard.Models;

namespace taskboard.Controllers
{
    public class PatientsController : ApiController
    {
        private TaskboardDbContext db = new TaskboardDbContext();

        // GET: api/patients
        public IQueryable<Patient> GetPatients()
        {
            return db.Patients.Include("Tasks");
        }

        // GET: api/patients/5 (by ID)
        [Route("api/patients/{id}")]
        [ResponseType(typeof(Patient))]
        public IHttpActionResult GetPatientById(int id)
        {
            Patient patient = db.Patients.Find(id);
            if (patient == null)
            {
                return NotFound();
            }
            return Ok(patient);
        }

        //GET: api/patients/urn/223981 (by UR)
        [Route("api/patients/urn/{patientUrn}")]
        [HttpGet]
        [ResponseType(typeof(Patient))]
        public IHttpActionResult GetPatientByUrn(int patientUrn)
        {
            Patient patient = db.Patients.SingleOrDefault(p => p.PatientUrn == patientUrn);
            if (patient == null)
            {
                return NotFound();
            }
            return Ok(patient);
        }
    }
}