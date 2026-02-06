namespace LearningPlatform.Api.Models;

public class Subscription
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid MembershipPlanId { get; set; }
    public MembershipPlan MembershipPlan { get; set; } = null!;
    public string Status { get; set; } = "Active";
    public DateTime StartsAt { get; set; }
    public DateTime? EndsAt { get; set; }
}
