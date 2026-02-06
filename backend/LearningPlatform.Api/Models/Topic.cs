namespace LearningPlatform.Api.Models;

public class Topic
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool Completed { get; set; }
    public Guid ChapterId { get; set; }
    public Chapter? Chapter { get; set; }
}
