namespace LearningPlatform.Api.Dtos;

public record RegisterRequest(string Name, string Phone, string Password, string PreferredLanguage, string City, string? Role);

public record LoginRequest(string Phone, string Password);

public record AuthResponse(string Token, UserProfile User);

public record UserProfile(Guid Id, string Name, string Phone, string PreferredLanguage, string City, string Role, string? ActivePlan, string? SubscriptionStatus);
