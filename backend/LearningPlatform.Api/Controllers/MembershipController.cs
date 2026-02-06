using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/membership")]
[Authorize]
public class MembershipController : ControllerBase
{
    private readonly LearningPlatformDbContext _dbContext;

    public MembershipController(LearningPlatformDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("plans")]
    public IActionResult GetPlans()
    {
        var plans = _dbContext.MembershipPlans
            .Where(plan => plan.IsActive)
            .Select(plan => new MembershipPlanDto(
                plan.Id,
                plan.Name,
                plan.Price,
                plan.BillingCycle,
                plan.FeaturesCsv.Split('|', StringSplitOptions.RemoveEmptyEntries).ToList(),
                plan.IsActive))
            .ToList();

        return Ok(plans);
    }

    [HttpPost("subscribe")]
    public IActionResult Subscribe([FromBody] SubscribeRequest request)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var plan = _dbContext.MembershipPlans.FirstOrDefault(item => item.Id == request.PlanId);
        if (plan is null)
        {
            return NotFound(new { message = "Plan नहीं मिला" });
        }

        var current = _dbContext.Subscriptions.FirstOrDefault(subscription => subscription.UserId == userId.Value && subscription.Status == "Active");
        if (current is not null)
        {
            current.Status = "Cancelled";
            current.EndsAt = DateTime.UtcNow;
        }

        var subscription = new Subscription
        {
            Id = Guid.NewGuid(),
            UserId = userId.Value,
            MembershipPlanId = plan.Id,
            Status = "Active",
            StartsAt = DateTime.UtcNow
        };

        _dbContext.Subscriptions.Add(subscription);
        _dbContext.SaveChanges();

        return Ok(new SubscriptionDto(subscription.Id, subscription.UserId, plan.Id, plan.Name, subscription.Status, subscription.StartsAt, subscription.EndsAt));
    }

    [HttpGet("my")]
    public IActionResult GetMyPlan()
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var subscription = _dbContext.Subscriptions
            .Include(item => item.MembershipPlan)
            .FirstOrDefault(item => item.UserId == userId.Value && item.Status == "Active");

        if (subscription is null)
        {
            return Ok(null);
        }

        return Ok(new SubscriptionDto(
            subscription.Id,
            subscription.UserId,
            subscription.MembershipPlanId,
            subscription.MembershipPlan.Name,
            subscription.Status,
            subscription.StartsAt,
            subscription.EndsAt));
    }

    private Guid? GetUserId()
    {
        var value = User.Claims.FirstOrDefault(claim => claim.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        return Guid.TryParse(value, out var parsed) ? parsed : null;
    }
}
