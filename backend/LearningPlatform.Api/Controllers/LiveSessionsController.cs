using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/live-sessions")]
[Authorize]
public class LiveSessionsController : ControllerBase
{
    private readonly LearningPlatformDbContext _dbContext;

    public LiveSessionsController(LearningPlatformDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public IActionResult GetLiveSessions()
    {
        var sessions = _dbContext.LiveSessions
            .Include(session => session.Lecture)
            .Include(session => session.Teacher)
            .Where(session => session.Status != "Ended")
            .OrderBy(session => session.StartsAt)
            .Select(session => new LiveSessionDto(
                session.Id,
                session.LectureId,
                session.Lecture.Title,
                session.TeacherId,
                session.Teacher.Name,
                session.StartsAt,
                session.Status,
                session.StreamUrl,
                session.RoomCode))
            .ToList();

        return Ok(sessions);
    }

    [HttpPost("{sessionId:guid}/join")]
    public IActionResult JoinSession(Guid sessionId)
    {
        var session = _dbContext.LiveSessions.FirstOrDefault(item => item.Id == sessionId);
        if (session is null)
        {
            return NotFound(new { message = "Live session नहीं मिला" });
        }

        return Ok(new JoinLiveSessionResponse(session.Id, session.StreamUrl, session.RoomCode));
    }
}
