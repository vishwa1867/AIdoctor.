using Microsoft.AspNetCore.SignalR;

namespace AIDoctorAssistant.API.Hubs
{
    public class ConsultationHub : Hub
    {
        public async Task JoinConsultation(string consultationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, consultationId);
        }

        public async Task LeaveConsultation(string consultationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, consultationId);
        }
    }
}