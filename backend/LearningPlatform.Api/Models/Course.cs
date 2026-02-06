namespace LearningPlatform.Api.Models;

public class Course
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public Guid? SubjectId { get; set; }
    public Subject? SubjectRef { get; set; }
    public ICollection<Chapter> Chapters { get; set; } = new List<Chapter>();
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    public ICollection<Lecture> Lectures { get; set; } = new List<Lecture>();
}
