namespace LearningPlatform.Api.Dtos;

public record MembershipPlanDto(Guid Id, string Name, decimal Price, string BillingCycle, List<string> Features, bool IsActive);

public record CreateMembershipPlanRequest(string Name, decimal Price, string BillingCycle, List<string> Features);

public record SubscriptionDto(Guid Id, Guid UserId, Guid PlanId, string PlanName, string Status, DateTime StartsAt, DateTime? EndsAt);

public record SubscribeRequest(Guid PlanId);
