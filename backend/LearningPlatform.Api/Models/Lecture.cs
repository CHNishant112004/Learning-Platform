namespace LearningPlatform.Api.Models;

public class Lecture
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public DateTime ScheduledAt { get; set; }
    public int DurationMinutes { get; set; }
    public bool IsLive { get; set; }
    public ICollection<LectureNote> Notes { get; set; } = new List<LectureNote>();
    public ICollection<LiveSession> LiveSessions { get; set; } = new List<LiveSession>();
}
