using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using LearningPlatform.Api.Models;
using LearningPlatform.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly LearningPlatformDbContext _dbContext;
    private readonly PasswordHasher _passwordHasher;
    private readonly JwtTokenService _tokenService;

    public AuthController(
        LearningPlatformDbContext dbContext,
        PasswordHasher passwordHasher,
        JwtTokenService tokenService)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = _dbContext.Users.FirstOrDefault(u => u.Phone == request.Phone);
        if (user is null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "गलत मोबाइल नंबर या पासवर्ड" });
        }

        var token = _tokenService.CreateToken(user);
        var activeSubscription = _dbContext.Subscriptions
            .Include(subscription => subscription.MembershipPlan)
            .Where(subscription => subscription.UserId == user.Id && subscription.Status == "Active")
            .OrderByDescending(subscription => subscription.StartsAt)
            .FirstOrDefault();
        return Ok(new AuthResponse(token, ToProfile(user, activeSubscription)));
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        if (_dbContext.Users.Any(u => u.Phone == request.Phone))
        {
            return Conflict(new { message = "यह मोबाइल नंबर पहले से मौजूद है" });
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Phone = request.Phone,
            City = request.City,
            PreferredLanguage = request.PreferredLanguage,
            PasswordHash = _passwordHasher.Hash(request.Password),
            Role = string.IsNullOrWhiteSpace(request.Role) ? "Student" : request.Role
        };

        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();

        var enrollments = _dbContext.Courses.Select(course => new Enrollment
        {
            Id = Guid.NewGuid(),
            CourseId = course.Id,
            UserId = user.Id,
            Progress = 0
        }).ToList();

        _dbContext.Enrollments.AddRange(enrollments);
        _dbContext.SaveChanges();

        var defaultPlan = _dbContext.MembershipPlans.FirstOrDefault(plan => plan.Name == "Starter");
        Subscription? subscription = null;
        if (defaultPlan is not null)
        {
            subscription = new Subscription
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                MembershipPlanId = defaultPlan.Id,
                Status = "Active",
                StartsAt = DateTime.UtcNow
            };
            subscription.MembershipPlan = defaultPlan;
            _dbContext.Subscriptions.Add(subscription);
            _dbContext.SaveChanges();
        }

        var token = _tokenService.CreateToken(user);
        return Ok(new AuthResponse(token, ToProfile(user, subscription)));
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        if (userId is null || !Guid.TryParse(userId, out var parsedId))
        {
            return Unauthorized();
        }

        var user = _dbContext.Users.FirstOrDefault(u => u.Id == parsedId);
        if (user is null)
        {
            return NotFound();
        }

        var activeSubscription = _dbContext.Subscriptions
            .Include(subscription => subscription.MembershipPlan)
            .Where(subscription => subscription.UserId == user.Id && subscription.Status == "Active")
            .OrderByDescending(subscription => subscription.StartsAt)
            .FirstOrDefault();
        return Ok(ToProfile(user, activeSubscription));
    }

    private static UserProfile ToProfile(User user, Subscription? subscription)
    {
        var activePlan = subscription?.MembershipPlan?.Name;
        return new UserProfile(user.Id, user.Name, user.Phone, user.PreferredLanguage, user.City, user.Role, activePlan, subscription?.Status);
    }
}
