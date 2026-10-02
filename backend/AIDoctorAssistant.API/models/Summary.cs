namespace AIDoctorAssistant.API.Models
{
    public class Summary
    {
        public int Id { get; set; }
        public int ConsultationId { get; set; }
        public string DoctorSummary { get; set; } = string.Empty;
        public string PatientSummary { get; set; } = string.Empty;
        public string KeySymptoms { get; set; } = string.Empty;
        public string Advice { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public Consultation? Consultation { get; set; }
    }
}