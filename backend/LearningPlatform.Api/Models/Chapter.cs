namespace LearningPlatform.Api.Models;

public class Chapter
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool Completed { get; set; }
    public Guid CourseId { get; set; }
    public Course? Course { get; set; }
    public ICollection<Topic> Topics { get; set; } = new List<Topic>();
}
