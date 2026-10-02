namespace AIDoctorAssistant.API.Models
{
    public class PredictionResult
    {
        public string PredictedDisease { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public string Severity { get; set; } = string.Empty;
        public List<string> Treatment { get; set; } = new();
        public List<Top5Prediction> Top5Predictions { get; set; } = new();
    }

    public class Top5Prediction
    {
        public string Disease { get; set; } = string.Empty;
        public double Confidence { get; set; }
    }
}