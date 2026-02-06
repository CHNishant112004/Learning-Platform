using Microsoft.AspNetCore.SignalR;

namespace LearningPlatform.Api.Hubs;

public class NotificationHub : Hub
{
    public async Task JoinUserRoom(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, userId);
    }
}
