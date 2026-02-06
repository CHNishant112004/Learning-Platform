namespace LearningPlatform.Api.Models;

public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = "hi";
    public string City { get; set; } = string.Empty;
    public string Role { get; set; } = "Student";
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
