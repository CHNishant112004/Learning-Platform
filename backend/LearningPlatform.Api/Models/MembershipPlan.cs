namespace LearningPlatform.Api.Models;

public class MembershipPlan
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string BillingCycle { get; set; } = "Monthly";
    public string FeaturesCsv { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
