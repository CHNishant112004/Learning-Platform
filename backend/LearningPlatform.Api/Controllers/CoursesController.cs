using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/courses")]
[Authorize]
public class CoursesController : ControllerBase
{
    private readonly LearningPlatformDbContext _dbContext;

    public CoursesController(LearningPlatformDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public IActionResult GetCourses()
    {
        var userId = GetUserId();
        var courses = _dbContext.Courses
            .Include(course => course.Enrollments)
            .Where(course => course.Enrollments.Any(enrollment => enrollment.UserId == userId))
            .Select(course => new CourseSummaryDto(
                course.Id,
                course.Title,
                course.Description,
                course.Subject,
                course.Enrollments.FirstOrDefault(e => e.UserId == userId)?.Progress ?? 0))
            .ToList();

        return Ok(courses);
    }

    [HttpGet("{id:guid}")]
    public IActionResult GetCourseById(Guid id)
    {
        var userId = GetUserId();
        var course = _dbContext.Courses
            .Include(item => item.Chapters)
            .ThenInclude(chapter => chapter.Topics)
            .Include(item => item.Enrollments)
            .FirstOrDefault(item => item.Id == id);

        if (course is null)
        {
            return NotFound();
        }

        var progress = course.Enrollments.FirstOrDefault(e => e.UserId == userId)?.Progress ?? 0;
        var chapters = course.Chapters
            .Select(chapter => new ChapterDto(
                chapter.Id,
                chapter.Title,
                chapter.Completed,
                chapter.Topics.Select(topic => new TopicDto(topic.Id, topic.Title, topic.Content, topic.Completed)).ToList()))
            .ToList();

        var response = new CourseDetailDto(
            course.Id,
            course.Title,
            course.Description,
            course.Subject,
            progress,
            chapters);

        return Ok(response);
    }

    [HttpPost("{id:guid}/enroll")]
    public IActionResult Enroll(Guid id)
    {
        var userId = GetUserId();
        var course = _dbContext.Courses.FirstOrDefault(item => item.Id == id);
        if (course is null)
        {
            return NotFound();
        }

        if (_dbContext.Enrollments.Any(e => e.CourseId == id && e.UserId == userId))
        {
            return Ok();
        }

        _dbContext.Enrollments.Add(new Enrollment
        {
            Id = Guid.NewGuid(),
            CourseId = id,
            UserId = userId,
            Progress = 0
        });
        _dbContext.SaveChanges();
        return Ok();
    }

    private Guid GetUserId()
    {
        var claim = User.Claims.FirstOrDefault(c => c.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        return claim is not null && Guid.TryParse(claim, out var parsed) ? parsed : Guid.Empty;
    }
}
