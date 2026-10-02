using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using AIDoctorAssistant.API.Data;
using AIDoctorAssistant.API.Hubs;
using AIDoctorAssistant.API.Models;
using AIDoctorAssistant.API.Services;

namespace AIDoctorAssistant.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConsultationController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly PythonBridgeService _python;
        private readonly IHubContext<ConsultationHub> _hub;

        public ConsultationController(AppDbContext db, PythonBridgeService python, IHubContext<ConsultationHub> hub)
        {
            _db = db;
            _python = python;
            _hub = hub;
        }

        [HttpPost("start")]
        public async Task<IActionResult> Start([FromBody] StartRequest req)
        {
            var consultation = new Consultation
            {
                PatientName = req.PatientName,
                StartedAt = DateTime.UtcNow,
                Status = "Active"
            };
            _db.Consultations.Add(consultation);
            await _db.SaveChangesAsync();
            return Ok(consultation);
        }

        [HttpPost("{id}/message")]
        public async Task<IActionResult> AddMessage(int id, [FromBody] MessageRequest req)
        {
            var consultation = await _db.Consultations.FindAsync(id);
            if (consultation == null) return NotFound();

            var message = new Message
            {
                ConsultationId = id,
                Sender = req.Sender,
                Content = req.Content,
                Timestamp = DateTime.UtcNow
            };
            _db.Messages.Add(message);
            await _db.SaveChangesAsync();

            await _hub.Clients.Group(id.ToString()).SendAsync("NewMessage", message);
            return Ok(message);
        }

        [HttpPost("{id}/predict")]
        public async Task<IActionResult> Predict(int id, [FromBody] PredictRequest req)
        {
            var consultation = await _db.Consultations.FindAsync(id);
            if (consultation == null) return NotFound();

            var result = await _python.PredictDiseaseAsync(req.Symptoms);
            if (result == null) return StatusCode(500, "ML service error");

            consultation.PredictedDisease = result.PredictedDisease;
            consultation.Severity = result.Severity;
            consultation.Confidence = result.Confidence;
            await _db.SaveChangesAsync();

            await _hub.Clients.Group(id.ToString()).SendAsync("PredictionResult", result);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var consultations = await _db.Consultations.Include(c => c.Messages).ToListAsync();
            return Ok(consultations);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var consultation = await _db.Consultations
                .Include(c => c.Messages)
                .Include(c => c.Summary)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (consultation == null) return NotFound();
            return Ok(consultation);
        }

        [HttpPost("{id}/end")]
        public async Task<IActionResult> End(int id)
        {
            var consultation = await _db.Consultations.FindAsync(id);
            if (consultation == null) return NotFound();
            consultation.Status = "Ended";
            consultation.EndedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(consultation);
        }
    }

    public record StartRequest(string PatientName);
    public record MessageRequest(string Sender, string Content);
    public record PredictRequest(List<string> Symptoms);
}