namespace AIDoctorAssistant.API.Models
{
    public class SentimentResult
    {
        public double Score { get; set; }
        public string Mood { get; set; } = string.Empty;
        public string Tone { get; set; } = string.Empty;
    }
}