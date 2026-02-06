using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/teacher")]
[Authorize]
public class TeacherController : ControllerBase
{
    private readonly LearningPlatformDbContext _dbContext;

    public TeacherController(LearningPlatformDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("overview")]
    public IActionResult GetOverview()
    {
        if (!IsTeacher())
        {
            return Forbid();
        }

        var teacherId = GetUserId();
        if (teacherId is null)
        {
            return Unauthorized();
        }

        var subjectIds = _dbContext.StaffAssignments
            .Where(assignment => assignment.StaffId == teacherId.Value)
            .Select(assignment => assignment.SubjectId)
            .ToList();

        var subjects = _dbContext.Subjects
            .Where(subject => subjectIds.Contains(subject.Id))
            .Select(subject => new SubjectDto(subject.Id, subject.Name, subject.Description, subject.Language))
            .ToList();

        var lectures = _dbContext.Lectures
            .Include(lecture => lecture.Course)
            .Where(lecture => lecture.Course.SubjectId != null && subjectIds.Contains(lecture.Course.SubjectId.Value))
            .Select(lecture => new LectureDto(
                lecture.Id,
                lecture.CourseId,
                lecture.Course.Title,
                lecture.Title,
                lecture.ScheduledAt,
                lecture.DurationMinutes,
                lecture.IsLive))
            .ToList();

        var liveSessions = _dbContext.LiveSessions
            .Include(session => session.Lecture)
            .Include(session => session.Teacher)
            .Where(session => session.TeacherId == teacherId.Value)
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

        var notes = _dbContext.LectureNotes
            .Include(note => note.Lecture)
            .Where(note => note.UploadedById == teacherId.Value)
            .Select(note => new LectureNoteDto(
                note.Id,
                note.LectureId,
                note.Lecture.Title,
                note.Title,
                note.FileUrl,
                note.Summary,
                note.UploadedAt))
            .ToList();

        return Ok(new TeacherOverviewResponse(subjects, lectures, liveSessions, notes));
    }

    [HttpPost("live-sessions/start")]
    public IActionResult StartLiveSession([FromBody] StartLiveSessionRequest request)
    {
        if (!IsTeacher())
        {
            return Forbid();
        }

        var teacherId = GetUserId();
        if (teacherId is null)
        {
            return Unauthorized();
        }

        var lecture = _dbContext.Lectures.FirstOrDefault(item => item.Id == request.LectureId);
        if (lecture is null)
        {
            return NotFound(new { message = "Lecture नहीं मिला" });
        }

        var session = new LiveSession
        {
            Id = Guid.NewGuid(),
            LectureId = lecture.Id,
            TeacherId = teacherId.Value,
            StartsAt = DateTime.UtcNow,
            Status = "Live",
            StreamUrl = $"https://stream.local/{lecture.Id}",
            RoomCode = $"ROOM-{Random.Shared.Next(1000, 9999)}"
        };

        lecture.IsLive = true;
        _dbContext.LiveSessions.Add(session);
        _dbContext.SaveChanges();

        return Ok(new LiveSessionDto(
            session.Id,
            session.LectureId,
            lecture.Title,
            session.TeacherId,
            _dbContext.Users.Where(user => user.Id == session.TeacherId).Select(user => user.Name).FirstOrDefault() ?? "Teacher",
            session.StartsAt,
            session.Status,
            session.StreamUrl,
            session.RoomCode));
    }

    [HttpPost("notes")]
    public IActionResult UploadNotes([FromBody] CreateLectureNoteRequest request)
    {
        if (!IsTeacher())
        {
            return Forbid();
        }

        var teacherId = GetUserId();
        if (teacherId is null)
        {
            return Unauthorized();
        }

        var lecture = _dbContext.Lectures.FirstOrDefault(item => item.Id == request.LectureId);
        if (lecture is null)
        {
            return NotFound(new { message = "Lecture नहीं मिला" });
        }

        var note = new LectureNote
        {
            Id = Guid.NewGuid(),
            LectureId = lecture.Id,
            UploadedById = teacherId.Value,
            Title = request.Title,
            FileUrl = request.FileUrl,
            Summary = request.Summary,
            UploadedAt = DateTime.UtcNow
        };

        _dbContext.LectureNotes.Add(note);
        _dbContext.SaveChanges();

        return Ok(new LectureNoteDto(note.Id, note.LectureId, lecture.Title, note.Title, note.FileUrl, note.Summary, note.UploadedAt));
    }

    [HttpGet("notes")]
    public IActionResult GetNotes()
    {
        if (!IsTeacher())
        {
            return Forbid();
        }

        var teacherId = GetUserId();
        if (teacherId is null)
        {
            return Unauthorized();
        }

        var notes = _dbContext.LectureNotes
            .Include(note => note.Lecture)
            .Where(note => note.UploadedById == teacherId.Value)
            .Select(note => new LectureNoteDto(
                note.Id,
                note.LectureId,
                note.Lecture.Title,
                note.Title,
                note.FileUrl,
                note.Summary,
                note.UploadedAt))
            .ToList();

        return Ok(notes);
    }

    private bool IsTeacher()
    {
        return User.Claims.FirstOrDefault(claim => claim.Type == "role")?.Value == "Teacher";
    }

    private Guid? GetUserId()
    {
        var value = User.Claims.FirstOrDefault(claim => claim.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        return Guid.TryParse(value, out var parsed) ? parsed : null;
    }
}
