namespace LearningPlatform.Api.Models;

public class Subject
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Language { get; set; } = "hi";
    public ICollection<Course> Courses { get; set; } = new List<Course>();
    public ICollection<StaffAssignment> StaffAssignments { get; set; } = new List<StaffAssignment>();
}
