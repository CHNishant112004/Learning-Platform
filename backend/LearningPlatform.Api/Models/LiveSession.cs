namespace LearningPlatform.Api.Models;

public class LiveSession
{
    public Guid Id { get; set; }
    public Guid LectureId { get; set; }
    public Lecture Lecture { get; set; } = null!;
    public Guid TeacherId { get; set; }
    public User Teacher { get; set; } = null!;
    public DateTime StartsAt { get; set; }
    public DateTime? EndsAt { get; set; }
    public string Status { get; set; } = "Scheduled";
    public string StreamUrl { get; set; } = string.Empty;
    public string RoomCode { get; set; } = string.Empty;
}
