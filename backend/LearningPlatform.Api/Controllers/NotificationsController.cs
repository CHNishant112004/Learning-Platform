using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using LearningPlatform.Api.Hubs;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly LearningPlatformDbContext _dbContext;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationsController(LearningPlatformDbContext dbContext, IHubContext<NotificationHub> hubContext)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
    }

    [HttpGet]
    public IActionResult GetNotifications()
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var notifications = _dbContext.Notifications
            .Where(notification => notification.UserId == userId.Value)
            .OrderByDescending(notification => notification.CreatedAt)
            .Select(notification => new NotificationDto(
                notification.Id,
                notification.Title,
                notification.Message,
                notification.IsRead,
                notification.Channel,
                notification.CreatedAt))
            .ToList();

        return Ok(notifications);
    }

    [HttpPost("read")]
    public IActionResult MarkRead([FromBody] MarkNotificationReadRequest request)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var notification = _dbContext.Notifications.FirstOrDefault(item => item.Id == request.NotificationId && item.UserId == userId.Value);
        if (notification is null)
        {
            return NotFound(new { message = "Notification नहीं मिला" });
        }

        notification.IsRead = true;
        _dbContext.SaveChanges();

        return Ok(new NotificationDto(notification.Id, notification.Title, notification.Message, notification.IsRead, notification.Channel, notification.CreatedAt));
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendNotification([FromBody] CreateNotificationRequest request)
    {
        var senderRole = User.Claims.FirstOrDefault(claim => claim.Type == "role")?.Value;
        if (senderRole != "Admin" && senderRole != "Teacher")
        {
            return Forbid();
        }

        var user = _dbContext.Users.FirstOrDefault(item => item.Id == request.UserId);
        if (user is null)
        {
            return NotFound(new { message = "User नहीं मिला" });
        }

        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Title = request.Title,
            Message = request.Message,
            Channel = request.Channel,
            CreatedAt = DateTime.UtcNow,
            IsRead = false
        };

        _dbContext.Notifications.Add(notification);
        _dbContext.SaveChanges();

        var dto = new NotificationDto(notification.Id, notification.Title, notification.Message, notification.IsRead, notification.Channel, notification.CreatedAt);
        await _hubContext.Clients.Group(request.UserId.ToString()).SendAsync("notification", dto);

        return Ok(dto);
    }

    private Guid? GetUserId()
    {
        var value = User.Claims.FirstOrDefault(claim => claim.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        return Guid.TryParse(value, out var parsed) ? parsed : null;
    }
}
