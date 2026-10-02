using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AIDoctorAssistant.API.Data;
using AIDoctorAssistant.API.Services;

namespace AIDoctorAssistant.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SummaryController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly SummaryService _summary;

        public SummaryController(AppDbContext db, SummaryService summary)
        {
            _db = db;
            _summary = summary;
        }

        [HttpPost("{consultationId}/generate")]
        public async Task<IActionResult> Generate(int consultationId)
        {
            var consultation = await _db.Consultations
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c => c.Id == consultationId);
            if (consultation == null) return NotFound();

            var summary = await _summary.GenerateAsync(consultation);
            return Ok(summary);
        }

        [HttpGet("{consultationId}")]
        public async Task<IActionResult> Get(int consultationId)
        {
            var summary = await _db.Summaries.FirstOrDefaultAsync(s => s.ConsultationId == consultationId);
            if (summary == null) return NotFound();
            return Ok(summary);
        }
    }
}