namespace AIDoctorAssistant.API.Models
{
    public class Consultation
    {
        public int Id { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? EndedAt { get; set; }
        public string Status { get; set; } = "Active";
        public string PredictedDisease { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public List<Message> Messages { get; set; } = new();
        public Summary? Summary { get; set; }
    }
}