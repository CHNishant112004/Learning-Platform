namespace LearningPlatform.Api.Models;

public class LectureNote
{
    public Guid Id { get; set; }
    public Guid LectureId { get; set; }
    public Lecture Lecture { get; set; } = null!;
    public Guid UploadedById { get; set; }
    public User UploadedBy { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}
