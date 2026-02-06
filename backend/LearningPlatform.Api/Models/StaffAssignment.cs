namespace LearningPlatform.Api.Models;

public class StaffAssignment
{
    public Guid Id { get; set; }
    public Guid StaffId { get; set; }
    public User Staff { get; set; } = null!;
    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;
    public Guid AssignedById { get; set; }
    public User AssignedBy { get; set; } = null!;
    public string Role { get; set; } = "Teacher";
    public DateTime AssignedAt { get; set; }
}
