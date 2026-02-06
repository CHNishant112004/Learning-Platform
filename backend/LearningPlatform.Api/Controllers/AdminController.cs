using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly LearningPlatformDbContext _dbContext;

    public AdminController(LearningPlatformDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("overview")]
    public IActionResult GetOverview()
    {
        if (!IsAdmin())
        {
            return Forbid();
        }

        var subjects = _dbContext.Subjects
            .AsNoTracking()
            .Select(subject => new SubjectDto(subject.Id, subject.Name, subject.Description, subject.Language))
            .ToList();

        var assignments = _dbContext.StaffAssignments
            .Include(assignment => assignment.Subject)
            .Include(assignment => assignment.Staff)
            .AsNoTracking()
            .Select(assignment => new StaffAssignmentDto(
                assignment.Id,
                assignment.StaffId,
                assignment.Staff.Name,
                assignment.SubjectId,
                assignment.Subject.Name,
                assignment.Role,
                assignment.AssignedAt))
            .ToList();

        var staff = _dbContext.Users
            .Where(user => user.Role != "Student")
            .AsNoTracking()
            .Select(user => new StaffDto(user.Id, user.Name, user.Role, user.Phone))
            .ToList();

        var lectures = _dbContext.Lectures
            .Include(lecture => lecture.Course)
            .AsNoTracking()
            .Select(lecture => new LectureDto(
                lecture.Id,
                lecture.CourseId,
                lecture.Course.Title,
                lecture.Title,
                lecture.ScheduledAt,
                lecture.DurationMinutes,
                lecture.IsLive))
            .ToList();

        var courses = _dbContext.Courses
            .AsNoTracking()
            .Select(course => new CourseSummaryDto(course.Id, course.Title, course.Description, course.Subject, 0))
            .ToList();

        var plans = _dbContext.MembershipPlans
            .AsNoTracking()
            .Select(plan => new MembershipPlanDto(
                plan.Id,
                plan.Name,
                plan.Price,
                plan.BillingCycle,
                plan.FeaturesCsv.Split('|', StringSplitOptions.RemoveEmptyEntries).ToList(),
                plan.IsActive))
            .ToList();

        return Ok(new AdminOverviewResponse(subjects, staff, assignments, courses, lectures, plans));
    }

    [HttpPost("subjects")]
    public IActionResult CreateSubject([FromBody] CreateSubjectRequest request)
    {
        if (!IsAdmin())
        {
            return Forbid();
        }

        var subject = new Subject
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Language = request.Language
        };

        _dbContext.Subjects.Add(subject);
        _dbContext.SaveChanges();

        return Ok(new SubjectDto(subject.Id, subject.Name, subject.Description, subject.Language));
    }

    [HttpPost("staff/assign")]
    public IActionResult AssignStaff([FromBody] AssignStaffRequest request)
    {
        if (!IsAdmin())
        {
            return Forbid();
        }

        var staff = _dbContext.Users.FirstOrDefault(user => user.Id == request.StaffId);
        var subject = _dbContext.Subjects.FirstOrDefault(subject => subject.Id == request.SubjectId);
        if (staff is null || subject is null)
        {
            return NotFound(new { message = "Staff या Subject नहीं मिला" });
        }

        var adminId = GetUserId();
        if (adminId is null)
        {
            return Unauthorized();
        }

        var assignment = new StaffAssignment
        {
            Id = Guid.NewGuid(),
            StaffId = staff.Id,
            SubjectId = subject.Id,
            AssignedById = adminId.Value,
            Role = request.Role,
            AssignedAt = DateTime.UtcNow
        };

        _dbContext.StaffAssignments.Add(assignment);
        _dbContext.SaveChanges();

        return Ok(new StaffAssignmentDto(
            assignment.Id,
            staff.Id,
            staff.Name,
            subject.Id,
            subject.Name,
            assignment.Role,
            assignment.AssignedAt));
    }

    [HttpPost("courses")]
    public IActionResult CreateCourse([FromBody] CreateCourseRequest request)
    {
        if (!IsAdmin())
        {
            return Forbid();
        }

        var subject = _dbContext.Subjects.FirstOrDefault(item => item.Id == request.SubjectId);
        if (subject is null)
        {
            return NotFound(new { message = "Subject नहीं मिला" });
        }

        var course = new Course
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            SubjectId = subject.Id,
            Subject = subject.Name
        };

        _dbContext.Courses.Add(course);
        _dbContext.SaveChanges();

        return Ok(new CourseSummaryDto(course.Id, course.Title, course.Description, course.Subject, 0));
    }

    [HttpPost("lectures")]
    public IActionResult CreateLecture([FromBody] CreateLectureRequest request)
    {
        if (!IsAdmin())
        {
            return Forbid();
        }

        var course = _dbContext.Courses.FirstOrDefault(item => item.Id == request.CourseId);
        if (course is null)
        {
            return NotFound(new { message = "Course नहीं मिला" });
        }

        var lecture = new Lecture
        {
            Id = Guid.NewGuid(),
            CourseId = course.Id,
            Title = request.Title,
            ScheduledAt = request.ScheduledAt,
            DurationMinutes = request.DurationMinutes,
            IsLive = false
        };

        _dbContext.Lectures.Add(lecture);
        _dbContext.SaveChanges();

        return Ok(new LectureDto(
            lecture.Id,
            lecture.CourseId,
            course.Title,
            lecture.Title,
            lecture.ScheduledAt,
            lecture.DurationMinutes,
            lecture.IsLive));
    }

    [HttpPost("membership-plans")]
    public IActionResult CreateMembershipPlan([FromBody] CreateMembershipPlanRequest request)
    {
        if (!IsAdmin())
        {
            return Forbid();
        }

        var plan = new MembershipPlan
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Price = request.Price,
            BillingCycle = request.BillingCycle,
            FeaturesCsv = string.Join('|', request.Features ?? new List<string>()),
            IsActive = true
        };

        _dbContext.MembershipPlans.Add(plan);
        _dbContext.SaveChanges();

        return Ok(new MembershipPlanDto(plan.Id, plan.Name, plan.Price, plan.BillingCycle, request.Features ?? new List<string>(), plan.IsActive));
    }

    private bool IsAdmin()
    {
        return User.Claims.FirstOrDefault(claim => claim.Type == "role")?.Value == "Admin";
    }

    private Guid? GetUserId()
    {
        var value = User.Claims.FirstOrDefault(claim => claim.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        return Guid.TryParse(value, out var parsed) ? parsed : null;
    }
}
