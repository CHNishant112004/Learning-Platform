namespace LearningPlatform.Api.Dtos;

public record NotificationDto(Guid Id, string Title, string Message, bool IsRead, string Channel, DateTime CreatedAt);

public record CreateNotificationRequest(Guid UserId, string Title, string Message, string Channel);

public record MarkNotificationReadRequest(Guid NotificationId);
